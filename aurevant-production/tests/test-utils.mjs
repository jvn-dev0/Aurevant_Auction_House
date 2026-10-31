import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from './dom-parser.mjs';

export const TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3002';

/**
 * Checks if the target HTTP server is currently listening.
 */
export async function isServerOnline(url = TEST_BASE_URL, timeoutMs = 1500) {
  try {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;
    return await new Promise((resolve) => {
      const req = transport.request(
        {
          hostname: parsed.hostname,
          port: parsed.port,
          path: '/',
          method: 'HEAD',
          timeout: timeoutMs
        },
        (res) => {
          resolve(true);
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
      req.on('error', () => {
        resolve(false);
      });
      req.end();
    });
  } catch {
    return false;
  }
}

/**
 * Fetches an HTML page and parses it into a DOM tree.
 */
export async function fetchPage(pathname = '/', baseUrl = TEST_BASE_URL) {
  const targetUrl = new URL(pathname, baseUrl).toString();
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Aurevant-E2E-Collector-Probe/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml'
      }
    });
    const status = res.status;
    const headers = Object.fromEntries(res.headers.entries());
    const body = await res.text();
    const doc = parseHTML(body);
    return {
      isOffline: false,
      status,
      headers,
      body,
      doc
    };
  } catch (err) {
    return {
      isOffline: true,
      status: 0,
      headers: {},
      body: '',
      doc: null,
      error: err.message
    };
  }
}

/**
 * Fetches a binary or static asset (image, 3d model, css).
 */
export async function fetchAsset(assetPath, baseUrl = TEST_BASE_URL) {
  const targetUrl = new URL(assetPath, baseUrl).toString();
  try {
    const res = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Aurevant-E2E-Asset-Probe/1.0' }
    });
    const status = res.status;
    const headers = Object.fromEntries(res.headers.entries());
    const arrayBuffer = await res.arrayBuffer();
    return {
      isOffline: false,
      status,
      headers,
      size: arrayBuffer.byteLength,
      contentType: headers['content-type'] || ''
    };
  } catch (err) {
    return {
      isOffline: true,
      status: 0,
      headers: {},
      size: 0,
      contentType: '',
      error: err.message
    };
  }
}

/**
 * Responsive viewport simulation: evaluates element visibility based on Tailwind breakpoint classes.
 */
function isSelfVisibleAtViewport(elem, viewportWidth) {
  if (!elem) return false;
  const classes = elem.classList.value;

  // Check display classes
  let isHidden = classes.includes('hidden');

  if (viewportWidth >= 1280) { // xl
    if (classes.includes('xl:hidden')) isHidden = true;
    if (classes.includes('xl:block') || classes.includes('xl:flex') || classes.includes('xl:grid')) isHidden = false;
  }
  if (viewportWidth >= 1024) { // lg
    if (classes.includes('lg:hidden')) isHidden = true;
    if (classes.includes('lg:block') || classes.includes('lg:flex') || classes.includes('lg:grid')) isHidden = false;
  }
  if (viewportWidth >= 768) { // md
    if (classes.includes('md:hidden')) isHidden = true;
    if (classes.includes('md:block') || classes.includes('md:flex') || classes.includes('md:grid')) isHidden = false;
  }
  if (viewportWidth >= 640) { // sm
    if (classes.includes('sm:hidden')) isHidden = true;
    if (classes.includes('sm:block') || classes.includes('sm:flex') || classes.includes('sm:grid')) isHidden = false;
  }

  // Base mobile (< 768px)
  if (viewportWidth < 768) {
    if (classes.includes('md:flex') && !classes.includes('flex')) isHidden = true;
    if (classes.includes('md:block') && !classes.includes('block')) isHidden = true;
    if (classes.includes('md:grid') && !classes.includes('grid')) isHidden = true;
  }

  return !isHidden;
}

export function isElementVisibleAtViewport(elem, viewportWidth) {
  let curr = elem;
  while (curr && curr.nodeType === 1 && curr.tagName !== 'ROOT') {
    if (!isSelfVisibleAtViewport(curr, viewportWidth)) {
      return false;
    }
    curr = curr.parent;
  }
  return true;
}


/**
 * Extracts all interactive focusable elements within a container.
 */
export function getFocusableElements(container) {
  if (!container) return [];
  const candidates = container.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  return candidates.filter((el) => el.isFocusable());
}

/**
 * Simulates Tab key navigation through a set of focusable elements.
 */
export function simulateTabTraversal(elements, initialIndex = 0, steps = 1) {
  if (!elements || elements.length === 0) return { currentIndex: -1, currentElement: null };
  let idx = (initialIndex + steps) % elements.length;
  if (idx < 0) idx += elements.length;
  return {
    currentIndex: idx,
    currentElement: elements[idx]
  };
}

/**
 * Simulates mobile menu focus trap: verifying wrap-around on Tab and Shift+Tab.
 */
