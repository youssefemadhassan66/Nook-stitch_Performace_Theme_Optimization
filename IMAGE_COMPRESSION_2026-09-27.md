# Product photo compression — September 27, 2026

Applied to unpublished `Performance_Test_Nook&Stitch_Custom` (193699217783). Live `Nook&Stitch_CustomTheme_Live` (193214415223) and its Pumper integration remain untouched. Original Shopify media files are unchanged.

## Delivery changes

- Scrolling photo gallery: quality 75, existing responsive widths and lazy loading retained, both repeated animation tracks covered.
- Product benefit photos: quality 80, existing responsive widths retained, explicit lazy loading added (the crew section previously relied on Shopify's loading default). Non-product pages retain the default format, quality, and loading policy.
- Explicit JPG conversion permits quality control for PNG source photos. Shopify can still negotiate WebP or AVIF for compatible browsers. These sections contain opaque photography; this conversion is unsuitable for transparency-dependent artwork.
- Main product media receives no compression change and remains eager, high-priority, and responsive.

Shopify reference: https://shopify.dev/docs/api/liquid/filters/image_url

## Download comparison

Same source version, dimensions, and Accept header before and after. Gallery tested at 560 pixels wide; benefit photos at 360 pixels wide. Responses were WebP. Values are response body bytes, excluding headers.

| Photo | Width | Before bytes | After bytes | Reduction |
| --- | ---: | ---: | ---: | ---: |
| Untitled_design_-_2025-12-10T122010.970.png | 560 | 80,278 | 50,310 | 37.3% |
| Untitled_design_-_2026-04-18T225151.675.png | 560 | 81,080 | 50,154 | 38.1% |
| Untitled_design_-_2026-04-18T215243.207.png | 560 | 73,106 | 43,668 | 40.3% |
| Untitled_design_-_2026-04-18T214656.452.png | 560 | 48,158 | 27,500 | 42.9% |
| Untitled_design_-_2025-12-12T101707.023.png | 560 | 59,466 | 32,086 | 46.0% |
| Gemini_Generated_Image_nl8m3jnl8m3jnl8m.png | 560 | 42,462 | 22,476 | 47.1% |
| Right_banner.jpg | 360 | 23,636 | 13,792 | 41.6% |
| 896411db-2189-46e1-8bae-077f3712a007.jpg | 360 | 29,026 | 18,992 | 34.6% |
| 6b5a12b8-7045-4eea-bfb6-49fb57f7080d.jpg | 360 | 39,024 | 26,292 | 32.6% |
| Gemini_Generated_Image_d341x4d341x4d341.png | 360 | 21,232 | 12,572 | 40.8% |
| Untitled_design_-_2026-05-09T025339.794.png | 360 | 31,192 | 21,168 | 32.1% |
| **Total** | | **528,660** | **319,010** | **39.7%** |

This combines eleven unique photos across the two products; it is not a whole-page transfer reduction or a measured 40% load-time improvement. Actual downloads depend on viewport, pixel density, scroll depth, and CDN negotiation. These lower-page images are lazy-loaded, so the change primarily reduces scrolling bandwidth. No new Lighthouse speed claim is made for this pass.

## Validation

- Inspected representative before/after photos for visible detail loss at delivery dimensions.
- Confirmed the unpublished preview applies quality to every responsive candidate, not only the fallback source.
- Mobile scroll checks confirm all compressed photos load on ankle and crew product pages; desktop checks cover both pages.
- Both first product images remain `loading="eager"`, `fetchpriority="high"`, with responsive candidates.
- Corrected Shopify's PNG quality restriction by explicitly requesting JPG conversion; final previews contain no Liquid errors.
- Theme Check compared against the previous baseline; existing findings remain, with no new findings introduced. The skill validator is unavailable because its bundled `@shopify/theme-check-common` dependency is missing; CLI Theme Check and actual Shopify rendering were used instead.

Raw benchmarks, downloaded samples, browser screenshots, and Theme Check output are stored outside the repository in `../Performance_Reports/image-compression` and `../Performance_Reports/compression-theme-check-final.json`.

## Remaining performance work

1. Measure the cost of each app and tracker in a controlled unpublished-theme test. Change one integration at a time and restore it after measuring; never disable the live store's bundle/cart functionality.
2. Remove confirmed duplicate tracking and unnecessary app embeds. Preserve required consent and purchase reporting; verify purchase event delivery before adopting changes.
3. Load optional zoom, reviews, and recommendations when needed. Keep product selectors, pricing, Add to cart, and checkout available immediately.
4. If replacing Pumper or UpCart, complete and validate bundle discounts, gift eligibility, cart quantity changes, and checkout totals before removing their integrations. Displayed theme prices alone do not enforce Shopify discounts.
5. Compare three mobile Lighthouse runs per product under the same conditions and use the median. Validate cart and checkout behavior after each app change. The two-second target remains open; third-party JavaScript remains the larger outstanding cost.
