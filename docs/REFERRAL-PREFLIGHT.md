# BUILD-001 — Referral preflight

Date: 2026-10-24. Status: CODE ONLY / PR DRAFT / MERGE LOCKED / DEPLOY LOCKED.

This module is NOT an affiliate integration, partner approval, attribution test, live offer, or booking system. It only validates a reviewed permission record and link metadata supplied by a future trusted integration.

- Default state: BLOCKED, no booking URL or visible price.
- LINK_READY: validated deeplink only; cannot display an unverified quote or amount.
- PRICED_OFFER_READY: also needs matching verified quote provenance, current price, currency and verified fee status.
- Explicit, exact HTTPS allowed-host checks; no wildcard permissions, script/widget approval or automatically accepted redirects.
- Program and link evidence references are administrative claims, not cryptographic attestations. Verify them independently in the real partner dashboard, through a trusted backend or human review. Browser-provided status is not a valid approval signal.

The public partner permissions registry is intentionally empty. Unit tests use fictional reserved .example hostnames; they do not create real booking clicks or permissions. Run npm run check and npm run referral:dry-run with Node 20+.

Before any real CTA: register an actual Project against a genuinely controlled URL, validate program permissions and partner links, test attribution with official reporting, verify price/cost/fee disclosures, complete hosted UI QA and legal/privacy review, and obtain explicit authorization for merge and deployment.

DEMO READY -> AFFILIATE APPROVAL EVIDENCE -> ALLOWED LINK -> ATTRIBUTION TEST -> RELEASE REVIEW -> EARLY LAUNCH
