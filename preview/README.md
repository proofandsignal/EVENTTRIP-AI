# EventTrip AI — TrendSolutions subdomain preview

**PREPARED ONLY — NOT DEPLOYED.** The intended temporary public URL is `https://eventtrip.trendsolutions.io/`, after workspace confirmation and domain/DNS checks. EventTrip AI may later move to its own domain.

Host as a static site from this isolated branch: `preview/eventtrip-trendsolutions-static`.
Publish directory: `preview/`; build command: `true`; auto deploy: **no**.

- `preview/index.html`: self-contained, tested v0.3 sample-trip UI, all data synthetic and never real offers.
- `preview/robots.txt`: requests that crawlers do not index.
- The HTML contains a noindex tag, no-referrer, and restrictive meta CSP disabling all network connections and frames.
- Real booking links, external API requests, payments, analytics, cookies and accounts are absent.
- The real affiliate program registry remains empty in the source branch.

Limitations: **noindex and robots.txt are not access controls**; this is public to anyone who receives the URL. Meta CSP is defense in depth but does not replace verified host-level security headers, independent security audit, or hosted browser QA.

Do not use this static branch for affiliate revenue or live booking claims. Render workspace user selection/approval, successful deploy, actual TLS and DNS verification, Android+desktop hosted QA and release approval are mandatory for declaring an online demo delivered. Existing PR #1 remains DRAFT / MERGE LOCKED and production deploy remains locked.
