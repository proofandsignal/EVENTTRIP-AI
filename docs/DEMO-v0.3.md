# EventTrip AI — Interactive Test Demo v0.3

Date: 2026-10-23 · **Draft PR #1 / merge and deployment locked**

Portable single-file demo: [demo/EventTrip_AI_Test_Demo_v0.3.html](../demo/EventTrip_AI_Test_Demo_v0.3.html)

## Delta from v0.2

- Compare **2–3 synthetic trips** side by side with a normalized traveler/night count and five-component breakdown.
- Show the numeric difference from the lowest **synthetic** total, **not** a verified best deal.
- Preserve comparison selections while filtering destination and category. Prevent a fourth selection and offer a clear-selection control.
- Maintain keyboard focus after choosing a comparison item.
- Set minimum selectable departure date to the browser's local current date. **Departure dates are UI inputs only and never reprice fixtures.**

## Reproducible demo

1. Download `demo/EventTrip_AI_Test_Demo_v0.3.html` and open it in Chrome, Edge, or Firefox; no app installation or server needed.
2. Add Vienna Budget and Vienna Luxury to comparison, then click `Compare selected (2/3)`. Read per-component prices and difference between illustrative totals.
3. Clear comparison; set Vienna / Budget / 2 travelers / 3 nights.
4. Open the breakdown: expected synthetic total **€556** = transport €184 + hotel €252 + experience €50 + baggage €36 + transfers €34.
5. Set Vienna / Events to verify the empty state; reset the filters.

## Verification evidence

- Local Node tests: **6/6 PASS** for v0.3 (comparison math, invalid values, fixture boundaries and partner blocks).
- Local Chromium click-through at **1440×900** desktop and **390×844** mobile: initial results, comparison selection, two-way comparison, clear selection, filtering, price breakdown, disabled booking, no JS page errors, and no horizontal overflow passed.
- Browser sandbox blocked file URL navigation, so Chromium used the exact demo HTML through `page.set_content`. **Hosted E2E remains PENDING**.
- CI: `npm run check` runs the full Node test suite including `tests/demo-v03.test.js`.

## Not implemented / release gates

Fixtures do not represent live availability, hotel capacity, booking inventory, current prices, concerts, final fees or authorized links. Departure date does not affect price. One hotel room is assumed for 1–2 people. Taxes, cancellation conditions and supplier-specific fees are not verified. No real affiliate clicks, attribution, bookings or revenue occur.

Partner owner registration may proceed independently. Only integrate partner-approved search widgets/deep links after confirming terms, source of prices and allowed traffic channels.

**DO NOT MERGE OR DEPLOY** based on this demo; require independent release review, approved affiliate flow, attribution proof, legal/privacy checks and explicit human authorization.

`CONTINUE BUILD → TEST → VERIFY → DEMO → PARTNER ACCESS → ATTRIBUTION → RELEASE REVIEW → EARLY LAUNCH`
