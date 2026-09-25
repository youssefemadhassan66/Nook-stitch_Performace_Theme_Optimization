# US mobile performance audit — September 25, 2026

Target: unpublished Shopify theme `Performance_Test_Nook&Stitch_Custom` (`193699217783`). No live-theme settings or files were changed for this audit.

Local Lighthouse 13.5.0 runs used mobile throttling on `nookandstitch.com` with `country=US` and the unpublished preview parameter. Values below are individual lab runs, not real-user 75th-percentile data. The preview URL added one redirect of about 225–247 ms to every run. Scores and blocking time vary between runs, especially when apps load.

| Page | Score | FCP | LCP | Total Blocking Time | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| Home | 61 | 2.95 s | 4.11 s | 564 ms | 2.90 MB |
| US ankle socks (`/products/orthopedicsocks`) | 51 | 2.90 s | 4.11 s | 2,099 ms | 3.26 MB |
| Crew socks | 54 | 2.99 s | 3.83 s | 1,637 ms | 2.70 MB |
| All products collection | 63 | 2.76 s | 4.56 s | 550 ms | 2.08 MB |
| About | 69 | 2.82 s | 3.95 s | 524 ms | 2.02 MB |
| Contact | 74 | 2.69 s | 3.35 s | 519 ms | 1.96 MB |
| Track My Order | 67 | 2.95 s | 3.55 s | 740 ms | 1.99 MB |

The first US ankle run was an unstable 21.37 s LCP with no LCP breakdown; the table uses the repeat run. The GBP sneaker URL `/products/orthopedic-sneaker-socks-copy-1` returns 404 with `country=US`; the US storefront header points to `/products/orthopedicsocks` instead.

## Findings and next steps

1. **Optimize the actual US ankle product.** The earlier theme condition covers crew and the GBP sneaker copy, but not `/products/orthopedicsocks`. Its rendered page still loads legacy lazysizes scripts and parser-blocking jQuery despite having no `lazyload` image markup. Extend the conditional to the US handle, then test bundle selection, the cart, and the page again.
2. **Replace heavyweight purchase apps only after native behavior is ready.** Both product pages transfer about 444 KB for Pumper's main script and 147 KB for UpCart's main script. The app embeds are enabled in `config/settings_data.json`. Lighthouse estimates about 437–459 KB of unused JavaScript on the US product pages and records 1.6–2.1 s of Total Blocking Time. Preserve the six-pair gift, price tiers, checkout discount, shipping progress, and cart controls in a tested unpublished theme before disabling either app. Theme JavaScript alone cannot enforce checkout discounts.
3. **Reduce homepage image payloads.** Lighthouse estimates 421 KB of avoidable image transfer on the homepage; four below-fold sock-reel PNGs account for roughly 268 KB of that estimate. Export photographic assets in a more compact format and keep responsive sizing. The hero code also upgrades all inactive slide images to eager after `window.load`, so later slides compete for bandwidth immediately.
4. **Tighten first-screen CSS and the collection hero.** Product Lighthouse runs flag around 610 ms of render-blocking resource opportunity, including Pumper CSS. The collection hero falls back to a static 120 KB PNG without responsive `srcset`; a Shopify image-file rendition would allow mobile sizing. Defer only styles that are not needed for the first viewport, then check for layout shift or an unstyled flash.
5. **Review third-party marketing scripts.** The Meta/Facebook requests transfer about 193 KB on the product page and account for most of the 213 KB cache-lifetime opportunity. Clarity and Klaviyo also add work. Their cache headers are controlled by those services; evaluate business value and loading timing rather than trying to change them through the theme.

The 2-second LCP goal is not yet met. The largest remaining product bottleneck is main-thread work from apps and third-party scripts, followed by page-specific media and CSS. After each change, repeat mobile lab runs and compare US mobile real-user data in Shopify's Web Performance Dashboard once the improved theme is published.

References: [Shopify theme performance practices](https://shopify.dev/docs/storefronts/themes/best-practices/performance), [deferring non-critical resources](https://shopify.dev/docs/storefronts/themes/best-practices/performance/defer-non-critical-resources), and [testing lab versus field performance](https://shopify.dev/docs/storefronts/themes/best-practices/performance/testing-for-performance).
