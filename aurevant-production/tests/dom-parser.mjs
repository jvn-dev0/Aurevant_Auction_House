/**
 * Lightweight, zero-external-binary HTML tokenizer and DOM query engine for opaque-box E2E testing.
 * Implements standard DOM traversal, selector querying, and accessibility/interaction simulation.
 */

export class DOMNode {
  constructor(type, parent = null) {
    this.nodeType = type; // 1 = Element, 3 = Text, 8 = Comment
    this.parent = parent;
  }
}

export class DOMTextNode extends DOMNode {
  constructor(text, parent = null) {
    super(3, parent);
    this.rawText = text;
  }

  get textContent() {
    return this.rawText;
  }
}

export class DOMElement extends DOMNode {
  constructor(tagName, attributes = {}, parent = null) {
    super(1, parent);
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.children = [];
    this.activeElement = null;
  }

  get className() {
    return this.attributes['class'] || '';
  }

  get classList() {
    const classes = this.className.trim().split(/\s+/).filter(Boolean);
    return {
      contains: (cls) => classes.includes(cls),
      value: classes,
      length: classes.length,
      item: (i) => classes[i] || null,
      toString: () => this.className
    };
  }

  getAttribute(name) {
    const lower = name.toLowerCase();
    for (const [k, v] of Object.entries(this.attributes)) {
      if (k.toLowerCase() === lower) return v;
    }
    return null;
  }

