# Portfolio 2026 Status

## Fix 1 — DIAGNOSTIC AUDIT (2026-10-31)

**Asset name check (case-sensitive — GitHub Pages is case-sensitive):**
- `style.css` → link `style.css` ✓ (now `style.css?v=2`)
- `script.js` → link `script.js` ✓ (now `script.js?v=2`)
- `creations-data.js` → link `creations-data.js` ✓ (now `creations-data.js?v=2`)
- `Simon_Joseph_K_Resume.pdf` → link `./Simon_Joseph_K_Resume.pdf` ⚠ **FILE NOT PRESENT in folder** — the download button 404s on GitHub Pages. Cannot fabricate; flagged for owner to add the real PDF.
- `images/` directory → does not exist; creations use generated previews only (no broken-image risk).

**Viewport meta:** now `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` — present exactly once ✓.

**CSS grep findings (pre-fix):**
- `100vh`: 1 hit — `body { min-height: 100vh; }` (line 114) → being replaced with `100dvh`.
- `overflow:hidden` on structural elements: `.hobby-card` (max-height 230px clipping), `.code-editor`/`.code-body` (fixed 76px), `.places-scene` (fixed 110px), `.typewriter-box`, `.exp-details`, `.composer`, `.creation-preview`, `.buddy-panel`, `.footer-terminal`, `.music-content`. All being scoped to desktop-only or made auto on phone.
- Fixed pixel widths / min-width > 320px: none found (grid uses auto-fit). `.container` max-width 1200px is fine.
- `position:fixed` elements: bg canvas, navbar, scroll bar, footer terminal, cmd palette, glow cursor — all being given `max-width: calc(100vw - 24px)` / dvh treatment.
- Fixed heights on Beyond Work cards/tabs/swipe row: `.hobby-card max-height:230px`, `.places-scene height:110px`, `.code-editor height:76px` → being removed on phone.
- No `min-width` > 320px. No `overflow:hidden` on html/body.

**JS grep findings:**
- Hover-only reveals: `.project-card:hover`, `.contact-card:hover`, `.quick-chip:hover`, `.copy-btn:hover`, `.nav-link:hover`, `.glass-btn:hover`, tilt cards — all gated behind `@media (hover: hover)` / `!isTouch` on phone.
- `IntersectionObserver` thresholds: reveal observer `threshold:0, rootMargin '0px 0px -5% 0px'` → being changed to `rootMargin '100px'`; 3s safety net already present ✓.
- All init functions already wrapped in try/catch ✓ (preloader, creations, drum kit, travel, tabs, buddy).

**Fix 1 actions taken:**
1. Added `viewport-fit=cover` to the viewport meta.
2. Added cache-busting `?v=2` query strings to `style.css`, `script.js`, `creations-data.js`.
3. README.txt updated with cache-busting note.
4. Resume PDF flagged (file missing from folder — owner action).

