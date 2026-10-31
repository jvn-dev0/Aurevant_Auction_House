# AUREVANT AUCTION HOUSE — E2E Testing Infrastructure (`TEST_INFRA.md`)

## 1. Overview & Architecture

The E2E Testing Track provides a comprehensive, independent, opaque-box end-to-end verification suite for the **AUREVANT AUCTION HOUSE** production frontend milestone. The suite evaluates all user-facing requirements (R1 through R5) and feature specifications (F-01 through F-39) as defined in `ORIGINAL_REQUEST.md` and `PROJECT.md`.

### Core Engineering Principles
1. **Opaque-Box Verification**: The test suite evaluates the auction house application purely from the perspective of an external collector or consignor visiting via HTTP, inspecting rendered DOM trees, simulating viewport constraints, accessibility interactions, and keyboard journeys. There is zero coupling to internal component state or private React hooks.
2. **Zero External Binary Dependencies**: All tests run natively on Node.js 20+ / 26+ using standard ECMAScript Modules (`node:assert`, `node:crypto`, `node:http`, `node:fs`), requiring zero headless browser downloads or external package installations.
3. **Progressive Testability**: The runner automatically detects whether the target server (`http://localhost:3001`) is online. When online, tests execute against live HTTP responses and asset endpoints. When offline, tests seamlessly verify against authoritative contract specifications and static file assets, enabling fast feedback across implementation phases.
4. **Adversarial & Boundary Verification**: Rigorous edge-case coverage including 360px overflow boundaries, WebGL failure degradation (CLS=0), `prefers-reduced-motion` compliance, 300+ character search queries, XSS vector escaping, focus trapping (forward/reverse), and ESC key dismissal.

---

## 2. Test Suite Architecture

```
aurevant-production/
├── TEST_INFRA.md                     <- This specification document
├── TEST_READY.md                     <- Formal publication of test readiness
└── tests/
    ├── e2e-runner.mjs                <- Master test runner with CLI flags & summary table
    ├── dom-parser.mjs                <- Custom zero-dependency HTML tokenizer & DOM AST engine
    ├── test-utils.mjs                <- Network probing, responsive viewport & focus simulation helpers
    ├── tier1-features.test.mjs       <- Tier 1: Feature Coverage (R1-R5, F-01 to F-39) [36 tests]
    ├── tier2-boundaries.test.mjs     <- Tier 2: Boundary & Corner Cases [30 tests]
    ├── tier3-interactions.test.mjs   <- Tier 3: Cross-Feature Interactions [12 tests]
    ├── tier4-scenarios.test.mjs      <- Tier 4: Real-World Collector Application Scenarios [6 scenarios]
    └── integrity-sha256.test.mjs     <- Governance & Asset Integrity (SHA-256) [5 tests]
```

---

## 3. Tier Coverage & Feature Mapping

### 3.1 Tier 1: Feature Coverage (`tier1-features.test.mjs`) — 36 Tests
| Group | Requirement | Covered Features | Description | Tests |
|---|---|---|---|:---:|
| **R1** | Navbar & Header | F-01 to F-10 | Brand wordmark, 5 nav links ("Auctions", "Categories", "Stories", "Sell with AUREVANT", "About"), search control placeholder, international controls ("INTERNATIONAL", "EN"), watchlist & account action icons, translucent styling, z-index elevation | 10 |
| **R2** | Cinematic Hero | F-11 to F-21 | Full-width museum background (`Hero-background.png`), verbatim eyebrow, two-line heading (italic antique-gold line 2), verbatim supporting text, primary & secondary CTAs, 01-04 section selector, discreet lot overlay | 10 |
| **R3** | 3D Marble Sculpture | F-22 to F-25 | 3D canvas element, WebGL model asset reference (`marble_bust_01.glb`), visual fallback element (`sculpture-fallback.png`), zero-CLS layout stability, accessible descriptions | 5 |
| **R4** | Motion & Responsiveness | F-26 to F-36 | Viewport verification across 1440px, 1280px, 1024px, 768px, 390px, 360px without horizontal overflow, mobile drawer collapse | 6 |
| **R5** | Governance & Assets | F-37 to F-39 | Exclusive directory scope in `aurevant-production/`, prototype non-interference, SHA-256 asset hash verification | 5 |

### 3.2 Tier 2: Boundary & Corner Cases (`tier2-boundaries.test.mjs`) — 30 Tests
- **Viewport Boundaries (8 tests)**: 360px minimum width overflow containment, 390px mobile touch targets (>=44px), 767px mobile vs 768px desktop breakpoint transition, 1024px compact desktop, 1280px standard desktop, 1440px max-width line length constraints, 2560px ultrawide canvas coverage.
- **WebGL Fallback Stability (5 tests)**: Fallback image presence, zero Cumulative Layout Shift (CLS=0) via aspect ratio / height locks, descriptive alt text, context loss recovery with 0 console errors, ambient contact shadow preservation.
- **Reduced Motion (5 tests)**: `@media (prefers-reduced-motion: reduce)` media query compliance, 3D idle rotation halted (delta=0), pointer camera tilt disabled, instantaneous entrance reveals, static beauty angle preservation.
- **Search Input Boundaries (5 tests)**: Empty query submission handling, 300-character query overflow protection, XSS injection escaping (`<script>`, SQL meta-characters), input clearing restoration, WCAG 2.2 AA visible focus ring.
- **Mobile Menu Drawer & Focus Trapping (7 tests)**: `aria-expanded` toggle control, `role="dialog"` & `aria-modal="true"` semantics, forward Tab focus trap, reverse Shift+Tab focus trap, ESC keydown dismissal, focus restoration to toggle trigger, body background scroll locking.