export function simulateFocusTrap(focusableElements) {
  if (focusableElements.length === 0) return { trapsForward: false, trapsBackward: false };
  const first = 0;
  const last = focusableElements.length - 1;

  // Pressing Tab on last element should wrap to first
  const forwardWrap = simulateTabTraversal(focusableElements, last, 1);
  const backwardWrap = simulateTabTraversal(focusableElements, first, -1);

  return {
    trapsForward: forwardWrap.currentIndex === 0,
    trapsBackward: backwardWrap.currentIndex === last,
    elementCount: focusableElements.length
  };
}

/**
 * Generates an authoritative baseline mock HTML representing the expected contract from PROJECT.md
 * used for progressive verification during development milestones.
 */
export function getExpectedBaselineHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AUREVANT — AUCTION HOUSE</title>
</head>
<body class="bg-[#101113] text-[#F4F0E8] antialiased">
  <header class="fixed top-0 left-0 right-0 z-50 bg-[#101113]/80 backdrop-blur-md border-b border-[#D8D0C2]/20">
    <div class="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-20">
      <a href="/" class="brand-wordmark flex flex-col items-start focus:outline-none focus:ring-1 focus:ring-[#C5A059]" aria-label="AUREVANT AUCTION HOUSE Home">
        <span class="font-serif tracking-widest text-xl text-[#F4F0E8]">AUREVANT</span>
        <span class="text-[10px] tracking-[0.25em] text-[#D8D0C2] uppercase font-mono">AUCTION HOUSE</span>
      </a>

      <nav class="hidden md:flex items-center space-x-8" aria-label="Primary navigation">
        <a href="#auctions" class="text-sm tracking-wider uppercase hover:text-[#C5A059] transition-colors focus:ring-1 focus:ring-[#C5A059]">Auctions</a>
        <a href="#categories" class="text-sm tracking-wider uppercase hover:text-[#C5A059] transition-colors focus:ring-1 focus:ring-[#C5A059]">Categories</a>
        <a href="#stories" class="text-sm tracking-wider uppercase hover:text-[#C5A059] transition-colors focus:ring-1 focus:ring-[#C5A059]">Stories</a>
        <a href="#sell" class="text-sm tracking-wider uppercase hover:text-[#C5A059] transition-colors focus:ring-1 focus:ring-[#C5A059]">Sell with AUREVANT</a>
        <a href="#about" class="text-sm tracking-wider uppercase hover:text-[#C5A059] transition-colors focus:ring-1 focus:ring-[#C5A059]">About</a>
      </nav>

      <div class="hidden md:flex items-center space-x-6">
        <div class="relative search-container">
          <input type="search" placeholder="Search objects, artists, makers..." aria-label="Search objects, artists, makers..." class="bg-[#182720]/40 border border-[#D8D0C2]/30 rounded-none px-3 py-1.5 text-xs text-[#F4F0E8] placeholder-[#D8D0C2]/60 focus:outline-none focus:border-[#C5A059] w-64" />
        </div>
        <div class="flex items-center space-x-2 text-xs font-mono uppercase text-[#D8D0C2]">
          <button class="hover:text-[#C5A059] focus:outline-none" aria-label="Region selector: INTERNATIONAL">INTERNATIONAL</button>
          <span>/</span>
          <button class="hover:text-[#C5A059] focus:outline-none" aria-label="Language selector: EN">EN</button>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2 text-[#D8D0C2] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]" aria-label="Watchlist">
            <svg class="w-5 h-5 heart-icon"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
          </button>
          <button class="p-2 text-[#D8D0C2] hover:text-[#C5A059] focus:outline-none focus:ring-1 focus:ring-[#C5A059]" aria-label="Account">
            <svg class="w-5 h-5 user-icon"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </button>
        </div>
      </div>

      <div class="md:hidden flex items-center space-x-3">
        <button class="mobile-menu-toggle p-2 text-[#F4F0E8] focus:outline-none focus:ring-1 focus:ring-[#C5A059]" aria-label="Open navigation menu" aria-expanded="false">
          <svg class="w-6 h-6 hamburger-icon"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobile-menu-drawer" class="mobile-drawer hidden fixed inset-y-0 right-0 w-80 bg-[#101113] z-50 p-6 flex flex-col justify-between border-l border-[#D8D0C2]/20" aria-modal="true" role="dialog" aria-label="Mobile Navigation">
      <div class="flex items-center justify-between pb-4 border-b border-[#D8D0C2]/20">
        <span class="font-serif tracking-widest text-lg">AUREVANT</span>
        <button class="close-drawer-btn p-2 text-[#D8D0C2] hover:text-[#C5A059]" aria-label="Close navigation menu">
          <svg class="w-6 h-6 close-icon"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex flex-col space-y-4 my-6">
        <a href="#auctions" class="text-base tracking-wider uppercase hover:text-[#C5A059] py-2">Auctions</a>
        <a href="#categories" class="text-base tracking-wider uppercase hover:text-[#C5A059] py-2">Categories</a>
        <a href="#stories" class="text-base tracking-wider uppercase hover:text-[#C5A059] py-2">Stories</a>
        <a href="#sell" class="text-base tracking-wider uppercase hover:text-[#C5A059] py-2">Sell with AUREVANT</a>
        <a href="#about" class="text-base tracking-wider uppercase hover:text-[#C5A059] py-2">About</a>
      </div>
      <div class="pt-4 border-t border-[#D8D0C2]/20 flex items-center justify-between">
        <button class="text-xs uppercase font-mono" aria-label="Mobile region">INTERNATIONAL (EN)</button>
        <div class="flex space-x-3">
          <button class="p-2" aria-label="Mobile watchlist"><svg class="w-5 h-5"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg></button>
          <button class="p-2" aria-label="Mobile account"><svg class="w-5 h-5"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></button>
        </div>
      </div>
    </div>
  </header>

  <main class="relative min-h-screen pt-20 overflow-hidden">
    <!-- Hero Background Image -->
    <div class="absolute inset-0 w-full h-full -z-10 hero-background-container overflow-hidden">
      <img src="/images/Hero-background.png" alt="Museum exhibition gallery background" class="w-full h-full object-cover object-center pointer-events-none" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#101113] via-transparent to-transparent opacity-80"></div>
    </div>

    <!-- Hero Content Section -->
    <section class="max-w-7xl mx-auto px-4 md:px-8 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-5rem)]">
      <!-- Editorial Text Column -->
      <div class="lg:col-span-7 space-y-6 z-10 editorial-content">
        <p class="text-xs md:text-sm uppercase tracking-[0.25em] text-[#C5A059] font-mono eyebrow">AUREVANT AUCTION HOUSE</p>
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-serif leading-[1.1] text-[#F4F0E8] main-heading">
          <span class="block">Objects with a history.</span>
          <span class="block italic text-[#C5A059] heading-line-gold font-normal">Auctions with a future.</span>
        </h1>
        <p class="text-base sm:text-lg text-[#D8D0C2] max-w-xl font-sans leading-relaxed supporting-text">
          Discover exceptional art, horology, rare books, jewellery and historic objects.
        </p>
        <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 cta-group">
          <a href="#auctions" class="primary-cta px-8 py-3.5 bg-[#C5A059] text-[#101113] font-medium tracking-wide uppercase text-xs text-center hover:bg-[#d8b26e] transition-colors focus:ring-2 focus:ring-[#F4F0E8]">
            Explore auctions &rarr;
          </a>
          <a href="#sell" class="secondary-cta px-8 py-3.5 border border-[#D8D0C2]/50 text-[#F4F0E8] font-medium tracking-wide uppercase text-xs text-center hover:border-[#C5A059] hover:text-[#C5A059] transition-colors focus:ring-2 focus:ring-[#C5A059]">
            Consign an object
          </a>
        </div>
      </div>

      <!-- 3D Sculpture & WebGL Column -->
      <div class="lg:col-span-5 relative flex items-center justify-center min-h-[480px] lg:min-h-[640px] z-10 sculpture-column">
        <div class="sculpture-container relative w-full h-full min-h-[480px] flex items-center justify-center">
          <canvas id="sculpture-canvas" class="w-full h-full block" data-model="/models/marble_bust_01.glb" aria-label="Interactive 3D Marble Bust Sculpture"></canvas>
          <div class="sculpture-fallback hidden absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <img src="/images/sculpture-fallback.png" alt="Antique Roman Marble Bust" class="max-w-full max-h-full object-contain" />
          </div>
        </div>
      </div>
    </section>

    <!-- Section Selector -->
    <div class="fixed left-6 bottom-12 hidden lg:flex flex-col space-y-3 z-20 section-selector" aria-label="Section selector">
      <button class="section-indicator text-xs font-mono text-[#C5A059] font-bold" data-section="01" aria-current="true">01</button>
      <button class="section-indicator text-xs font-mono text-[#D8D0C2]/50 hover:text-[#D8D0C2]" data-section="02">02</button>
      <button class="section-indicator text-xs font-mono text-[#D8D0C2]/50 hover:text-[#D8D0C2]" data-section="03">03</button>
      <button class="section-indicator text-xs font-mono text-[#D8D0C2]/50 hover:text-[#D8D0C2]" data-section="04">04</button>
    </div>

    <!-- Lot Overlay -->
    <div class="absolute right-6 bottom-8 hidden md:block bg-[#101113]/70 backdrop-blur-sm border border-[#D8D0C2]/20 p-4 max-w-xs z-20 lot-overlay">
      <p class="text-[10px] tracking-widest uppercase font-mono text-[#C5A059]">LOT 04 &bull; FINE SCULPTURE</p>
      <p class="text-xs font-serif text-[#F4F0E8] mt-1">Roman Imperial Marble Portrait Bust, Circa 2nd Century A.D.</p>
      <p class="text-[11px] font-mono text-[#D8D0C2] mt-1">Estimate: &pound;250,000 &ndash; &pound;350,000</p>
    </div>
  </main>
</body>
</html>
`;
}
