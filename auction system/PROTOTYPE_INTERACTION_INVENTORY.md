# ChronoBid Vault — Prototype Interaction Inventory

> [!NOTE]
> ### 🏛️ PHASE 2 AUTHORIZATION GRANTED — CLICKABLE FRONTEND PROTOTYPE ONLY
> **The project owner has explicitly authorized Phase 2 (2026-10-18), strictly limited to building the clickable frontend website prototype.**  
> On 2026-10-19, the Project Owner issued the Phase 1 Specification Amendment ("Multi-Category Auction Marketplace and Pre-Funded Vault Controls"), formally incorporated as Version 2.3.
> 
> - **Phase 1 Status:** `FORMALLY APPROVED (BASELINE v2.2 — 2026-10-17) WITH AMENDMENT (v2.3 — 2026-10-19)`  
> - **Phase 2 Status:** **`AUTHORIZED (Clickable Frontend Prototype Only — In Progress)`**  
> - **Phase 3+ Status:** **`NOT AUTHORISED — PRODUCTION BACKEND & LIVE PAYMENTS STRICTLY PROHIBITED`**

---

## 1. Overview & Simulation Demarcation

The **Prototype Interaction Inventory** defines every user interaction, state transition, and accessibility requirement across the 12 approved routes of ChronoBid Vault.

### Simulation Demarcation Invariant
Because the clickable prototype operates entirely in the frontend without a live transaction backend, every interaction must strictly observe the boundaries established in Section 10.2 of the Phase 1 Specification:
- **Client-Side Simulation:** Real-time countdowns, simulated counter-bidding bots, proxy bid stepping, and mock session authentication are handled via client-side reactive state.
- **Explicit Labeling:** All interactive auction controls, countdown clocks, bid amounts, and paddles must display persistent `[DEMO DATA]` or `[DEMO]` tags.
- **Zero Real-Money / Operational Claims:** No dummy payments, mock escrow states, or simulated KYC checks may claim legal finality or real-world execution.

---

## 2. Interaction Domain 1: Navigation & Menus

### IX-NAV-01: Header Scroll Morph
- **Trigger / Event:** Window scroll event exceeding `40px` from top.
- **Expected Behavior & Logic:**
  - Header transitions from a transparent background with a hairline border into a fixed frosted glass bar (`background: rgba(244, 240, 232, 0.92); backdrop-filter: blur(8px); border-bottom: 1px solid #D8D0C2`).
  - Height compacts from `72px` to `60px` over `200ms ease`.
- **Resulting UI State:** Pinned top navigation bar with persistent access to catalog, salerooms, currency switch, and user profile.
- **Accessibility Requirements:** Non-disruptive transition; does not cause content reflow or shift focus.
- **Testable Acceptance Criterion:** Scrolling past `40px` alters the header CSS class to frosted state within `200ms`; scrolling back to top restores transparent state.
- **Simulation vs. Production:** Purely client-side UI behavior; identical in prototype and production.

### IX-NAV-02: Active Route Indicator
- **Trigger / Event:** Navigation between routes or page load.
- **Expected Behavior & Logic:** The nav item matching the current pathname receives an active visual indicator (1.5px solid `#182720` underline) and `aria-current="page"`.
- **Resulting UI State:** Current route clearly differentiated from inactive links.
- **Accessibility Requirements:** Screen readers announce current page status via `aria-current="page"`.
- **Testable Acceptance Criterion:** Inspecting the active navigation element confirms presence of `aria-current="page"` and `#182720` underline.
- **Simulation vs. Production:** Standard Next.js routing behavior.

### IX-NAV-03: Mobile Navigation Drawer (Sheet)
- **Trigger / Event:** User clicks hamburger button on viewports `<1024px`.
- **Expected Behavior & Logic:**
  - Full-height drawer slides in from right (`translateX(0)`) over `200ms` using spring curve `damping: 24, stiffness: 140`.
  - Body scroll is locked (`overflow: hidden`).
  - Dark backdrop overlay (`rgba(24, 39, 32, 0.4)`) fades in.
  - Pressing `Escape` key or clicking backdrop closes drawer and restores focus to hamburger trigger.
- **Resulting UI State:** Mobile menu open with vertical list of routes, currency selector, and auth buttons.
- **Accessibility Requirements:** Focus trapped within drawer; `aria-expanded="true"` on trigger; `role="dialog"`; `aria-modal="true"`.
- **Testable Acceptance Criterion:** Tabbing inside open drawer cycles exclusively through menu links; pressing `Escape` closes drawer and focuses hamburger button.
- **Simulation vs. Production:** Standard client-side dialog pattern.

### IX-NAV-04: Currency Switcher & Dual-Pricing Invariant (ADR-021, ADR-026)
- **Trigger / Event:** User clicks currency dropdown in header, mobile drawer, or settings and selects from 8 supported display currencies (USD, EUR, CHF, GBP, JPY, HKD, SGD, and INR).
- **Expected Behavior & Logic:**
  - USD serves as the canonical base Auction Currency for cataloguing, reserve prices, bid increments, and saleroom execution.
  - Prototype display only: system applies fixed demonstration multipliers rounded to documented precision, mathematically derived from verified European Central Bank and Reserve Bank of India reference rates of 16 October 2026. Conversions execute directly against these rounded demonstration multipliers (not unrounded underlying rates):
    - `1 USD = 1.0000 USD` (Base calculation currency: $100,000 × 1.0000 = $100,000)
    - `1 USD = 0.8887 EUR` (rounded to 4 decimal places: $100,000 × 0.8887 = €88,870)
    - `1 USD = 0.7499 GBP` (rounded to 4 decimal places: $100,000 × 0.7499 = £74,990)
    - `1 USD = 0.8240 CHF` (rounded to 4 decimal places: $100,000 × 0.8240 = CHF 82,400)
    - `1 USD = 158.02 JPY` (rounded to 2 decimal places: $100,000 × 158.02 = ¥15,802,000)
    - `1 USD = 7.8482 HKD` (rounded to 4 decimal places: $100,000 × 7.8482 = HK$ 784,820)
    - `1 USD = 1.2792 SGD` (rounded to 4 decimal places: $100,000 × 1.2792 = SG$ 127,920)
    - `1 USD = 84.07 INR` (rounded to 2 decimal places, precision 0 in display: $100,000 × 84.07 = ₹84,07,000; locale `en-IN`)
  - **Mandatory Dual-Currency Invariant:** Converted estimates displayed on lot cards, dossiers, and bidding consoles MUST display the converted figure alongside the canonical base USD price: `[Converted] [EST. DEMO] / $[Base] USD` (e.g. `₹18,49,540 [EST. DEMO] / $22,000 USD`).
  - Persists preference in `sessionStorage` / React context.
  - Formats numbers using `Intl.NumberFormat` with appropriate currency symbol and thousand separators.
  - If a conversion rate is unavailable or invalid, displays the USD base amount accompanied by an accessible badge: `[CONVERSION UNAVAILABLE]`.
  - Updates all visible lot estimates, current asks, increment buttons, and invoice amounts across all open views in `<100ms`.
