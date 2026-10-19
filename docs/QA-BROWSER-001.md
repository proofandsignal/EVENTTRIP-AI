# BUILD-001 — Chromium browser QA checkpoint (2026-10-19)

**Result:** 21/21 local interactive checks PASS using Chromium at 1440×900 desktop and 390×844 touch-enabled mobile viewports.

## Exact source verification

The local HTML, CSS and app/data/core JavaScript files were verified by Git blob SHA against PR #1. For browser sandbox compatibility the exact CSS was inlined and JavaScript imports/exports mechanically converted into a single local script. This exercises rendered behavior using the same source logic, but does **not** exercise production HTTP module loading, response headers or a live deployment.

## Browser checks

- Desktop and mobile: initial 10 editorial cards, no page JavaScript errors, no horizontal overflow, no external booking links.
- Desktop: accessible first Tab skip-link, visible focus, Events category, combined city + category, empty results, reset filters, trip selection.
- Calculator: two travelers, 3 nights, travel €70 each, hotel €110/night, event €85 each, baggage €20 each, transfers €35/trip yields €715 total; full/partial labels and invalid traveler input verified.
- Touch-enabled mobile: category selector actually responds to tap; 44px minimum button and card action target heights after 2026-10-19 CSS fix.

## Screenshots

Captured locally (desktop + mobile). The screenshots are available as conversation artifacts, **not** stored in this public GitHub repository.

## Remaining acceptance / release blockers

- [ ] Test real ES module loading on an authorized hosted/preview environment when available (no deployment authorized yet).
- [ ] Independent visual/accessibility review and representative user testing.
- [ ] Approved, permitted affiliate partner referral and tracking proof (Issue #2).
- [ ] Security/legal/privacy and consent review before publication.
- [ ] Explicit merge and deployment authorization.

**Status:** BROWSER FUNCTIONAL QA PASS / HOSTED E2E PENDING / PARTNER ACCESS PENDING / MERGE LOCKED / DEPLOY LOCKED. No revenues, paid bookings or production integrations have been observed.
