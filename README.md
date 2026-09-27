# Nook-stitch_Performace_Theme_Optimization

Shopify theme source for the unpublished performance test theme (`Performance_Test_Nook&Stitch_Custom`, theme ID `193699217783`). The live `Nook&Stitch_CustomTheme_Live` theme is not changed by commits to this repository.

## Current focus

Improve the product pages first, with US storefront performance as the priority. Recent changes give the first product image high loading priority and request smaller, responsive gallery thumbnails, feature icons, and scrolling photos. Shopify's image CDN chooses optimized delivery formats. Original store media remains unchanged; the performance theme now requests compressed delivery variants for lower-page photos.

On September 24, 2026, the crew and sneaker product pages received another focused pass:

- Omitted the legacy `lazysizes` script, its two plugins, and its stylesheet on these two pages. Their rendered HTML contains no images that use this loader.
- Deferred jQuery on these two pages and replaced the review-link interaction with native JavaScript. The bundle selector and cart drawer still render and open in the unpublished preview.
- Requested 120-pixel images for the 50-pixel sticky add-to-cart thumbnails instead of the original full-size images. For the crew thumbnail, the Shopify CDN returned about 4 KB instead of 194 KB when WebP was requested.
- Kept the initial gallery image eager and high-priority, with responsive thumbnails and small feature icons from the earlier pass.

One local mobile Lighthouse rerun after these changes measured **crew: 2.91 s FCP, 3.97 s LCP, 2.83 MB transfer** and **sneaker: 2.98 s FCP, 3.88 s LCP, 3.51 MB transfer**. The tests were individual runs and varied substantially; another crew run returned a 19.6 s LCP outlier. These results do not establish a reliable speed gain, and the 2-second goal remains open. The live [PageSpeed report](https://pagespeed.web.dev/analysis/https-nookandstitch-com-products-orthopedic-crew-socks/1nbj8c52t8?form_factor=mobile) returned `NO_LCP`, so its LCP and Total Blocking Time values are not valid comparisons.

The remaining large costs include Pumper, UpCart, and third-party tracking scripts. Their cache lifetimes and script payloads cannot be changed through this theme; replacing an app requires preserving its purchase flow first.

## About, Contact, and Track My Order

The September 24, 2026 content-page pass covers both public About URLs (`/pages/aboutus` and `/pages/about-us`), `/pages/contact`, and `/pages/trackmyorder` on the unpublished theme. These pages no longer request the unused legacy lazysizes library and its styles/plugins; jQuery loads without blocking HTML parsing. The About hero now offers smaller mobile image widths and requests high fetch priority. The first-screen About image, Contact heading, and tracking heading stay visible during their entrance motion. Contact's duplicate Dawn reveal classes were removed so they do not delay its heading or form. Track123 remains the tracking form provider.

Single local mobile Lighthouse runs on the unpublished preview returned these LCP values (before → after): About **5.76 → 5.07 s**, Contact **6.70 → 4.13 s**, and Track My Order **5.89 → 3.57 s**. These are preliminary, variable runs; the scores and Total Blocking Time did not consistently improve. The 2-second target remains open, and app scripts are still a significant cost. The contact form and Track123 fields rendered in browser checks without console errors.

## September 27 product review

The actual US ankle handle (`orthopedicsocks`) now receives the asset optimizations that previously covered the crew product and sneaker copy. Cart interior styles no longer block the initial product display; unused theme quantity-discount styles and unconfigured native recommendation scripts are omitted. The product photo strip pauses offscreen, a recommendation-container layout shift is fixed, and the crew color-selector label error is corrected.

Final mobile preview runs measured ankle LCP **2.80 s** (before **3.68 s**) and crew LCP **2.10 s** (before **3.66 s**), with near-zero layout shift. Results vary, and blocking time did not consistently improve; the two-second goal remains open. Bundle and same-product gift behavior passed browser checks. See [the full review](PERFORMANCE_REVIEW_2026-09-27.md) for measurements, validation, and remaining work.

## Workflow

An individual app audit ran 24 mobile Lighthouse comparisons on September 27 using browser-only request blocking. Median blocking time fell roughly 58–61% with Pumper blocked and 50–55% with external tracking blocked; UpCart's effect was smaller and varied by product. No app or theme settings were changed. See [the app cost audit](APP_COST_AUDIT_2026-09-27.md) for attribution, raw metrics, and important paint-measurement limitations.

The September 27 image compression pass requests quality 75 for scrolling gallery photos and quality 80 for product benefit photos. Eleven representative photo downloads fell from 528,660 to 319,010 bytes (39.7%) at unchanged dimensions. Both product pages retain eager, high-priority, responsive main images. See [the compression measurements](IMAGE_COMPRESSION_2026-09-27.md).

Edit and validate locally, push to the unpublished Shopify theme for preview, then measure the product pages. Git commits here track the source changes; `git push` does not publish the theme to customers or update the live theme.
