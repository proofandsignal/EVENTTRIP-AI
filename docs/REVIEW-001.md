# BUILD-001 — Source and UI acceptance review

Date: 2026-10-18 · Scope: PR #1 only · Author: AI-assisted code review

## Findings addressed on the feature branch

1. **Incorrectly plausible totals (fixed):** manual calculator counted omitted categories as zero without naming omissions. It now reports partial vs estimated total, identifies missing components, and asks for explicit zero where relevant.
2. **Invalid input fallback (fixed):** zero/out-of-range travelers or nights formerly defaulted to 1; now fail closed, displaying no numeric total.
3. **Referral URL safety (hardened):** candidate partner URL guard additionally rejects expired quotes, embedded URL credentials, unusual ports and invalid quote-age settings. The guard remains a testable *precondition*, not an approved partner integration.
4. **Unverified domain claim (fixed):** the wordmark no longer implies ownership of eventtrip.ai.

## Code review checks

- Editorial fixtures do not contain affiliate URLs, live prices or fabricated inventory.
- Dynamic text is attached using textContent rather than unsanitized HTML.
- Filters contain Budget, Luxury and Events and accessible pressed state.
- Form fields have labels, responsive CSS breakpoints exist.
- No secrets, production payment flows, API calls or analytics scripts in current UI.
- Automated tests now exercise input validation, partner gate behavior and static HTML/JS element contracts.

## Not yet verified

- **Real browser** desktop/mobile screenshot and click-through smoke; source/static tests are not equivalent to actual visual, screen-reader or keyboard testing.
- Partner registration/approvals, live data rights, accurate quotes and permitted attribution.
- Privacy/legal disclosures and release suitability.
- Deployment security and post-deploy smoke; public serving is disabled.

## Gate

Do not merge based solely on source review or green CI. Request independent desktop/mobile review before release approval. The public launch goal remains 2026-11-05, conditional on partner and compliance gates. This review is not a production security sign-off.