- **Resulting UI State:** All currency figures dynamically update without page reload; dual-currency transparency preserved across cards and consoles.
- **Accessibility Requirements:** Dynamic updates announce via `aria-live="polite"` region; dropdown has `aria-haspopup="listbox"`; rate notice clearly presented in menu.
- **Testable Acceptance Criterion:** Selecting INR converts a $22,000 USD price to ₹18,49,540 [EST. DEMO] while preserving the "$22,000 USD" sub-label; selecting EUR converts a $100,000 USD estimate to €88,870 EUR ($100,000 × 0.8887) with zero layout shift.
- **Simulation vs. Production:** Prototype uses fixed demonstration rates derived from ECB and RBI 16 October 2026 for display only (ADR-021, ADR-026); production will connect to authoritative real-time FX feed upon separate authorization.

---

## 3. Interaction Domain 2: Authentication & Account Access

### IX-AUTH-01: Signup Submission, Inline Validation & Simulated Third-Party Auth (ADR-026)
- **Trigger / Event:** User fills registration form and clicks "Proceed to Email PIN Verification" on `/auth/register` (or clicks simulated "Continue with Google").
- **Expected Behavior & Logic:**
  - *Layout Structure:* 2-column desktop editorial split (Deep Forest brand panel + Warm Paper form panel); single column on mobile.
  - *Typography Standards:* All credential inputs set to 16px (`text-base`) eliminating iOS auto-zoom; form labels set to 14–16px in `Manrope`.
  - *Simulated Google Sign-Up:* Clicking "Continue with Google" with persistent badge `[SIMULATED AUTH PROVIDER — PROTOTYPE ONLY]` instantly registers a demonstration account and routes directly to `/auctions/live`.
  - *Accessible Simulated CAPTCHA:* User must verify "I am human [Sandbox Verification]" checkbox (`Space`/`Enter` keyboard support, `role="checkbox"`, `aria-checked`, `[SIMULATED ANTI-BOT]` tag) before submission.
  - *Credential Validation:*
    - Full Name: Non-empty. Error: *"Full legal name or entity name is required."*
    - Email: Valid syntax. Error: *"Valid collector email address is required."*
    - Password: Min 10 chars (ADR-020). Error: *"Password must be at least 10 characters (ADR-020 draft assumption)."*
    - Confirm Password: Match equality. Error: *"Passwords do not match."*
    - CAPTCHA: Must be confirmed. Error: *"Please complete the anti-bot verification checkbox before continuing."*
  - On valid submission, redirects to `/auth/verify-email?email=...&name=...`.
- **Resulting UI State:** Transition to Step 2 PIN verification view.
- **Accessibility Requirements:** Inputs bound to `<label>` via `htmlFor`; inline errors flagged with `role="alert"`; CAPTCHA keyboard operable via `Space` / `Enter`.
- **Testable Acceptance Criterion:** Submitting empty form highlights errors and blocks transition; checking CAPTCHA and submitting valid inputs transitions to `/auth/verify-email`.
- **Simulation vs. Production:** Prototype validates against local client-side state and simulated fixtures.

### IX-AUTH-02: Simulated Email PIN Verification
- **Trigger / Event:** User enters 6 digits into segmented verification slots.
- **Expected Behavior & Logic:**
  - Auto-advances focus to next slot upon entering a digit; backspace moves to previous slot.
  - Submitting correct PIN (`123456` in demo mode) activates member account and transitions to Intent Selection screen.
  - Submitting incorrect PIN displays high-contrast error: *"Invalid verification PIN. Please re-enter."* and clears inputs.
- **Resulting UI State:** Step 3 Intent Selection appears with 4 choice cards.
- **Accessibility Requirements:** Grouped in `<fieldset>` with `<legend>Email Verification PIN</legend>`; announcement of error via `aria-live="assertive"`.
- **Testable Acceptance Criterion:** Entering `123456` immediately triggers transition to Intent Selection.
- **Simulation vs. Production:** In prototype, PIN `123456` is hardcoded for test convenience. Production will dispatch real cryptographic emails.

### IX-AUTH-03: Onboarding Intent Selection & Routing
- **Trigger / Event:** User selects one of 4 intent cards:
  1. *"Bid on objects"* &rarr; Routes to `/auctions/live`.
  2. *"Sell my objects"* &rarr; Routes to `/consign`.
  3. *"Both"* &rarr; Routes to `/account/bids`.
  4. *"Just exploring"* &rarr; Routes to `/` with explore mode active.
- **Expected Behavior & Logic:**
  - Persists preference in mock profile.
  - Automatically assigns a demo paddle number (e.g., `Paddle #4102`).
  - Updates navigation header to display assigned paddle badge.
- **Resulting UI State:** Redirect to target route with personalized welcome toast.
- **Accessibility Requirements:** Cards selectable via keyboard (`Enter`/`Space`); focus moves to target page heading upon navigation.
- **Testable Acceptance Criterion:** Selecting "Sell my objects" lands user directly on Step 1 of `/consign`.
- **Simulation vs. Production:** Purely client-side preference routing.

