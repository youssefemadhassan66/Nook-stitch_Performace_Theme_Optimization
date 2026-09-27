# Individual app cost audit — September 27, 2026

Measured the unpublished performance theme `Performance_Test_Nook&Stitch_Custom` (193699217783), after the photo compression pass. No theme files, app embeds, pixels, or store settings were changed for these experiments. Live theme 193214415223 remains untouched.

## Method

Lighthouse 13.5.0, mobile simulation, 150 ms RTT, 1,638.4 Kbps simulated throughput, and 4× CPU slowdown. Three cold-browser runs per condition on each product: **24 valid reports**. Conditions were rotated between rounds, with runs performed sequentially. Both requested URLs included `country=US`, `preview_theme_id=193699217783`, and `pb=0`. A real browser confirmed the unpublished theme and USD before testing.

Requests were blocked only inside the measurement browser, using Lighthouse's `blockedUrlPatterns`. This follows Shopify's [third-party script audit method](https://shopify.dev/docs/storefronts/themes/best-practices/performance/audit-remove-third-party-scripts). The normal preview remained functional throughout.

Blocking patterns:

- Pumper: `*profit-pumper-bundles*`, `*pumper.run/*`.
- UpCart: `*upcart-*`, `*upcart-public/*`, `*upcart=1*`.
- External tracking: `*connect.facebook.net/*`, `*www.facebook.com/tr/*`, `*clarity.ms/*`, `*c.bing.com/*`, `*klaviyo.com/*`, `*pixel.wetracked.io/*`, `*trueprofit.io/*`.

Pumper and UpCart exclusions were verified: their identified requests transferred zero bytes in all three blocked runs on both products. Other apps remained available in each individual experiment.

The tracking experiment blocks identified external page assets. Shopify's pixel manager, app-pixel workers, consent machinery, and core analytics remain enabled. Some Clarity/TrueProfit worker requests bypass page-level blocking; residual direct tracking traffic was approximately 1–3 KB per blocked run. This is a scoped experiment, not complete removal of all tracking or a forecast of disabling every app pixel.

## Median results

Blocking time is Lighthouse Total Blocking Time (TBT): long main-thread tasks that delay responsiveness. It is not total page load time or a measured real-user INP.

| Product | Test condition | Blocking time | Change from baseline | Transfer | Requests |
| --- | --- | ---: | ---: | ---: | ---: |
| Ankle | Normal | 2,079 ms | — | 3.170 MB | 302 |
| Ankle | Pumper blocked | 814 ms | −61% | 2.693 MB | 296 |
| Ankle | UpCart blocked | 2,080 ms | Approximately unchanged | 3.015 MB | 303 |
| Ankle | External tracking blocked | 938 ms | −55% | 2.793 MB | 255 |
| Crew | Normal | 1,966 ms | — | 2.778 MB | 287 |
| Crew | Pumper blocked | 833 ms | −58% | 2.328 MB | 287 |
| Crew | UpCart blocked | 1,634 ms | −17% | 2.633 MB | 293 |
| Crew | External tracking blocked | 975 ms | −50% | 2.401 MB | 240 |

MB uses decimal bytes. Median transfer differences include indirect request changes and normal measurement variation; they are not solely an app's script size. These are independent experiments with overlapping effects, so savings must not be added together.

The timing ranges are substantial. Baseline ankle TBT ranged 1,327–2,172 ms; Pumper-blocked ankle TBT ranged 763–2,294 ms. Baseline crew TBT ranged 1,222–2,579 ms; Pumper-blocked crew ranged 822–941 ms. Tracking-blocked TBT ranged 926–1,345 ms on ankle and 836–1,145 ms on crew. The strongest repeatable signal is the crew Pumper reduction; tracking also has consistently lower TBT than its baseline median. UpCart's timing benefit is less consistent across the two pages.

## Identified provider costs with all apps enabled

Median transfer and script parse/evaluation time attributed to identified provider URLs. Script times below are Lighthouse's mobile-scaled values (4× the observed main-thread times). Its Bootup Time audit omits URL entries with less than 50 ms total scaled work, so these are partial attribution totals. They do not include every shared bootstrap, pixel-worker, or downstream layout cost. A zero/absent attribution is not proof of zero overhead.

| Provider | Ankle transfer | Crew transfer | Ankle script work | Crew script work |
| --- | ---: | ---: | ---: | ---: |
| Pumper | 463 KB | 463 KB | 1,194 ms | 1,086 ms |
| UpCart | 172 KB | 172 KB | 228 ms | 237 ms |
| Meta | 198 KB | 198 KB | 556 ms | 639 ms |
| Clarity | 31 KB | 31 KB | 452 ms | 472 ms |
| Klaviyo | 73 KB | 73 KB | 52 ms | 122 ms |
| WeTracked | 7 KB | 7 KB | 39 ms | 41 ms |
| TrueProfit | 1 KB | 1 KB | No direct entry above threshold | No direct entry above threshold |
| Shieldify | 18 KB | 18 KB | 612 ms | 467 ms |

Identified external tracking downloads total about **309 KB** on each page. Tracking providers were measured as one blocked group; the provider table separately attributes their observed downloads and script work. It does not claim a causal TBT saving for each individual tracking provider.

Shopify pixel infrastructure URLs additionally accounted for about 179 KB and 2,052/1,786 ms attributed script work on ankle/crew. This group includes the first-party pixel manager and pixel wrappers; some work belongs to installed integrations. It must not be treated as entirely optional or added to each provider's independent saving.

Clarity has both an enabled theme embed and a Shopify app pixel. Both `/tag/<project>` and `/tag/shopify/<project>` requests were observed. Public app-pixel source identified Clarity's worker (3574890871) and Klaviyo's worker (3707732343). Two loading paths alone do not prove duplicate event reporting; the integration needs inspection before cleanup.

## Paint measurements and limitations

| Product | Condition | Median score | Median FCP | Median LCP |
| --- | --- | ---: | ---: | ---: |
| Ankle | Normal | 60 | 2.75 s | 2.90 s |
| Ankle | Pumper blocked | 44 | 2.67 s | 17.57 s |
| Ankle | UpCart blocked | 60 | 2.65 s | 2.95 s |
| Ankle | External tracking blocked | 67 | 2.67 s | 2.92 s |
| Crew | Normal | 59 | 2.74 s | 3.04 s |
| Crew | Pumper blocked | 69 | 2.60 s | 3.06 s |
| Crew | UpCart blocked | 64 | 2.64 s | 2.94 s |
| Crew | External tracking blocked | 67 | 2.80 s | 2.98 s |

LCP requires caution: many reports identified the animated shipping-banner text instead of the main product photo. Two ankle runs with Pumper blocked recorded late LCP values around 17–18 seconds and could not identify an LCP element in the breakdown audit. Their final screenshots still showed the main product photo and title. These paint results cannot reliably establish how quickly the product image becomes visible or rank apps by perceived product loading speed. The late LCP values are retained in the raw data rather than silently discarded. The two-second product-rendering goal remains open.

These are local lab measurements, not US visitor data. Request blocking removes an app's scripts and downstream behavior, and can change the DOM or dependency graph. An actual embed removal or a replacement implementation may produce different results. No orders were placed. Some Lighthouse processes reported the known Windows temporary-profile cleanup error after saving complete reports; all 24 reports have no runtimeError and valid performance metrics.

## Recommended next steps

1. Inspect tracking installation paths and business purpose. Review Clarity's embed/pixel combination and the two Klaviyo loader requests, then verify event behavior before calling them duplicates. Preserve required consent and purchase attribution.
2. Prioritize a validated custom bundle replacement if removing Pumper. Preserve separate pair color/size choices, same-product gifts, tier pricing, cart quantity changes, and Shopify-enforced checkout discounts.
3. Run a focused Shieldify exclusion test. Its script work is large relative to its payload, but its protection function must be understood before changing settings.
4. Treat UpCart replacement as a smaller performance priority. It removes approximately 172 KB; this audit found no median ankle TBT improvement and a modest crew improvement.
5. Measure product-image paint/readiness directly alongside Lighthouse, since the animated announcement bar makes LCP attribution inconsistent. Follow up with real-user Core Web Vitals after deployment.

## Saved evidence

All 24 per-run metric rows are committed in [APP_COST_RESULTS_2026-09-27.csv](APP_COST_RESULTS_2026-09-27.csv). Full Lighthouse JSON, configs, launcher logs, selected screenshots, the audit runner, and `summary.json` are saved outside the theme repository at `../Performance_Reports/app-costs/`.