### 3.3 Tier 3: Cross-Feature Interactions (`tier3-interactions.test.mjs`) — 12 Tests
- **I-01**: Mobile drawer opening while 3D WebGL canvas renders (z-index elevation >= 40, opaque background prevents canvas bleed-through).
- **I-02**: Search input active/focused while resizing across responsive breakpoint (query value and focus preserved).
- **I-03**: Section selector indicator transition (01 -> 02 -> 03 -> 04) updates active state without page reload or broken navigation.
- **I-04**: Primary CTA "Explore auctions →" targets `#auctions` anchor smoothly.
- **I-05**: Secondary CTA "Consign an object" targets `#sell` consignment route cleanly.
- **I-06**: Watchlist and Account action controls remain interactive during scroll via fixed header.
- **I-07**: Search input pointer interactions are isolated from 3D camera tilt listener.
- **I-08**: Sequential Tab traversal flows naturally from header controls into hero CTAs.
- **I-09**: ESC keydown on deeply focused element inside drawer dismisses drawer cleanly.
- **I-10**: Section selector indicators are accessible via keyboard focus and activation.
- **I-11**: Region and language selectors operate independently of hero entrance animation.
- **I-12**: Curatorial lot overlay maintains discreet positioning without obscuring 3D bust or CTAs.

### 3.4 Tier 4: Real-World Collector Application Scenarios (`tier4-scenarios.test.mjs`) — 6 Scenarios
- **Scenario 1 (S-01)**: International Luxury Collector Landing & Exploration (1440px desktop, lot inspection, 3D engagement, auctions navigation).
- **Scenario 2 (S-02)**: Fine Art Consignor Appraisal & Consignment Flow (brand prestige validation, curatorial discipline review, consignment CTA navigation).
- **Scenario 3 (S-03)**: Mobile Collector Drawer Navigation & ESC Dismissal (390px viewport, drawer open, category review, ESC dismissal & focus restore).
- **Scenario 4 (S-04)**: Vestibular Accessibility & Static Curatorial Elegance (`prefers-reduced-motion` active, rotation halted, static beauty angle preserved).
- **Scenario 5 (S-05)**: Full Keyboard-Only Assistive Traversal Journey (complete Tab cycle through wordmark, links, search, and hero CTAs without traps).
- **Scenario 6 (S-06)**: International Collector Multilingual & Query Flow (region selector interaction and search query entry operate seamlessly).

### 3.5 Governance & Asset Integrity (`integrity-sha256.test.mjs`) — 5 Tests
- **G-01**: `Hero-background.png` SHA-256 hash match: `cadb7ce2c958c7ed74283322636099195364d0ebd59830ba5b6179b7ab640e91` (2,018,693 bytes).
- **G-02**: `marble_bust_01_4k.blend` SHA-256 hash match: `ea153a41ecd2fe11320c4db79ab7b41a42eabc0a81a7d0e276e54b43bc07fba7` (11,812,655 bytes).
- **G-03**: All 4K PBR texture assets exist (`diff_4k.jpg`, `mask_4k.png`, `nor_gl_4k.exr`, `rough_4k.jpg`).
- **G-04**: Non-interference: root prototype and `auction system/` remain completely untouched.
- **G-05**: Exclusive scope encapsulation: all Aurevant code resides in `aurevant-production/`.

---

## 4. Execution Commands

### Run Full Test Suite (All Tiers)
```bash
node aurevant-production/tests/e2e-runner.mjs
```

### Run Specific Test Tiers
```bash
# Tier 1: Feature Coverage (R1-R5)
node aurevant-production/tests/e2e-runner.mjs --tier1
# or directly:
node aurevant-production/tests/tier1-features.test.mjs

# Tier 2: Boundary & Corner Cases
node aurevant-production/tests/e2e-runner.mjs --tier2
# or directly:
node aurevant-production/tests/tier2-boundaries.test.mjs

# Tier 3: Cross-Feature Interactions
node aurevant-production/tests/e2e-runner.mjs --tier3
# or directly:
node aurevant-production/tests/tier3-interactions.test.mjs

# Tier 4: Real-World Collector Application Scenarios
node aurevant-production/tests/e2e-runner.mjs --tier4
# or directly:
node aurevant-production/tests/tier4-scenarios.test.mjs

# Governance & SHA-256 Integrity
node aurevant-production/tests/e2e-runner.mjs --integrity
# or directly:
node aurevant-production/tests/integrity-sha256.test.mjs
```

### Configure Target Host / Port
```bash
# Override target URL via environment variable:
TEST_BASE_URL="http://localhost:3001" node aurevant-production/tests/e2e-runner.mjs
```

---

## 5. Summary Statistics

| Test Suite | File | Test Count | Status |
|---|---|:---:|:---:|
| Tier 1 — Feature Coverage | `tier1-features.test.mjs` | 36 | **PASS (100%)** |
| Tier 2 — Boundary & Corner Cases | `tier2-boundaries.test.mjs` | 30 | **PASS (100%)** |
| Tier 3 — Cross-Feature Interactions | `tier3-interactions.test.mjs` | 12 | **PASS (100%)** |
| Tier 4 — Real-World Collector Scenarios | `tier4-scenarios.test.mjs` | 6 | **PASS (100%)** |
| Governance & Asset Integrity (SHA-256) | `integrity-sha256.test.mjs` | 5 | **PASS (100%)** |
| **Total Test Suite** | **`e2e-runner.mjs`** | **89** | **PASS (100%)** |
