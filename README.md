# Nook-stitch_Performace_Theme_Optimization

Shopify theme source for the unpublished performance test theme (`Performance_Test_Nook&Stitch_Custom`, theme ID `193699217783`). The live `Nook&Stitch_CustomTheme_Live` theme is not changed by commits to this repository.

## Current focus

Improve the product pages first, with US storefront performance as the priority. Recent changes give the first product image high loading priority and request smaller, responsive gallery thumbnails, feature icons, and scrolling photos. Shopify's image CDN chooses optimized delivery formats. Original store media has not been replaced or recompressed.

On September 24, 2026, the crew and sneaker product pages received another focused pass:

- Omitted the legacy `lazysizes` script, its two plugins, and its stylesheet on these two pages. Their rendered HTML contains no images that use this loader.
- Deferred jQuery on these two pages and replaced the review-link interaction with native JavaScript. The bundle selector and cart drawer still render and open in the unpublished preview.
- Requested 120-pixel images for the 50-pixel sticky add-to-cart thumbnails instead of the original full-size images. For the crew thumbnail, the Shopify CDN returned about 4 KB instead of 194 KB when WebP was requested.
- Kept the initial gallery image eager and high-priority, with responsive thumbnails and small feature icons from the earlier pass.

One local mobile Lighthouse rerun after these changes measured **crew: 2.91 s FCP, 3.97 s LCP, 2.83 MB transfer** and **sneaker: 2.98 s FCP, 3.88 s LCP, 3.51 MB transfer**. The tests were individual runs and varied substantially; another crew run returned a 19.6 s LCP outlier. These results do not establish a reliable speed gain, and the 2-second goal remains open. The live [PageSpeed report](https://pagespeed.web.dev/analysis/https-nookandstitch-com-products-orthopedic-crew-socks/1nbj8c52t8?form_factor=mobile) returned `NO_LCP`, so its LCP and Total Blocking Time values are not valid comparisons.

The remaining large costs include Pumper, UpCart, and third-party tracking scripts. Their cache lifetimes and script payloads cannot be changed through this theme; replacing an app requires preserving its purchase flow first.

## Workflow

Edit and validate locally, push to the unpublished Shopify theme for preview, then measure the product pages. Git commits here track the source changes; `git push` does not publish the theme to customers or update the live theme.