### IX-AUTH-04: Login Credential Verification, CAPTCHA & Throttling Alert (ADR-026)
- **Trigger / Event:** User submits email and password on `/auth/login` (or clicks simulated "Continue with Google").
- **Expected Behavior & Logic:**
  - *Layout Structure:* 2-column desktop editorial split (Deep Forest brand panel + Warm Paper form panel); single column on mobile.
  - *Typography Standards:* Credential inputs set to 16px (`text-base`); labels set to 14–16px.
  - *Simulated Google Sign-In:* Clicking "Continue with Google" (`[SIMULATED AUTH PROVIDER — PROTOTYPE ONLY]`) signs in immediately as Alexander Vance (Paddle #4102) and routes to `/auctions/live`.
  - *Accessible Simulated CAPTCHA:* Verifies "I am human [Sandbox Verification]" checkbox (`Space`/`Enter` support, `[SIMULATED ANTI-BOT]` tag) before allowing submission.
  - *Credential Verification:* Validates against demo store.
  - *Throttling (ADR-020):* If 5 consecutive failed attempts occur, account locks for 15 minutes with high-contrast alert banner, token recovery link to `/auth/reset-password`, and demo reset button.
- **Resulting UI State:** Success updates header with paddle number; failure shows alert banner; throttling blocks form submit.
- **Accessibility Requirements:** Error banner has `role="alert"`; focus is placed on the alert banner upon error; CAPTCHA is keyboard operable.
- **Testable Acceptance Criterion:** 5 consecutive failed logins disable the "Sign In" button and render the throttling notice with password reset link.
- **Simulation vs. Production:** Prototype simulates failed attempts counter and CAPTCHA in React state. Production will use Redis rate-limiting and enterprise CAPTCHA services.

### IX-AUTH-05: Logout & Session Clearing
- **Trigger / Event:** User clicks "Sign Out" in user menu or settings.
- **Expected Behavior & Logic:**
  - Clears mock token, resets assigned paddle state, clears active watchlist/bids from active session, and redirects to `/`.
  - Displays toast notification: *"You have been signed out."*
- **Resulting UI State:** Header reverts to "Join / Sign In" button; protected routes redirect to `/auth/login`.
- **Accessibility Requirements:** Toast announces via `aria-live="polite"`.
- **Testable Acceptance Criterion:** Post-logout, navigating to `/account/bids` immediately redirects to `/auth/login`.
- **Simulation vs. Production:** Standard session invalidation.

### IX-AUTH-06: Password Reset & Token Recovery Flow (ADR-020, Spec §5.5)
- **Trigger / Event:** User navigates to `/auth/reset-password` from "Forgot Password?" link on login form, throttling notice, or simulated email link.
- **Expected Behavior & Logic:**
  - *Token Evaluation on Mount:*
    - If URL contains a valid simulated token parameter (`?token=valid-demo`): Form initializes in Active Reset mode displaying New Password and Confirm Password inputs.
    - If URL contains an expired token parameter (`?token=expired`, simulating expiry after 15 minutes per ADR-020 draft assumption): System renders the Stone Surface `#EDE7DC` expiration warning card with a direct `"Request New Reset Link"` recovery CTA.
    - If URL contains an invalid or consumed token parameter (`?token=invalid`): System renders an error alert banner with a `"Request New Reset Link"` recovery CTA.
    - If accessed without token parameter: Form initializes in Request Link mode with Email input and `"Send Reset Instructions"` button.
  - *Request Link Submission (Mode A):*
    - Validates email against RFC 5322 syntax.
    - Upon submission, displays enumeration-resistant confirmation message: *"If an account exists for this email address, you will receive password reset instructions shortly."* (Spec §5.5).
    - In demo sandbox, provides quick-action button to simulate token delivery.
  - *New Password Submission (Mode B):*
    - Live validation checks password complexity (minimum 10 characters, at least 1 uppercase letter, 1 lowercase letter, 1 digit; ADR-020 draft assumption).
    - Equality validation verifies Confirm Password matches New Password exactly.
    - Submitting with valid matching passwords:
      1. Disables submit button and shows loading spinner (*"Securing account credentials..."*).
      2. Updates password in local mock user registry.
      3. Invalidates all existing mock session tokens for the account.
      4. Redirects to `/auth/login` and displays persistent success banner: *"Your password has been reset successfully. Please sign in with your new credentials."*
- **Resulting UI State:** Transition to `/auth/login` with green/high-contrast success banner; or in expired token state, renders warning card with recovery action.
- **Accessibility Requirements:**
  - Password inputs have explicit `<label>` tags with `htmlFor` bindings.
  - Inline error messages set `aria-invalid="true"` and bind via `aria-describedby="[error-id]"`.
  - Password visibility toggle (`Eye`/`EyeOff`) has accessible name (`"Show password"` / `"Hide password"`) and supports keyboard activation (`Enter`/`Space`).
  - In expired token state, warning container has `role="alert"` and automatically focuses the `"Request New Reset Link"` recovery button.
  - Screen readers announce submission success via `aria-live="polite"` (*"Password reset successful. Proceed to sign in."*).
- **Testable Acceptance Criterion:** Navigating to `/auth/reset-password?token=expired` renders the expiration warning card and keyboard focus lands on "Request New Reset Link"; submitting valid matching 10-character passwords with a valid token updates credentials, invalidates sessions, and redirects to `/auth/login` displaying the success banner.
- **Simulation vs. Production:** Prototype simulates token evaluation and 15-minute expiration in React state (prototype simulation only; unapproved draft assumption pending security review); production will use cryptographically signed, single-use server tokens and secure email delivery.

---

## 4. Interaction Domain 3: Catalog Browsing, Filtering & Search

### IX-CAT-01: Working Category Filter Tabs
- **Trigger / Event:** User clicks category filter tab (*All Specimens, Chronographs, Dress & Ultra-Thin, Historic Divers, Complications*) in Section 5 or `/auctions/upcoming`.
- **Expected Behavior & Logic:**
  - Filter state updates immediately.
  - Collection grid executes cross-fade transition (180–260ms ease-out).
  - Displays only lots tagged with selected classification.
  - Updates active tab styling (Acid Lime underline or solid `#182720` pill).
- **Resulting UI State:** Filtered grid view; zero layout jump (CLS < 0.02).
- **Accessibility Requirements:** Tab list marked with `role="tablist"`; individual tabs have `role="tab"` and `aria-selected="true/false"`; panel has `role="tabpanel"`.
- **Testable Acceptance Criterion:** Selecting "Chronographs" displays only the Rolex 6239 and Lange Datograph within 260ms.
- **Simulation vs. Production:** Instant client-side array filter.

### IX-CAT-02: Empty Filter State & Reset Action
- **Trigger / Event:** User applies combination of filters yielding zero matching lots.
- **Expected Behavior & Logic:**
  - Grid replaced with centered empty state container:
    - Lucide `SearchX` or `Clock` icon.
    - Message: *"No specimens currently cataloged in this classification."*
    - Button: `Reset All Filters`.
  - Clicking `Reset All Filters` restores default "All Specimens" view.
- **Resulting UI State:** Graceful empty state with clear recovery path.
- **Accessibility Requirements:** Empty state announced to screen reader; reset button receives keyboard focus.
- **Testable Acceptance Criterion:** Filter combination with 0 matches displays reset button; clicking reset restores full catalog.
- **Simulation vs. Production:** Standard frontend empty state handling.

### IX-CAT-03: Image Hover Zoom
- **Trigger / Event:** Pointer enters lot card image container.
- **Expected Behavior & Logic:**
  - Image smoothly scales from `scale(1.0)` to `scale(1.025)` over `400ms` using `cubic-bezier(0.25, 1, 0.5, 1)`.
  - Card container retains `overflow: hidden` to prevent boundary overflow.
  - Micro-details (bezel knurling, dial texture) become enhanced.
- **Resulting UI State:** Subtle luxury tactile feedback.
- **Accessibility Requirements:** Disabled entirely under `@media (prefers-reduced-motion: reduce)`.
- **Testable Acceptance Criterion:** Inspecting transform styles confirms scale factor does not exceed `1.035`; no scale applied when reduced-motion is active.
- **Simulation vs. Production:** Pure CSS/Framer Motion visual behavior.

### IX-CAT-04: Multi-Category Filter Switching & Autonomous Lot Navigation (FR-VLT-05)
- **Trigger / Event:** User clicks luxury category filter tabs (*Fine Horology*, *Rare Coins & Numismatics*, *Haute Joaillerie*, *Fine Art*) on catalogue views (`/`, `/auctions/upcoming`, `/auctions/live`).
- **Expected Behavior & Logic:**
  - Active category tab highlights with `#182720` pill or underline.
  - Lot grid updates within `180–260ms` with smooth opacity cross-fade.
  - Each rendered lot retains independent state: unique slug, countdown clock, current ask, and reserve status.
  - Deep-linking directly to `/auctions/lots/[lotSlug]` renders the autonomous lot dossier across any category.
- **Resulting UI State:** Curated category collection rendered with independent lot timers and asks.
- **Accessibility Requirements:** Category tablist uses `role="tablist"` with `aria-selected="true/false"`; lot updates announced via `aria-live="polite"`.
- **Testable Acceptance Criterion:** Selecting "Rare Coins & Numismatics" filters display to numismatic specimens; each lot displays autonomous countdown clock and current ask.
- **Simulation vs. Production:** Frontend client-side category filtering against mock multi-category inventory fixtures.

---

## 5. Interaction Domain 4: Watch Detail & Spec Inspection

### IX-LOT-01: Gallery Thumbnail Switching
- **Trigger / Event:** User clicks thumbnail (Dial, Calibre, Caseback, Profile) on `/auctions/lots/[lotSlug]`.
- **Expected Behavior & Logic:**
  - Primary large-format image smoothly cross-fades to selected angle over `220ms`.
  - Active thumbnail receives a `2px solid #182720` highlight border.
  - Large image container preserves `4:5` aspect ratio.
- **Resulting UI State:** Primary view displays new angle; thumbnails reflect active index.
- **Accessibility Requirements:** Thumbnails are accessible buttons with `aria-label="View [Angle] for [Watch Reference]"`; `aria-current="true"` on active thumb.
- **Testable Acceptance Criterion:** Clicking "Calibre Movement" thumbnail updates main image source within 250ms with zero layout shift.
- **Simulation vs. Production:** Identical client-side gallery behavior.

### IX-LOT-02: Calibre Specification Accordion (SpecGrid)
- **Trigger / Event:** User clicks technical spec accordion headers (Movement, Dimensions, Provenance).
- **Expected Behavior & Logic:**
  - Accordion panel smoothly expands or collapses over `200ms ease`.
  - Chevron icon rotates `180deg`.
  - Displays tabular technical parameters in `IBM Plex Mono` (e.g., Calibre 722, 18,000 vph, 17 jewels).
- **Resulting UI State:** Expanded or collapsed technical data view.
- **Accessibility Requirements:** Accordion headers use `<button>` with `aria-expanded="true/false"` and `aria-controls="spec-panel-id"`.
- **Testable Acceptance Criterion:** Pressing `Enter` on accordion header toggles `aria-expanded` and reveals content panel.
- **Simulation vs. Production:** Standard UI component.

### IX-LOT-03: Image Loading Failure & Monogram Fallback Card
- **Trigger / Event:** Network interruption, 404 error, or missing high-resolution image asset.
- **Expected Behavior & Logic:**
  - Container suppresses native broken image icon immediately on `onError` event.
  - Renders luxury fallback card:
    - Background: Stone Surface `#EDE7DC` with hairline border `1px solid #D8D0C2`.
    - Centered monogram in `Instrument Serif` (28–34px).
    - Lot reference number in `IBM Plex Mono` (11px).
    - Subtext: *"Archival specimen photograph currently undergoing provenance review."*
    - Aspect ratio strictly locked to `4:5` (or `16:9` for banners).
- **Resulting UI State:** Elegant branded placeholder eliminating Cumulative Layout Shift (CLS < 0.02).
- **Accessibility Requirements:** Screen-reader text provided via `<span className="sr-only">Archival placeholder for [Manufacturer] [Model] [Reference]</span>`.
- **Testable Acceptance Criterion:** Supplying an invalid `src="broken-url.jpg"` renders the `#EDE7DC` monogram card without layout shift or console crash.
- **Simulation vs. Production:** Core resilience feature required for prototype and production.

---

## 6. Interaction Domain 5: Demo Bidding Engine & Saleroom Dynamics

### IX-BID-01: Quick-Bid Placement & Increment Validation
- **Trigger / Event:** Authenticated user clicks "Bid Next: $[Amount] [DEMO]" or submits a custom jump-bid in saleroom or lot view.
- **Expected Behavior & Logic:**
  - **Vault Balance Gating (FR-VLT-02):** Evaluates candidate bid amount against user's current `Available to Bid` balance:
    - If `Bid Amount > Available to Bid`: The submission is blocked immediately prior to acceptance. Triggers accessible error alert (see `IX-VLT-02`) and halts state update.
  - Evaluates current ask against the approved 5-tier prototype increment schedule (prototype simulation only):
    - Under $10,000: +$250
    - $10,000–$49,999: +$1,000
    - $50,000–$99,999: +$2,500
    - $100,000–$249,999: +$5,000
    - $250,000 and above: +$10,000
  - Quick-Bid button automatically offers `Current Ask + Current Tier Increment`.
  - Custom Jump-Bids validated via Option B (Destination-Tier Ladder Model):
    - Bid must exceed the minimum acceptable ask.
    - Bid entering a destination tier must land on an exact multiple of the destination tier's increment anchored at its lower boundary (`Lower Boundary + k * Increment`).
    - Invalid custom bids trigger inline error (e.g., *"Custom bids in the $10,000–$49,999 range must be in exact multiples of $1,000."*).
  - Optimistically updates UI upon valid submission:
    - Moves bid amount from `Available to Bid` into `Reserved Funds` (FR-VLT-03).
    - User's bid becomes highest ask.
    - Bid log prepends new row: `Paddle #[UserPaddle] — $[Amount] — Just now`.
    - User status updates to `[WINNING]`.
  - Schedules simulated bot counter-bid after 3–6 seconds (if auction is active).
- **Resulting UI State:** Highest bid reflects user's submission; interactive bid button increments to next ask; Vault available balance decrements.
- **Accessibility Requirements:** Screen readers announce new bid via `aria-live="polite"` region (*"Bid of $145,000 accepted. You are the highest bidder."*).
- **Testable Acceptance Criterion:** With ask at $9,750, Quick-Bid offers $10,000; custom jump-bid of $15,000 is accepted; custom jump-bid of $15,250 is rejected with validation error; bids exceeding Available to Bid are rejected before recording.
- **Simulation vs. Production:** Prototype uses client-side optimistic state with simulated bot timers (prototype simulation only; not production authorization); production will execute atomic server transactions over WebSockets upon backend authorization.

### IX-BID-02: Simulated Bot Counter-Bidding & Outbid Fund Release
- **Trigger / Event:** Elapsed delay of 3–6 seconds after user places a winning bid.
- **Expected Behavior & Logic:**
  - Client-side simulation randomly generates a competing bid from a simulated collector (e.g., `Paddle #8812` or `Paddle #1904`).
  - New bid exceeds user's bid by exactly one tier increment.
  - Updates current ask display and prepends to bid log.
  - **Outbid Fund Release (FR-VLT-03):** Automatically releases the user's previously reserved funds for this lot, restoring them back to `Available to Bid` (see `IX-VLT-03`).
  - Dispatches an accessible high-contrast outbid toast in Acid Lime `#D7E65A` / Deep Forest `#182720`: *"You have been outbid by Paddle #8812. Current ask: $[NewAmount]"*.
  - User status changes from `[WINNING]` to `[OUTBID]`.
- **Resulting UI State:** Ask increments; user prompted to counter-bid; reserved funds released back to available balance.
- **Accessibility Requirements:** Toast announced via `aria-live="polite"`; audible optional chime toggleable in masthead.
- **Testable Acceptance Criterion:** Within 6 seconds of user bid, ask increments, outbid alert appears, and user's Available to Bid increases by the released amount.
- **Simulation vs. Production:** Strictly demonstration bot engine; labeled `[DEMO DATA]`.

### IX-BID-03: Soft-Close Anti-Sniping & Late-Bidding Logic (ADR-012)
- **Trigger / Event:** An authenticated user submits a bid on an active lot during its final countdown before the deadline.
- **Expected Behavior & Logic:**
  - *Pre-Deadline Bid Validation:* The bid is first evaluated under normal bid-validation rules (paddle active, meets increment schedule or valid Option B jump-bid ladder), regardless of whether the extension cap has been reached. Bids submitted at or after the deadline (`00:00:00`) are rejected.
  - *Clock Reset Eligibility (Soft-Close Active):* If the bid is valid, the remaining countdown clock resets to exactly `120 seconds` (`00:02:00`) only if:
    1. Remaining time is strictly less than 120 seconds ($t < 120\text{s}$, displayed `00:01:59` down to `00:00:01`), AND
    2. Fewer than 10 extensions have been consumed ($N < 10$).
    - When triggered, lot extension counter increments ($N + 1$ of 10), clock resets to `00:02:00`, pulsating badge displays `[SOFT-CLOSE RESET (EXT N/10)]`, and bid log records: *"Soft-close clock reset to 00:02:00 (Extension N/10) by Paddle #[ID]"*.
  - *Exact 120-Second Boundary:* At exactly `00:02:00` ($120.0\text{s}$), a valid bid is accepted under normal validation, but no reset occurs and no extension is consumed.
  - *Post-Cap Hard Close ($N = 10$):* Once 10 extensions have been consumed, valid pre-deadline bids may still be accepted, but the clock never resets again. The timer continues running toward `00:00:00`, badge displays `[HARD CLOSE — MAXIMUM EXTENSIONS REACHED]`, and the lot closes definitively at `00:00:00`.
- **Resulting UI State:** If eligible for reset, clock jumps to `00:02:00` with extension badge $N/10$. If submitted at `00:02:00` or after 10 extensions, bid is accepted and ask increments, but clock continues running undisturbed toward `00:00:00`.
- **Accessibility Requirements:** Announcements via `aria-live="polite"` region: *"Auction deadline reset to 2 minutes due to late bid. Extension N of 10."* or *"Bid accepted. Auction in hard close with no further extensions."*
- **Testable Acceptance Criterion:** Placing a valid bid with 45 seconds remaining (with $<10$ extensions) resets timer to 2 minutes 00 seconds; placing a valid bid at exactly 2 minutes 00 seconds accepts the bid without altering the timer or extension count; placing an 11th valid pre-deadline bid after 10 extensions accepts the bid without resetting the timer; bids submitted at or after 00:00:00 are rejected.
- **Simulation vs. Production:** Prototype executes clock-reset and post-cap hard close in client-side state machine (prototype simulation only); production will synchronize authoritative deadline via server clock upon separate backend authorization.

### IX-BID-04: Proxy Bidding ("Max Bid") Configuration (ADR-022)
- **Trigger / Event:** User opens "Configure Max Bid" drawer, enters confidential ceiling (e.g. `$160,000`), and clicks "Confirm Ceiling".
- **Expected Behavior & Logic:**
  - System stores user's ceiling in local state.
  - When a simulated bot places a counter-bid below user's ceiling, the engine automatically places an immediate one-step counter-bid on user's behalf.
  - Continues auto-bidding until ceiling is reached or user wins.
  - If bot exceeds ceiling, system stops auto-bidding and dispatches final outbid toast.
- **Resulting UI State:** Badge displays `[PROXY BID ACTIVE: CEILING $[Ceiling]]`.
- **Accessibility Requirements:** Ceiling input includes clear `<label>` and helper text explaining client-side simulation.
- **Testable Acceptance Criterion:** With a ceiling of $160,000 and bot bid of $145,000, engine auto-bids $150,000 without requiring user click.
- **Simulation vs. Production:** Client-side proxy simulation; production will maintain confidential server-side proxy queue.

### IX-BID-05: Mobile Sticky Bidding Bar (ADR-023)
- **Trigger / Event:** User scrolls past Section 7 or lot gallery on viewports `<768px`.
- **Expected Behavior & Logic:**
  - Compact `56px` high bar pins smoothly to bottom of screen.
  - Container styling: Frosted Warm Paper (`background: rgba(244, 240, 232, 0.95); backdrop-filter: blur(8px); border-top: 1px solid #D8D0C2`).
  - Respects mobile device safe-area insets (`env(safe-area-inset-bottom)`).
  - Displays lot reference, current ask, and compact Acid Lime "Bid" CTA button.
  - Clicking "Bid" opens quick-bid drawer or triggers instant bid.
- **Resulting UI State:** Persistent bidding access on mobile without scrolling back to saleroom console.
- **Accessibility Requirements:** Does not obscure content or interactive controls; focus order includes sticky bar.
- **Testable Acceptance Criterion:** On 390px viewport, scrolling past Section 7 reveals sticky bar; clicking Bid increments current ask.
- **Simulation vs. Production:** Identical frontend responsive component.

---

## 7. Interaction Domain 5A: Pre-Funded Vault Controls & Financial Eligibility (v2.3 Amendment)

### IX-VLT-01: Three-Tier Vault Balance Display & Header Eligibility Chip (FR-VLT-01)
- **Trigger / Event:** User authenticates, navigates to `/account`, or views saleroom bidding console.
- **Expected Behavior & Logic:**
  - Renders three distinct balance metrics in `IBM Plex Mono`:
    1. **Total Vault Balance:** Total funds deposited/credited in demo account (e.g. `$150,000.00` / `₹1,00,000.00`).
    2. **Reserved Funds:** Total funds currently committed to active leading bids or winning lot holds.
    3. **Available to Bid:** Calculated as `Total Vault Balance − Reserved Funds − Other Applicable Holds`.
  - Header displays compact eligibility chip: `Vault Avail: $XX,XXX [DEMO]`.
  - All balance figures feature visible `[DEMO DATA]` tags.
- **Resulting UI State:** Immediate transparency into collector's financial eligibility.
- **Accessibility Requirements:** Balance updates announce via `aria-live="polite"`; balance values have semantic labels.
- **Testable Acceptance Criterion:** Profile and salerooms render Total, Reserved, and Available balances; sum of Reserved + Available equals Total.
- **Simulation vs. Production:** Client-side reactive state fixture; live money rails strictly prohibited.

### IX-VLT-02: Maximum Bid Enforcement & Insufficient Funds Rejection (FR-VLT-02, FR-VLT-06)
- **Trigger / Event:** User attempts to place a bid exceeding their current `Available to Bid` amount.
- **Expected Behavior & Logic:**
  - System intercepts bid prior to recording, broadcasting, or updating the clock.
  - Rejection occurs immediately without modifying saleroom state.
  - Renders accessible error banner and toast:
    *"Bid not accepted. Your available Vault balance is insufficient for this bid. Add eligible funds or reduce your bid amount."*
  - UI highlights the shortfall: shows current Available to Bid vs. Attempted Bid Amount.
  - Keyboard focus remains on or near the bid input field.
  - *Benchmark:* With ₹1,00,000 available, an attempted bid of ₹2,00,000 is blocked immediately.
- **Resulting UI State:** Bid blocked; inline error container displayed with `role="alert"`; ask and countdown undisturbed.
- **Accessibility Requirements:** Error flagged with `role="alert"` and `aria-live="polite"`; auto-focus maintained on bid input.
- **Testable Acceptance Criterion:** Attempting bid exceeding Available to Bid triggers the exact specified error message without incrementing ask or resetting timer.
- **Simulation vs. Production:** Frontend eligibility check; production will mirror this validation at server gateway.

### IX-VLT-03: Leading-Bid Fund Reservation & Outbid Release Lifecycle (FR-VLT-03)
- **Trigger / Event:** User's bid becomes the leading bid, or a competing bid outbids the user.
- **Expected Behavior & Logic:**
  - *On Leading:* Exact bid amount is transferred from `Available to Bid` to `Reserved Funds`. Active commitments table adds row for the lot.
  - *On Outbid:* The reserved funds for that lot are instantly released from `Reserved Funds` back into `Available to Bid`.
  - *On Lot Win:* Reserved funds remain locked in `Reserved Funds` until simulated checkout is completed.
  - *Anti-Double-Counting:* Funds are never committed to multiple active bids simultaneously.
- **Resulting UI State:** Real-time balance updates across header chip, saleroom console, and account ledger.
- **Accessibility Requirements:** Balance changes announce dynamically via `aria-live="polite"`.
- **Testable Acceptance Criterion:** Placing a $40,000 leading bid decrements Available to Bid by $40,000; receiving an outbid notification immediately restores $40,000 to Available to Bid.
- **Simulation vs. Production:** Handled via prototype reactive store; labeled `[DEMO DATA]`.

### IX-VLT-04: Cross-Lot Multi-Auction Global Commitment Constraint (FR-VLT-04)
- **Trigger / Event:** User with active leading bids on Lot A attempts to bid on Lot B in concurrent auctions.
- **Expected Behavior & Logic:**
  - Available to Bid is calculated globally across all active salerooms:
    `Available to Bid = Total Vault Balance − Sum(Leading Bids across all lots) − Other holds`.
  - System checks candidate bid against global Available to Bid.
  - If sum of commitments would exceed Total Vault Balance, the bid on Lot B is rejected with the standard insufficient funds alert.
  - *Benchmark:* A user with ₹1,00,000 balance holding a leading bid of ₹70,000 on Lot A cannot place a ₹60,000 bid on Lot B (total commitments ₹1,30,000 > ₹1,00,000).
- **Resulting UI State:** Saleroom B displays insufficient funds warning; Lot A leading status remains unaffected.
- **Accessibility Requirements:** Error banner announced via `role="alert"`.
- **Testable Acceptance Criterion:** With ₹1,00,000 balance and ₹70,000 leading bid on Lot A, attempting ₹60,000 bid on Lot B is blocked.
- **Simulation vs. Production:** Prototype client-side store coordinates state across concurrent auction views.

---

## 8. Interaction Domain 6: Consignor Intake & Onboarding

### IX-CON-01: Multi-Step Consignment Wizard Navigation
- **Trigger / Event:** User clicks "Next Step" or "Previous Step" in `/consign`.
- **Expected Behavior & Logic:**
  - Steps:
    - Step 1: Reference, Manufacturer, Serial Obscurity, Year.
    - Step 2: Provenance, Box & Papers, Service History.
    - Step 3: Mock Photographic Uploader.
    - Step 4: Proposed Valuation & Reserve Preference.
  - Current step validates inputs on blur and on "Next Step".
  - Wizard updates top progress indicator (`Step 2 of 4: Provenance Dossier`).
  - Previous step values are preserved in local form state.
- **Resulting UI State:** Smooth slide transition between wizard steps (200ms ease).
- **Accessibility Requirements:** Stepper uses `<ol>` with `aria-current="step"`; focus placed on first input of new step.
- **Testable Acceptance Criterion:** Clicking "Next Step" with invalid input stops transition and flags missing fields.
- **Simulation vs. Production:** Multi-step client form.

### IX-CON-02: Simulated Consignment Submission & Ticket Generation
- **Trigger / Event:** User submits completed consignment dossier on Step 4.
- **Expected Behavior & Logic:**
  - Submission button indicates loading (*"Generating consignment ticket..."* for 700ms).
  - Generates mock ticket ID: `CBV-INTAKE-[4-digit random]`.
  - Saves submitted lot to mock consignments registry.
  - Displays confirmation view with status badge: `Under Specialist Review (Simulated Demo Feedback — Not a Real Appraisal Commitment)`.
  - Explanatory copy clarifies the 48-hour appraisal timeline is demonstration feedback.
  - Provides direct button to `/account/consignments`.
- **Resulting UI State:** Confirmation screen replaces wizard form.
- **Accessibility Requirements:** Success message announced via `aria-live="polite"`; focus placed on confirmation heading.
- **Testable Acceptance Criterion:** Submitting wizard renders `CBV-INTAKE-XXXX` ticket and adds entry to `/account/consignments`.
- **Simulation vs. Production:** Mock ticket generation; production will dispatch real database intake record to specialist saleroom team.

---

## 9. Interaction Domain 7: Admin & Specialist Boundaries

### IX-ADM-01: Demonstration Saleroom Room Controls (Specialist Gate)
- **Trigger / Event:** User with simulated specialist role toggles saleroom controls on `/auctions/live`.
- **Expected Behavior & Logic:**
  - Available actions: `[Pause Saleroom]`, `[Extend +2m]`, `[Simulate Hammer Fall]`.
  - Toggling `Pause` freezes all countdown clocks and disables bid buttons across all open clients with banner: `[SALEROOM TEMPORARILY PAUSED BY SPECIALIST]`.
  - Clicking `Simulate Hammer Fall` concludes lot bidding, records highest bid as hammer price, and triggers simulated invoicing.
- **Resulting UI State:** Saleroom state reflects specialist intervention.
- **Accessibility Requirements:** Saleroom status changes announce via `aria-live="assertive"`.
- **Testable Acceptance Criterion:** Clicking "Pause" disables Bid buttons and displays paused banner.
- **Simulation vs. Production:** In prototype, available via demo specialist switcher; production requires isolated administrative role gate.

### IX-ADM-02: Neutrality Lockout for Administrators
- **Trigger / Event:** User logged in under admin/specialist profile attempts to place a bid.
- **Expected Behavior & Logic:**
  - System intercepts action and displays toast alert: *"Auction Neutrality Policy: Specialist and administrative accounts are strictly prohibited from bidding in salerooms."*
  - Bid submission is blocked.
- **Resulting UI State:** Bid input disabled; warning displayed.
- **Accessibility Requirements:** Error banner has `role="alert"`.
- **Testable Acceptance Criterion:** Admin profile clicking Bid receives neutrality lockout message; bid does not increment.
- **Simulation vs. Production:** Core compliance rule enforced identically in prototype and production.

---

## 10. Interaction Domain 8: Modals, Drawers & Error Recovery

### IX-MOD-01: Focus Trapping & Dismissal
- **Trigger / Event:** Opening any dialog (Auth Drawer, Max Bid Modal, Condition Dossier).
- **Expected Behavior & Logic:**
  - Background receives `aria-hidden="true"`.
  - Keyboard focus immediately shifts to the dialog's first focusable element.
  - Pressing `Tab` or `Shift+Tab` wraps focus exclusively within dialog boundaries.
  - Pressing `Escape` key closes dialog, restores `aria-hidden="false"`, and returns focus to the initiating trigger button.
- **Resulting UI State:** Modal open with active keyboard focus; clean dismissal.
- **Accessibility Requirements:** Strict WCAG 2.2 AA focus trapping; dialog element has `role="dialog"` and `aria-modal="true"`.
- **Testable Acceptance Criterion:** Tabbing at the last element in modal cycles to the first element; pressing `Escape` closes modal and restores focus to trigger.
- **Simulation vs. Production:** Standard accessible dialog implementation.

### IX-MOD-02: Unauthenticated Watchlist / Bidding Prompt
- **Trigger / Event:** Guest user clicks "Save to Watchlist" or "Place Bid" on any lot.
- **Expected Behavior & Logic:**
  - Intercepts action and slides in the Auth Drawer from right.
  - Displays context banner: *"Create an account or sign in to save [Watch Reference] and activate your demonstration paddle."*
  - Retains lot context so successful login completes the intended action automatically.
- **Resulting UI State:** Auth drawer open with contextual heading.
- **Accessibility Requirements:** Trigger retains focus context; drawer traps focus.
- **Testable Acceptance Criterion:** Clicking Watchlist as guest opens drawer; signing in adds lot to watchlist and returns user to lot page.
- **Simulation vs. Production:** Standard client authentication gating.

---

## 11. Summary Matrix of Interactions

| ID | Domain | Trigger | Primary UI State Transition | A11y Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **IX-NAV-01** | Navigation | Scroll >40px | Header morphs to frosted glass bar | Non-disruptive, no reflow | Approved Spec |
| **IX-NAV-02** | Navigation | Route Change | Underline active link, `aria-current="page"` | `aria-current="page"` | Approved Spec |
| **IX-NAV-03** | Navigation | Hamburger Click | Slide-in drawer sheet, body lock | Focus trap, `Escape` key | Approved Spec |
| **IX-NAV-04** | Navigation | Currency Select | Convert numbers via static multipliers | `aria-live="polite"` | Approved Spec |
| **IX-AUTH-01**| Auth | Signup Submit | Inline validation, step transition | `aria-invalid`, auto-focus | Approved Spec |
| **IX-AUTH-02**| Auth | Enter PIN | Auto-advance slots, verify `123456` | `<fieldset>`, `aria-live` | Draft Assumption |
| **IX-AUTH-03**| Auth | Select Intent | Route to saleroom, consign, or account | Keyboard selectable | Approved Spec |
| **IX-AUTH-04**| Auth | Login Submit | Validate credentials, throttle alert | `role="alert"`, generic error | Draft Assumption |
| **IX-AUTH-05**| Auth | Sign Out Click | Invalidate mock session, redirect home | `aria-live="polite"` toast | Approved Spec |
| **IX-CAT-01** | Catalog | Filter Tab Click| Cross-fade grid in 180–260ms | `role="tablist"`, `aria-selected` | Approved Spec |
| **IX-CAT-02** | Catalog | Zero Matches | Render empty container with Reset CTA | Focus to reset button | Approved Spec |
| **IX-CAT-03** | Catalog | Image Hover | Scale to 1.025 over 400ms | Disabled in reduced-motion | Approved Spec |
| **IX-CAT-04** | Catalog | Category Tab | Filter across Horology, Coins, Jewelry, Art | `role="tablist"`, `aria-live` | Approved Spec (v2.3) |
| **IX-LOT-01** | Lot Detail | Thumb Click | Cross-fade main image, border active | `aria-label`, `aria-current` | Approved Spec |
| **IX-LOT-02** | Lot Detail | Accordion Click| Expand/collapse technical specs | `aria-expanded`, `aria-controls`| Approved Spec |
| **IX-LOT-03** | Lot Detail | Image Error | Render `#EDE7DC` monogram card | `sr-only` description, CLS<0.02 | Approved Spec |
| **IX-BID-01** | Bidding | Bid Button | Optimistic ask update, log row prepend | `aria-live="polite"` | Approved Spec |
| **IX-BID-02** | Bidding | Bot Delay 3–6s | Bot counter-bid, Acid Lime outbid toast | `aria-live="polite"`, chime | Approved Spec |
| **IX-BID-03** | Bidding | Bid at <120s | Timer +120s, soft-close badge | `aria-live="polite"` announcement | Selected Approach |
| **IX-BID-04** | Bidding | Configure Ceiling | Auto-step bids against bot up to max | Explicit labels, disclaimer | Approved Spec |
| **IX-BID-05** | Bidding | Mobile Scroll | Pinned 56px bottom sticky bidding bar | Mobile safe-area, no overlap | Approved Spec |
| **IX-VLT-01** | Vault | View Balance | Three-tier balance display & header chip | `aria-live="polite"`, `[DEMO DATA]` | Approved Spec (v2.3) |
| **IX-VLT-02** | Vault | Bid > Available | Block submission, accessible alert | `role="alert"`, focus on input | Approved Spec (v2.3) |
| **IX-VLT-03** | Vault | Lead / Outbid | Reserve on lead, instant release on outbid | `aria-live="polite"` balance sync | Approved Spec (v2.3) |
| **IX-VLT-04** | Vault | Multi-Lot Bids | Global balance limit preventing over-bid | `role="alert"` cross-lot check | Approved Spec (v2.3) |
| **IX-CON-01** | Consign | Step Navigation | Validate current step, slide to next | `aria-current="step"`, focus | Approved Spec |
| **IX-CON-02** | Consign | Final Submit | Loading state, generate mock ticket | `aria-live="polite"`, disclaimer | Approved Spec |
| **IX-ADM-01** | Admin | Pause/Extend | Freeze countdown, disable bid buttons | `aria-live="assertive"` | Approved Spec |
| **IX-ADM-02** | Admin | Admin Bids | Intercept bid, display neutrality lockout | `role="alert"` lockout toast | Approved Spec |
| **IX-MOD-01** | Dialogs | Open Modal | Focus trap inside dialog, `Escape` exit | `role="dialog"`, focus return | Approved Spec |
| **IX-MOD-02** | Dialogs | Unauth Action | Slide in auth drawer with context banner | Context preservation | Approved Spec |
