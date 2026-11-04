# v1.54 – collaboration checklist for ChatGPT and Muse AI

## Safety contract
- Activating the WordPress plugin must only create missing tool pages; existing titles, content, and SEO metadata belong to the editor.
- The existing front page is never rewritten. Add `[ptv_trang_chu_tools]` manually to the chosen homepage.
- Menu creation is disabled by default. An administrator can temporarily opt into creating the dedicated menu via `add_filter('ptv_provision_menu_on_activation', '__return_true');`; existing menus are never deleted, and already occupied theme menu locations are never replaced.
- Back up and test the database restore path before using any plugin update on production.
- The change removes automatic re-sync of hand-edited pages; design an admin preview/diff and explicit update flow separately.

## Calculation audit
- Calendar regression tests cover a Julian day anchor and selected Vietnamese lunar new-year fixtures; not an exhaustive precision proof.
- In `src/ptv-engine.js`, `yearPillar()` uses an approximate February 4 Lập Xuân threshold and `monthChiIndex()` uses fixed dates. Births close to solar-term boundaries may be misclassified.
- Muse AI: introduce a reliable timezone-aware ephemeris/solar-term algorithm and independently sourced before/after boundary tests before making claims of precise Bát Tự.
- Add independently verified leap-month, day-pillar, hour-pillar, DST/timezone, invalid-date, and supported-year-range tests.
- The project's README states the Tử Vi chart does not yet have a full 14-main-star placement.
- Bói toán, numerology and dream interpretations are cultural/traditional interpretations, not verified predictive science.

## Muse AI handoff
1. Review this branch and draft PR; never force-push main.
2. Run CI and test activation twice on WordPress staging with customized pages, front page and menu.
3. Audit XSS and dynamically generated HTML, input validation and output escaping.
4. Build JS bundles reproducibly from src; diff generated assets against deployed assets.
5. Add precise calendar/tứ trụ tests and fixes in separate PRs with expected/actual fixtures and citations.
6. Only deploy after backup, staging signoff and a tested rollback procedure.
