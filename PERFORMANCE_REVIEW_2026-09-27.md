# Product performance review — September 27, 2026

Changes were deployed only to unpublished theme `193699217783` (`Performance_Test_Nook&Stitch_Custom`) on `hya410-ws.myshopify.com`. Live theme `193214415223` was not edited or published. Pumper and UpCart remain enabled.

## Changes

- Added the actual US ankle handle, `orthopedicsocks`, to the product optimization condition. The previous condition covered the crew product and the separate sneaker copy. The US ankle page now defers jQuery and omits the unused legacy lazy-loading library, its plugins, and stylesheet.
- Loaded seven cart interior stylesheets asynchronously on product pages, with no-JavaScript fallbacks and synchronous loading in the theme editor. The cart shell and product price styling remain synchronous.
- Load the theme quantity-discount stylesheet only when its quantity-discount block is rendered. These two product templates use Pumper instead.
- Load the native cart recommendation script only when a recommendation collection is configured. This is separate from the gift-wrap toggle setting. UpCart recommendations are unaffected.
- Keep the native recommendation source container hidden from the start. Testing exposed a layout shift when asynchronous CSS briefly allowed this container into the page flow; the explicit `hidden` attribute fixes it.
- Pause the product's scrolling photo strip outside the viewport, preserve hover pause, respect reduced motion, and disconnect its observer when removed. Images retain responsive sizes and native lazy loading.
- Corrected a malformed selected-color element ID in both product section implementations. Selecting white on the crew product now updates the label without the previous null-element JavaScript error.

## Mobile measurements

Lighthouse 13.5.0, default mobile simulation and throttling, unpublished preview, `country=US`, `pb=0`. These are lab runs from this computer, not measurements from US visitors. Preview redirects and apps contribute overhead. Before and final runs were captured on the same date; the final crew run was captured later in the day.

| Page | Stage | Score | FCP | LCP | Blocking time | Layout shift |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| US ankle | Before | 53 | 2.47 s | 3.68 s | 2,013 ms | 0.0002 |
| US ankle | Final | 60 | 2.60 s | 2.80 s | 2,120 ms | 0.0007 |
| Crew | Before | 55 | 2.91 s | 3.66 s | 1,663 ms | 0.0002 |
| Crew | Final | 65 | 1.97 s | 2.10 s | 2,199 ms | 0.0015 |

Intermediate ankle runs returned LCP 2.6–2.8 s. An intermediate crew run returned 3.4 s. Final results show earlier main-content rendering, but blocking time did not improve consistently. They do not establish a reliable two-second load time or improved real-user responsiveness.

The first asynchronous-style experiment produced ankle CLS 0.092. The source was the recommendation container; after fixing its visibility, final CLS fell to 0.0007. Render-blocking resources reported in the initial comparisons fell from 17 to 7 on ankle and from 15 to 8 on crew. Overall transfer sizes remain around 3.4 MB and 2.8 MB respectively and vary with app and tracking requests.

Raw reports and browser artifacts are saved outside the repository at `F:\Work\Ahmed_Work\Website\Themes\Performance_Reports`. Final reports: `astra-final-ankle-20260927.json` and `astra-final-crew-20260927.json`. Some Lighthouse commands encountered a Windows temporary-profile cleanup error after producing complete reports; both final report `runtimeError` values are null.

## Functional validation

- Confirmed the browser was using theme `193699217783` and USD.
- Checked product image switching, ankle size selection, and crew color selection. The first active image remains eager and high priority.
- Ankle: six black/M paid pairs plus a separately selected white/S gift produced seven pairs at $79.97. Increasing the paid line to seven in the drawer produced $93.30.
- Crew: six white paid pairs plus a black crew gift produced seven pairs at $89.97. The gift stayed within the crew product.
- Checked drawer discounts, free-shipping message, and checkout link. No order or payment was submitted. Test carts were cleared.
- Verified the photo strip runs while visible, pauses offscreen, and pauses with reduced motion. Inspected mobile ankle and desktop crew screenshots.
- Shopify Theme Check introduced no new errors compared with the prior full report. Existing repository errors remain. `git diff --check` passes. The separate skill validator could not run because its bundled `@shopify/theme-check-common` dependency is missing; Shopify CLI Theme Check was used instead.
- The crew color-switch exception was fixed and retested. Remaining observed console failures came from Pumper analytics, Shop iframe restrictions, and the missing favicon request.

## Next priorities

The largest remaining work is app and tracking execution: Pumper, UpCart, Shopify checkout components, and pixels. Audit duplicate or unnecessary integrations and measure controlled changes in this unpublished theme. Any replacement of bundle or cart apps must preserve tier pricing, separate pair variants, same-product gifts, cart recalculation, and checkout discounts before an app is removed.

There is also inconsistent shipping copy on the crew page: its product benefit says $30 while the banner and drawer say $25. Confirm the US shipping rule before correcting the copy.

Implementation follows Shopify's [critical CSS guidance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/load-critical-css-synchronously) and [LCP image guidance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/never-lazy-load-lcp-image).