  hasAttribute(name) {
    return this.getAttribute(name) !== null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  removeAttribute(name) {
    const lower = name.toLowerCase();
    for (const k of Object.keys(this.attributes)) {
      if (k.toLowerCase() === lower) {
        delete this.attributes[k];
      }
    }
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  get textContent() {
    return this.children
      .map((child) => child.textContent || '')
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  get innerHTML() {
    return this.children
      .map((child) => {
        if (child.nodeType === 3) return child.rawText;
        if (child.nodeType === 1) return child.outerHTML;
        return '';
      })
      .join('');
  }

  get outerHTML() {
    const attrs = Object.entries(this.attributes)
      .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
      .join('');
    const tag = this.tagName.toLowerCase();
    if (SELF_CLOSING_TAGS.has(tag)) {
      return `<${tag}${attrs} />`;
    }
    return `<${tag}${attrs}>${this.innerHTML}</${tag}>`;
  }

  matches(selector) {
    return matchesSimpleSelector(this, selector.trim());
  }

  querySelector(selector) {
    return querySelectorInternal(this, selector.trim());
  }

  querySelectorAll(selector) {
    const results = [];
    querySelectorAllInternal(this, selector.trim(), results);
    return results;
  }

  // Accessibility & Interactive Simulation
  isFocusable() {
    const tag = this.tagName;
    if (this.getAttribute('disabled') !== null) return false;
    if (this.getAttribute('aria-hidden') === 'true') return false;

    const tabIndex = this.getAttribute('tabindex');
    if (tabIndex !== null && parseInt(tabIndex, 10) >= 0) return true;
    if (tabIndex !== null && parseInt(tabIndex, 10) < 0) return false;

    if (tag === 'A' && this.hasAttribute('href')) return true;
    if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return true;
    return false;
  }

  focus() {
    let root = this;
    while (root.parent) root = root.parent;
    root.activeElement = this;
  }

  blur() {
    let root = this;
    while (root.parent) root = root.parent;
    if (root.activeElement === this) {
      root.activeElement = null;
    }
  }

  get ownerDocument() {
    let root = this;
    while (root.parent) root = root.parent;
    return root;
  }

  simulateClick() {
    const onClick = this.getAttribute('onclick') || this.getAttribute('data-click');
    const href = this.getAttribute('href');
    return {
      defaultPrevented: false,
      navigatedHref: href || null,
      clicked: true,
      tag: this.tagName,
      id: this.id
    };
  }
}

const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Tokenizes HTML into an AST of DOMElement / DOMTextNode.
 */
export function parseHTML(html) {
  const root = new DOMElement('ROOT');
  let currentParent = root;
  let i = 0;
  const len = html.length;

  while (i < len) {
    if (html.startsWith('<!--', i)) {
      const end = html.indexOf('-->', i + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }

    if (html.startsWith('<!DOCTYPE', i) || html.startsWith('<!doctype', i)) {
      const end = html.indexOf('>', i);
      i = end === -1 ? len : end + 1;
      continue;
    }

    if (html[i] === '<') {
      // Check for closing tag
      if (html[i + 1] === '/') {
        const closeEnd = html.indexOf('>', i + 2);
        if (closeEnd !== -1) {
          const closingTag = html.substring(i + 2, closeEnd).trim().toUpperCase();
          // Climb up to matching parent
          let p = currentParent;
          while (p && p.tagName !== closingTag && p !== root) {
            p = p.parent;
          }
          if (p && p !== root) {
            currentParent = p.parent || root;
          } else if (currentParent.parent) {
            currentParent = currentParent.parent;
          }
          i = closeEnd + 1;
          continue;
        }
      }

      // Opening or self-closing tag
      const tagMatch = html.slice(i).match(/^<([a-zA-Z0-9:-]+)/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        let tagEnd = i + tagMatch[0].length;
        let attrs = {};

        // Parse attributes
        while (tagEnd < len && html[tagEnd] !== '>' && !(html[tagEnd] === '/' && html[tagEnd + 1] === '>')) {
          const attrMatch = html.slice(tagEnd).match(/^\s+([^\s=>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/);
          if (attrMatch) {
            const attrName = attrMatch[1];
            const attrVal = attrMatch[2] !== undefined ? attrMatch[2] : (attrMatch[3] !== undefined ? attrMatch[3] : (attrMatch[4] !== undefined ? attrMatch[4] : ''));
            attrs[attrName] = attrVal;
            tagEnd += attrMatch[0].length;
          } else {
            tagEnd++;
          }
        }

        const isSelfClosing = html[tagEnd] === '/' || SELF_CLOSING_TAGS.has(tagName.toLowerCase());
        if (html[tagEnd] === '/') tagEnd++;
        if (html[tagEnd] === '>') tagEnd++;

        const elem = new DOMElement(tagName, attrs, currentParent);
        currentParent.children.push(elem);

        // Special handling for script and style tags to parse raw text
        const lowerTag = tagName.toLowerCase();
        if (lowerTag === 'script' || lowerTag === 'style') {
          const closeSeq = `</${lowerTag}>`;
          const closeIndex = html.toLowerCase().indexOf(closeSeq, tagEnd);
          if (closeIndex !== -1) {
            const rawContent = html.substring(tagEnd, closeIndex);
            elem.children.push(new DOMTextNode(rawContent, elem));
            tagEnd = closeIndex + closeSeq.length;
          }
          i = tagEnd;
          continue;
        }

        if (!isSelfClosing) {
          currentParent = elem;
        }
        i = tagEnd;
        continue;
      }
    }

    // Text content
    const nextTag = html.indexOf('<', i);
    const textChunk = nextTag === -1 ? html.slice(i) : html.slice(i, nextTag);
    if (textChunk) {
      currentParent.children.push(new DOMTextNode(textChunk, currentParent));
    }
    i = nextTag === -1 ? len : nextTag;
  }

  return root;
}

/**
 * Checks if an element matches a simple selector (tag, #id, .class, [attr], or compound of these).
 */
function matchesSimpleSelector(elem, selector) {
  if (selector === '*') return true;

  // Split compound parts (e.g., button.mobile-nav-toggle[aria-expanded="false"])
  const regex = /([.#]?[a-zA-Z0-9_-]+|\[[^\]]+\])/g;
  const parts = selector.match(regex);
  if (!parts) return false;

  for (const part of parts) {
    if (part.startsWith('#')) {
      if (elem.id !== part.slice(1)) return false;
    } else if (part.startsWith('.')) {
      if (!elem.classList.contains(part.slice(1))) return false;
    } else if (part.startsWith('[')) {
      let attrExpr = part.slice(1, -1).trim();
      const eqIdx = attrExpr.indexOf('=');
      if (eqIdx === -1) {
        if (!elem.hasAttribute(attrExpr)) return false;
      } else {
        const op = attrExpr[eqIdx - 1] === '*' || attrExpr[eqIdx - 1] === '^' || attrExpr[eqIdx - 1] === '$'
          ? attrExpr.slice(eqIdx - 1, eqIdx + 1)
          : '=';
        const key = op.length === 2 ? attrExpr.slice(0, eqIdx - 1).trim() : attrExpr.slice(0, eqIdx).trim();
        let expected = attrExpr.slice(eqIdx + 1).trim();
        let caseInsensitive = false;
        if (expected.toLowerCase().endsWith(' i')) {
          caseInsensitive = true;
          expected = expected.slice(0, -2).trim();
        }
        if ((expected.startsWith('"') && expected.endsWith('"')) || (expected.startsWith("'") && expected.endsWith("'"))) {
          expected = expected.slice(1, -1);
        }
        const val = elem.getAttribute(key);
        if (val === null) return false;

        const compareVal = caseInsensitive ? val.toLowerCase() : val;
        const compareExp = caseInsensitive ? expected.toLowerCase() : expected;

        if (op === '=') {
          if (compareVal !== compareExp) return false;
        } else if (op === '*=') {
          if (!compareVal.includes(compareExp)) return false;
        } else if (op === '^=') {
          if (!compareVal.startsWith(compareExp)) return false;
        } else if (op === '$=') {
          if (!compareVal.endsWith(compareExp)) return false;
        }
      }
    } else {
      if (elem.tagName !== part.toUpperCase()) return false;
    }
  }

  return true;
}

function splitSelectorGroups(selector) {
  const groups = [];
  let current = '';
  let inBracket = false;
  let inQuote = null;

  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (inQuote) {
      current += ch;
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
      current += ch;
    } else if (ch === '[') {
      inBracket = true;
      current += ch;
    } else if (ch === ']') {
      inBracket = false;
      current += ch;
    } else if (ch === ',' && !inBracket) {
      groups.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) groups.push(current.trim());
  return groups;
}

function splitSelectorTokens(selector) {
  const tokens = [];
  let current = '';
  let inBracket = false;
  let inQuote = null;

  for (let i = 0; i < selector.length; i++) {
    const ch = selector[i];
    if (inQuote) {
      current += ch;
      if (ch === inQuote) inQuote = null;
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
      current += ch;
    } else if (ch === '[') {
      inBracket = true;
      current += ch;
    } else if (ch === ']') {
      inBracket = false;
      current += ch;
    } else if (/\s/.test(ch)) {
      if (inBracket) {
        current += ch;
      } else if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Recursive querySelector implementation supporting descendant selectors (space separated) and commas.
 */
function querySelectorInternal(root, selector) {
  const groups = splitSelectorGroups(selector);
  for (const group of groups) {
    const tokens = splitSelectorTokens(group);
    const match = findDescendant(root, tokens, 0);
    if (match) return match;
  }
  return null;
}

function findDescendant(node, tokens, tokenIndex) {
  if (tokenIndex >= tokens.length) return null;
  const currentToken = tokens[tokenIndex];
  const isLast = tokenIndex === tokens.length - 1;

  for (const child of node.children) {
    if (child.nodeType !== 1) continue;
    if (matchesSimpleSelector(child, currentToken)) {
      if (isLast) return child;
      const subMatch = findDescendant(child, tokens, tokenIndex + 1);
      if (subMatch) return subMatch;
    }
    const deepMatch = findDescendant(child, tokens, tokenIndex);
    if (deepMatch) return deepMatch;
  }
  return null;
}

function querySelectorAllInternal(node, selector, results) {
  const groups = splitSelectorGroups(selector);
  for (const group of groups) {
    const tokens = splitSelectorTokens(group);
    findAllDescendants(node, tokens, 0, results);
  }
}


function findAllDescendants(node, tokens, tokenIndex, results) {
  if (tokenIndex >= tokens.length) return;
  const currentToken = tokens[tokenIndex];
  const isLast = tokenIndex === tokens.length - 1;

  for (const child of node.children) {
    if (child.nodeType !== 1) continue;
    if (matchesSimpleSelector(child, currentToken)) {
      if (isLast) {
        if (!results.includes(child)) results.push(child);
      } else {
        findAllDescendants(child, tokens, tokenIndex + 1, results);
      }
    }
    // Also search deeper in this branch
    findAllDescendants(child, tokens, tokenIndex, results);
  }
}

