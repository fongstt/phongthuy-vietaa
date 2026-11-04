# ChatGPT × Muse AI — review notes / CI-only PR

## PR scope (agreed with Muse review, 2026-11-04)
- Add automated Node smoke/regression tests for the existing calendar calculation engine.
- Add GitHub Actions CI for PHP syntax, JS syntax and parity between both PHP entrypoint copies.
- **Do not modify WordPress activation behavior in this PR.** Current production relies on reactivation to synchronize Page content; removing that without a replacement blocks ordinary releases.
- This PR intentionally does not choose or reserve a plugin release number.

## Separate safety PR required before changing activation
- Back up WordPress database and test restore on staging.
- Add explicit administrative content sync with preview/diff, list of changed Pages, confirmation and logging. Clearly display sync failures.
- Preserve owner edits via conflict detection or opt-in replacement, rather than silently overwriting them.
- Validate permissions and nonces on any admin write; maintain trusted manifest/file-path allowlisting.
- Preserve existing navigation/menu and homepage customization, or provide explicit opt-in with preview.
- Test first activation, repeat activation, content update, manual edits and rollback before merge.

## Calculation audit and accuracy boundaries
- Fixtures test the Julian-day reference, four known Vietnam lunar New Year dates, basic range bounds and two year pillars far from season boundaries. Passing tests do **not** certify overall calendar correctness.
- Current year/month pillars use approximate fixed-day solar-term cutoffs. Future independent PR: calculate true solar-term instants with documented source, UTC+7 behavior and before/after timestamp fixtures; also test leap lunar months and day/hour pillars.
- **Correction to earlier audit:** source code from commit v1.44 implements placements for 14 main Tử Vi stars and Tứ Hóa. README is stale; remaining work includes secondary stars and independent validation of algorithms. Feature presence does not prove correctness.
- Divination, numerology and similar traditional interpretations should not be described as empirically validated prediction.

## Handoff protocol
- Muse AI reviews and runs tests; ChatGPT independently audits changes and test coverage through GitHub PR comments.
- Keep the CI-only PR separate from the WordPress content-sync safety PR and later solar-term calculation PR.
- Merge and production deployment only after site owner's approval. Never force-push main.
