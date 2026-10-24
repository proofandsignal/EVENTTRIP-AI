# Shared architecture v0.1

One frontend, one future affiliate and search backend, three user-facing segments: Budget, Luxury, Events.

Current modules:
- src/data/trip-ideas.js: editorial research-only catalog; no live inventory or fake prices.
- src/core/search.js: destination, category, keyword filtering.
- src/core/cost.js: user-entered True Trip Cost estimate; hotel per night, events/travel/bags per traveler, transfers per trip.
- src/core/partner-gate.js: a security precondition for future booking links (approved partner domain, verified source, positive quote, currency and recency).
- src/app.js: accessible DOM rendering and UI events. Untrusted strings rendered as textContent.

Future provider adapters (not yet built) should normalize provider ID, source ID, destination, trip dates, component price, currency, tax/fee inclusion, baggage, verified timestamp, expiry, cancellation terms, approval status, attribution method, and booking URL.

Guardrails:
- Do not publish prices or availability without verifiable source and time.
- Do not send visitors to unapproved affiliate links, and do not fabricate commissions or events.
- No scraping contrary to provider terms; only contracted feeds or explicitly allowed access.
- No API secrets in frontend or public GitHub.
- No booking payments; partner handles checkout.
- Consent and privacy review required before analytics, pixels and advertising tracking.
- Regulatory review before bundling travel components as packages or linked arrangements.
- Cloudflare deployment is not configured or authorized.

The partner gate is not by itself a completed integration, analytics solution or compliance review.
