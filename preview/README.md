# EventTrip AI — Premium Interactive Client Preview

**Public static demo only; no real bookings or financial offers.**

Target hosted URL: https://trendsolutions-eventtrip-preview.onrender.com/ (provider); custom TrendSolutions domain is not configured.

## Premium refresh, 2026-11-05
- Replaced sparse demo grid with premium dark editorial design and cinematic destination photography sourced via Unsplash.
- Interactive collection: 15 synthetic trips covering Budget, Luxury, Events, Winter and Coast filters plus saved favorites.
- User-controlled destination, date, nights and 1–4 travelers. Room assumptions are 2 persons per room (ceil).
- Journey Explorer: itinerary by day, transparent five-component estimate, optional baggage/transfers, no real bookings.
- Compare up to 3 trips; cheapest *synthetic* total never claimed a verified deal.
- Responsive layout, keyboardable controls and modal dismissal. Dedicated EventTrip brand and About section.
- **Privacy:** no accounts, forms, tracking, cookies or backend API calls. External requests are limited to optional destination photographs hosted by images.unsplash.com. No referrer is transmitted by image elements; if photos fail, visual backgrounds remain.

## Local QA
Chromium (system installed) via Playwright static DOM and click-through:
- Desktop 1440×900: 14 base checks + 12 advanced = 26 PASS.
- Mobile 390×844: 14 base checks + 11 advanced = 25 PASS.
- **51/51 total PASS**, including synthetic €556 Vienna total (2 travelers × 3 nights) and €1,078 (4 travelers × 3 nights, 2 rooms), cost toggles, comparison cap, saved filtering, mobile viewport and blocked booking.
- Node JavaScript syntax check PASS. External photo retrieval could not be verified in the local sandbox; photographs may depend on the viewer network. Hosted browser QA and third-party image licensing/content are separately reviewable.

## Release protections
- Source: isolated `preview/eventtrip-trendsolutions-static` branch; `main` remains unchanged; Draft PR #1 remains open and unmerged.
- Render auto-deploy OFF. Changes must be explicitly manually deployed; do not conflate source commit with a delivered URL.
- No real affiliate destinations are linked; no permission, attribution, purchases or revenue are claimed.
- `robots.txt` and `noindex` are discovery hints, not authentication. Preview URL is PUBLIC.
- Render site build plan previously configured as starter; no plan changes authorized.

`SYNTHETIC PREMIUM PREVIEW → MANUAL DEPLOY → VERIFIED HTTPS → CUSTOMER QA → APPROVED AFFILIATE LINK → ATTRIBUTION`
