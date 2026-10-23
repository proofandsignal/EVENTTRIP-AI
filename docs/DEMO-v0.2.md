# EventTrip AI — Interactive Test Demo v0.2

Status: **LOCAL FUNCTIONAL DEMO / SYNTHETIC FIXTURES ONLY** (2026-10-23).

The portable demo is at [demo/EventTrip_AI_Test_Demo_v0.2.html](../demo/EventTrip_AI_Test_Demo_v0.2.html). Download that HTML file and open it in a current desktop/mobile browser; it requires **no server, credentials, API tokens, or JavaScript dependencies**. It is intentionally self-contained so the development branch can be reviewed before any domain or production deployment.

## Walkthrough

1. Choose destination Vienna, departure 2026-12-05, **3 nights**, **2 travelers**.
2. Select Budget, then "View full trip cost" for the Vienna winter city break.
3. Expect **€556** illustrative total: return travel €184 + hotel €252 + experience €50 + baggage €36 + transfers €34. Per traveler €278.
4. Change destination to London and category to Events. One example appears; it is not a real confirmed concert or live ticket offer.
5. Inspect the disabled booking button and partner status. No public partner URL, analytics or payments are activated.

**The departure date is a planning input only.** The sample prices are not date-sensitive, not indicative current supplier quotes, and not travel advice. For two travelers a single hotel room is modeled. Totals omit taxes and supplier fees that cannot be verified in this offline fixture. Real search, room occupancy rules, live availability, cancellation terms, fee completeness and FX conversion are out of scope.

## Verification

- Chromium local offline DOM exercise through exact file content (setContent; direct file URL navigation blocked by browser sandbox): desktop 1440px and mobile 390px.
- Test paths: initial fixture count, segment/category filtering, destination filtering, traveler/night recomputation, five-component breakdown, empty results, reset action, link/checkout blocking, JS page errors and viewport overflow.
- Automated repo tests: npm run check (Node 20+, includes tests/demo-v02.test.js).

## Release and monetization gates

**DO NOT MERGE OR DEPLOY** based on this demo alone. Existing PR #1 remains Draft. Partner registration and approval, permitted links/widgets, attribution test, accessibility/legal/privacy review, hosted E2E verification and explicit approval are still required.

Registration may be performed in parallel with development; the demo is not dependent on the speed of outreach. Results of the demo are not verified paid bookings or earned commissions.

DEMO VERIFIED → APPROVED PROGRAM → VERIFIED ALLOWED LINK → ATTRIBUTION PASS → RELEASE REVIEW → HUMAN APPROVAL → EARLY LAUNCH
