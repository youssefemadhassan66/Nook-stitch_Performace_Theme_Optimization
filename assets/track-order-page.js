(() => {
  if (window.NookTrackOrderPage?.initialized) {
    window.NookTrackOrderPage.scan?.();
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const trackedElements = new Set();
  let revealObserver;
  let mutationObserver;

  const reveal = (element) => {
    if (!element) return;
    element.classList.add('is-revealed');
    revealObserver?.unobserve(element);
    window.setTimeout(() => {
      element.classList.remove('is-reveal-pending');
      element.classList.remove('is-revealed');
      trackedElements.delete(element);
    }, 900);
  };

  const isInOrAboveViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.92 || rect.bottom < 0;
  };

  const prepareReveal = (element) => {
    if (!element || element.dataset.trackRevealReady === 'true') return;

    element.dataset.trackRevealReady = 'true';

    if (reducedMotion.matches) {
      return;
    }

    element.classList.add('is-reveal-pending');
    trackedElements.add(element);

    if (isInOrAboveViewport(element)) {
      requestAnimationFrame(() => reveal(element));
      return;
    }

    revealObserver.observe(element);
  };

  const prepareTrack123 = (scope = document) => {
    const appRoots = scope.matches?.('.track123-shopify-search-block2')
      ? [scope]
      : Array.from(scope.querySelectorAll?.('.track123-shopify-search-block2') || []);

    if (!appRoots.length) {
      const wrapper = scope.matches?.('.track123-classic-search-wrapper')
        ? scope
        : scope.querySelector?.('.track123-classic-search-wrapper');
      if (wrapper) appRoots.push(wrapper);
    }

    appRoots.forEach((appRoot) => {
      appRoot.dataset.trackOrderApp = 'true';
      appRoot.dataset.trackReveal = '';
      prepareReveal(appRoot);
    });
  };

  const prepareHero = () => {
    const hero = document.querySelector('[data-track-order-intro]');
    if (!hero || hero.dataset.motionReady === 'true') return;

    hero.dataset.motionReady = 'true';

    if (reducedMotion.matches) {
      hero.classList.add('is-visible');
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add('is-visible'));
    });
  };

  const scan = (scope = document) => {
    prepareHero();

    const revealElements = scope.matches?.('[data-track-reveal]')
      ? [scope]
      : Array.from(scope.querySelectorAll?.('[data-track-reveal]') || []);
    revealElements.forEach(prepareReveal);
    prepareTrack123(scope);
  };

  const initialize = () => {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) reveal(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
    );

    scan();

    const main = document.getElementById('MainContent') || document.body;
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        });
      });
    });
    mutationObserver.observe(main, { childList: true, subtree: true });

    let fallbackFrame;
    const revealPassedElements = () => {
      if (fallbackFrame) return;
      fallbackFrame = requestAnimationFrame(() => {
        fallbackFrame = undefined;
        trackedElements.forEach((element) => {
          if (isInOrAboveViewport(element)) reveal(element);
        });
      });
    };

    window.addEventListener('scroll', revealPassedElements, { passive: true });
    window.addEventListener('resize', revealPassedElements, { passive: true });
    document.addEventListener('shopify:section:load', (event) => scan(event.target));
  };

  window.NookTrackOrderPage = {
    initialized: true,
    scan,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
