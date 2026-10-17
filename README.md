# EventTrip AI

Status: BUILD-001 DRAFT / RESEARCH PREVIEW. No live bookings, no deployment, and no verified revenue.

One shared discovery interface for Budget Travel, Luxury Deals and Events, with a manual True Trip Cost calculator.

## What works

- Search editorial planning ideas by destination, keyword and category.
- Budget, Luxury and Events cards with no invented prices.
- Calculate estimated costs for travelers, hotel nights, travel, event tickets, baggage and transfers.
- Fail-closed partner publication guard (approval + source + quote freshness + price + currency + approved HTTPS host).
- Zero runtime dependencies; automated tests via Node.

## Local preview

With Python 3, run from the repository directory:

    python3 -m http.server 4173

Open http://localhost:4173. On Windows you can use py -m http.server 4173.

## Automated checks

    npm run check

Node 20 or newer is required; no npm install is necessary.

Not implemented: partner approvals, live API integrations, bookable deals, affiliate click tracking, personal analytics, checkout, production deployment or confirmed sales.

Target public MVP is **November 5, 2026**, subject to security, product, legal, partner and monetization release gates. A green CI result does not authorize merge or deployment.

See docs/ARCHITECTURE.md, docs/PARTNER-ACCESS.md and docs/LAUNCH-GATES.md.