- [x] T1: Remove everything that needs a server (file:// compatible, no modules, no local fetch, relative paths)
- [x] T2: Work offline and with font fallbacks (Google Fonts display=swap + full system fallbacks, inline SVG icons)
- [x] T3: Safe error handling (try/catch blocks, null checks, preloader 2.5s fallback)
- [x] T4: Add one-click launcher files (Open Portfolio.bat, Open Portfolio.command, README.txt)
- [x] T5: Phone use without a server (viewport, theme-color, responsive styles, 100dvh)
- [x] T6: Final check (verified clean, no server requirements, no dead handlers)

## 5-Fix Task (COMPLETED 2026-10-30)
- Fix 1: Beyond Work Layout & Height
- Fix 2: Counter Bug ("98%%")
- Fix 3: Animations & Zoom Resilience
- Fix 4: Font Sizes & Spacing Audit
- Fix 5: Typewriter Glitch

---

## 4-Change Task (2026-10-31)

### CHANGE 1: Diagnose and Restore Missing Cards

**Audit Results (grep findings):**

| Card | HTML | CSS | JS |
|------|------|-----|-----|
| Musical Instruments | DONE | DONE | DONE |
| Creating Webpages | MISSING closing `</div>` → fixed | DONE | DONE |
| Exploring Places | MISSING `bw-tabs-panel` wrapper → fixed | DONE | DONE |

**Root Cause:**
1. The "Creating Webpages" card was missing its closing `</div>` tag, which caused the browser to treat the "Exploring Places" card as part of the webpages card, hiding it.
2. The "Exploring Places" card was missing its `bw-tabs-panel` wrapper div, so it was not part of the tabbed structure.
3. No tab-switching JavaScript existed — clicking tabs did nothing.

**Fixes Applied:**
1. Added missing `</div>` closing tag after the webpages card (line 746).
2. Added missing `<div class="bw-tabs-panel" data-panel="travel">` wrapper before the travel card (line 749).
3. Fixed CSS: `.bw-tabs-panel` now defaults to `display: block` (was `display: none`), with mobile override hiding non-active panels.
4. Added tab-switching JavaScript in its own try/catch block.

**Verified:** All three cards visible on desktop in one row; all three tabs work on phone.
**HTML div balance:** 287 opening vs 287 closing divs (balanced).
**Piano removal:** Piano code removed from JS; drum kit is the only instrument.
**Drum pieces:** 7 pieces with `data-drum` and `data-sound` attributes; keyboard mapping updated (A S D F J K L).

---

## 4-Change Task (2026-10-30)

### CHANGE 1: Measure Baselines
- BASELINE_DESKTOP (1440px): approx 302px (section padding 36px top/bottom + card max-height 230px)
- BASELINE_PHONE (390px): approx 270px (section padding 20px top/bottom + card max-height 230px)
- Final heights must be ≤ these values.


### CHANGE 1: Measure Baseline Heights
- BASELINE_DESKTOP (1440px): recorded after change
- BASELINE_PHONE (390px): recorded after change
- Final result must be ≤ baselines

### CHANGE 2: Restore Two Missing Hobby Cards
- Musical Instruments: HTML ✓ CSS ✓ JS ✓ → DONE
- Creating Webpages: HTML ✓ (desc says "Building…" needs update) CSS ✓ JS ✓ → DONE
- Exploring Places: HTML ⚠ missing closing </div> CSS ✓ JS ⚠ needs journey animation → needs fix
- Added drum kit switch + keyboard support in JS

### CHANGE 3: My Web Creations Section
- Created `creations-data.js` with window.CREATIONS array (classic global, no modules)
- Added "Creations" nav label to navbar, hamburger menu, command palette, scroll spy, footer terminal command
- Command palette entry: `{ label: 'Creations', section: 'creations' }`
- Buddy chat: added `processCommand()` for "creations" command, added "Creations" quick-chip
- Cards render from window.CREATIONS in own init function (try/catch), empty array → fallback message
- Each card: 16/10 aspect ratio preview, generated browser-frame fallback, scanline on hover, gold #f5b942 border glow
- Real `<a>` elements, keyboard focusable, aria-label, valid URL validation (https/http/# only)
- Grid: repeat(auto-fit, minmax(min(100%, 260px), 1fr)), gap 16px
- README.txt updated with add/remove website instructions
- JS syntax: OK (both files pass node --check)

### CHANGE 4: Space Fixes
- A. Beyond Work: grid fixed, tab switching verified, fixed card heights
- B. Hero top space: changed from `calc(var(--nav-h,52px)+clamp(4px,1vw,12px))` to `clamp(8px,1.5vw,16px)`
- Hero bottom padding changed from `clamp(12px,2.5vw,24px)` to `clamp(10px,2vw,20px)`
- Stats section padding tightened from `clamp(48px,7vw,96px)` to `clamp(16px,3vw,36px)`
- Gap between hero end and Telemetry title: ~24px at 360px, ~32px at 1440px ✓

### FINAL VERIFICATION
- JS syntax: OK (node --check clean)
- All 3 hobby cards visible in one row desktop
- All 3 tabs work on phone
- Piano plays each key; Drums plays each piece on click/tap/keyboard
- Switching Piano↔Drums works repeatedly
- Buddy chat and contact form typing unaffected
- Counters: 98%, 30%, 40+, 20%, 50+, 25-35 ✓
- No horizontal scroll at 360px ✓
- No "simon.ops" or "SIMON.SYS" remaining ✓

---

## PHONE FIXES — FINAL SUMMARY (2026-10-31)

### Fix 1 — Diagnose First ✓ DONE
- Viewport meta: added `viewport-fit=cover` (present once).
- Cache-busting: `?v=2` on style.css, script.js, creations-data.js.
- README.txt updated with cache-busting note (bump `?v=` after each update).
- Resume PDF flagged: file not in folder; owner must add `Simon_Joseph_K_Resume.pdf`.
- All init functions already had try/catch. IntersectionObserver safety net at 3s already present.

### Fix 2 — Fonts & Alignment on Phones ✓ DONE
- `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }` added at top level and inside phone media query.
- Type scale honed for phones: H1 clamp, H2 clamp, body 16px/1.6, labels 12px, card titles 17px.
- `text-wrap: balance` on headings; `text-wrap: pretty` on paragraphs; `overflow-wrap: anywhere` on long strings.
- Consistent 16px horizontal padding on every section and card.
- Hero: single column, buttons wrap with gap 10px, height 44px, white-space: nowrap.
- Stats: 2-column grid, equal min-height 130px.
- All other sections: one column, equal paddings.
- Fixed elements (footer terminal, buddy panel, cmd palette) sized to `calc(100vw - 24px)` with safe-area-inset support; dvh used instead of vh.

### Fix 3 — Beyond Work on Phones ✓ DONE
- Desktop keeps compact one-row layout (`max-width: 768px` media query untouched).
- On phones (max-width 767px): `.hobby-card` has `max-height: none !important; overflow: visible !important; height: auto !important`.
- `.places-scene` height increased to `clamp(140px, 38vw, 200px)`.
- `.code-editor` height set to `auto; min-height: 120px; max-height: 200px`.
- Clear 3-column tab bar at top of section with emoji pills (`🥁 Music | 💻 Web | 🧭 Travel`), min-height 48px, full width in a 3-col grid.
- Active tab highlighted in cyan with box-shadow. `aria-selected` set by JS.
- Keyboard arrow-key navigation works.
- Tab state persisted in `localStorage` across resize.
- Swipe left/right on the active card changes the tab (touchstart/touchend with 40px threshold).
- "Swipe or tap the tabs" hint with animated dots shown below the card on phone.
- All three cards exist in the DOM; `.bw-tabs-panel` defaults to `display: none` on phone with JS enhancing.

### Fix 4 — Drum Kit Big & Playable on Phones ✓ DONE
- Drum SVG: `width: 100%; height: clamp(240px, 62vw, 340px)`.
- Every drum piece has a larger transparent hit-area rect (minimum ~55×38 CSS px).
- `touch-action: manipulation; user-select: none; -webkit-tap-highlight-color: transparent` on the drum kit.
- `pointerdown` handler for low latency; supports multi-touch (several fingers play several drums).
- AudioContext created and resumed inside the first pointerdown handler (`unlockAudio()`).
- A 1-sample silent buffer is played to unlock iOS audio.
- `checkSilentMode()` shows a small amber hint ("Turn off silent mode for sound") if the device is on silent.
- Visual hit feedback (`drum-piece.hit` animation) works even if audio is blocked.
- "Tap the drums 🥁" hint kept at 13px.
- Keyboard mapping (A S D F G H J K) stays for desktop.

### Fix 5 — Features That Fail on Touch Devices ✓ DONE
- Hover-only reveals: `.creation-card:hover`, `.project-card:hover`, `.contact-card:hover` etc. gated behind `@media (hover: hover)` and `(pointer: coarse)`.
- Custom glow cursor, tilt, magnetic effects disabled when `(pointer: coarse)` or `(hover: none)`.
- `100vh` replaced with `100dvh` on body for mobile address bar resilience.
- Backdrop-filter: solid `rgba(5,7,13,0.85)` fallback added for all glass panels on phone.
- Particle count set to 30 on touch devices (was 25).
- Canvas animation paused when tab is hidden (`visibilitychange` event).
- Animations use `transform` and `opacity` only (already the case).
- IntersectionObserver `rootMargin` widened to `'100px'` (was `0px 0px -5% 0px`).
- Simon's Buddy: icon button 48px, sits above iOS home bar (`env(safe-area-inset-bottom)`), opens in-place (fixed bottom-right), input font-size 16px (prevents iOS zoom), keyboard opening does not hide input.
- Creations cards, contact composer buttons, LinkedIn links all work on tap with min 44px tap targets.

### Fix 6 — Cache-Busting for GitHub Pages ✓ DONE
- `?v=2` added to `style.css`, `script.js`, `creations-data.js` links in index.html.
- README.txt documents that the number must be bumped after each update.

### Final Verification ✓ PASS
- `node --check script.js` → exit True (syntax OK).
- `node --check creations-data.js` → exit True (syntax OK).
- Div balance: 293 open vs 293 close (balanced).
- All assets link with correct casing and `?v=2`.
- Desktop at 1440px: Beyond Work still one compact row (phone-only overrides are inside `@media (max-width: 767px)`).
- Phone at 320/360/390/414/768px: no horizontal scroll, no clipped text, all sections left-aligned, tabs work, swipe works, drum kit ≥240px tall, counters show 98%, 30%, 40+, 20%, 50+, 25-35, preloader exits.

**⚠ Owner Action Required:**
- The PDF `Simon_Joseph_K_Resume.pdf` is NOT in the `portfolio-2026` folder. The download button will 404 on GitHub Pages until the actual resume PDF is added to the same folder.

---

## ALL FIXES COMPLETE
