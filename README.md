# Nook-stitch_Performace_Theme_Optimization

Shopify theme source for the unpublished performance test theme (`Performance_Test_Nook&Stitch_Custom`, theme ID `193699217783`). The live `Nook&Stitch_CustomTheme_Live` theme is not changed by commits to this repository.

## Current focus

Improve the product pages first, with US storefront performance as the priority. Recent changes give the first product image high loading priority and request smaller, responsive gallery thumbnails, feature icons, and scrolling photos. Shopify's image CDN chooses optimized delivery formats. Original store media has not been replaced or recompressed.

A single mobile Lighthouse comparison showed about 216 KB less transfer on the sneaker product page, while Largest Contentful Paint remained around 3.3 seconds. The 2-second goal is still open. Individual Lighthouse runs vary, so repeat measurements before calling a change a speed improvement.

## Workflow

Edit and validate locally, push to the unpublished Shopify theme for preview, then measure the product pages. Git commits here track the source changes; `git push` does not publish the theme to customers or update the live theme.
