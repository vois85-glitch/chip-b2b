'use client';

import { useEffect, useCallback } from 'react';

interface EngagementTrackingProps {
  pageType: 'component' | 'brand' | 'hub' | 'homepage' | 'bom' | 'rfq';
  entityId?: string;
  category?: string;
  brand?: string;
}

export default function EngagementTracking({ pageType, entityId, category, brand }: EngagementTrackingProps) {
  const trackEvent = useCallback((eventName: string, data: Record<string, string>) => {
    if (typeof window === 'undefined') return;
    try {
      const events = JSON.parse(sessionStorage.getItem('chipnet_events') || '[]');
      events.push({ event: eventName, ...data, timestamp: new Date().toISOString() });
      if (events.length > 50) events.splice(0, events.length - 50);
      sessionStorage.setItem('chipnet_events', JSON.stringify(events));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Scroll depth tracking
    let maxScroll = 0;
    const scrollMilestones = new Set<number>();
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) maxScroll = scrollPercent;
      [25, 50, 75, 90, 100].forEach((milestone) => {
        if (maxScroll >= milestone && !scrollMilestones.has(milestone)) {
          scrollMilestones.add(milestone);
          trackEvent('scroll_depth', { depth: String(milestone), pageType, entityId: entityId || '' });
          document.body.setAttribute('data-scroll-depth', String(milestone));
        }
      });
    };

    // 2. Time on page tracking
    const startTime = Date.now();
    const timeMilestones = new Set<number>();
    const trackTimeOnPage = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      [10, 30, 60, 120, 300, 600].forEach((seconds) => {
        if (timeSpent >= seconds && !timeMilestones.has(seconds)) {
          timeMilestones.add(seconds);
          trackEvent('time_on_page', { seconds: String(seconds), pageType, entityId: entityId || '' });
          document.body.setAttribute('data-time-on-page', String(seconds));
        }
      });
    };

    // 3. RFQ interaction tracking — Enhanced with conversion funnel
    const trackRfqInteraction = () => {
      const rfqLinks = document.querySelectorAll('a[href*="#bom"], a[href*="/rfq"], a[href*="/bom"], button[data-action="rfq"], a[href*="rfq"]');
      rfqLinks.forEach((link) => {
        link.addEventListener('click', () => {
          trackEvent('rfq_click', { source: pageType, entity: entityId || '', brand: brand || '' });
          document.body.setAttribute('data-rfq-interaction', 'true');
          document.body.setAttribute('data-rfq-source', pageType);
          document.body.setAttribute('data-rfq-entity', entityId || 'unknown');

          // Track RFQ conversion funnel stage
          try {
            const funnel = JSON.parse(sessionStorage.getItem('chipnet_rfq_funnel') || '{}');
            funnel.lastClick = new Date().toISOString();
            funnel.clickCount = (funnel.clickCount || 0) + 1;
            funnel.pageType = pageType;
            funnel.entity = entityId || '';
            funnel.brand = brand || '';
            funnel.category = category || '';
            sessionStorage.setItem('chipnet_rfq_funnel', JSON.stringify(funnel));
          } catch {}
        });
      });
    };

    // 4. Component exploration tracking (alternative clicks)
    const trackAlternativeClicks = () => {
      const altLinks = document.querySelectorAll('a[href*="/component/"], a[href*="/analog/"]');
      altLinks.forEach((link) => {
        link.addEventListener('click', () => {
          const href = link.getAttribute('href') || '';
          const targetSku = href.split('/component/')[1]?.split('/')[0] || href.split('/analog/')[1]?.split('/')[0] || '';
          if (targetSku) {
            trackEvent('alternative_click', {
              from: entityId || '',
              to: targetSku,
              pageType,
              category: category || '',
            });

            // Track procurement journey
            try {
              const journey = JSON.parse(sessionStorage.getItem('chipnet_journey') || '[]');
              journey.push({
                from: entityId || 'entry',
                to: targetSku,
                type: 'alternative',
                timestamp: new Date().toISOString(),
                pageType,
              });
              if (journey.length > 20) journey.splice(0, journey.length - 20);
              sessionStorage.setItem('chipnet_journey', JSON.stringify(journey));
            } catch {}
          }
        });
      });
    };

    // 5. Engineering section engagement
    const trackEngineeringEngagement = () => {
      const engSections = document.querySelectorAll('[data-section="engineering"], [data-section="specs"], [data-section="compatibility"], [data-section="ai-overview"]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const sectionName = entry.target.getAttribute('data-section') || 'unknown';
              trackEvent('engineering_engagement', { section: sectionName, pageType, entityId: entityId || '' });
            }
          });
        },
        { threshold: 0.5 }
      );
      engSections.forEach(s => observer.observe(s));
      return observer;
    };

    // 6. Search interaction tracking
    const trackSearchInteraction = () => {
      const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Поиск"], input[type="text"][placeholder*="search"]');
      searchInputs.forEach(input => {
        input.addEventListener('focus', () => {
          trackEvent('search_focus', { pageType });
        });
      });
    };

    // 7. CTA optimization — track which CTAs are visible
    const trackCtaVisibility = () => {
      const ctas = document.querySelectorAll('a[href*="#bom"], a[href*="/rfq"], [data-cta="rfq"]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trackEvent('cta_visible', { pageType, entityId: entityId || '' });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      ctas.forEach(cta => observer.observe(cta));
      return observer;
    };

    // 8. Internal link rebalance tracking
    const trackInternalLinkClicks = () => {
      const internalLinks = document.querySelectorAll('a[href^="/"]');
      internalLinks.forEach(link => {
        link.addEventListener('click', () => {
          const href = link.getAttribute('href') || '';
          trackEvent('internal_link_click', {
            from: window.location.pathname,
            to: href,
            pageType,
            entityId: entityId || '',
          });
        });
      });
    };

    // 9. NEW: Procurement journey tracking
    const trackProcurementJourney = () => {
      try {
        const journey = JSON.parse(sessionStorage.getItem('chipnet_journey') || '[]');
        journey.push({
          from: document.referrer || 'direct',
          to: window.location.pathname,
          type: 'pageview',
          timestamp: new Date().toISOString(),
          pageType,
          entity: entityId || '',
        });
        if (journey.length > 20) journey.splice(0, journey.length - 20);
        sessionStorage.setItem('chipnet_journey', JSON.stringify(journey));
      } catch {}
    };

    // 10. NEW: AI snippet capture tracking
    const trackAiSnippetEngagement = () => {
      const aiBlocks = document.querySelectorAll('[data-section="ai-overview"]');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              trackEvent('ai_snippet_visible', { pageType, entityId: entityId || '' });
              // Track dwell time on AI block
              const visibleStart = Date.now();
              const trackDwell = () => {
                const dwellTime = Math.round((Date.now() - visibleStart) / 1000);
                if (dwellTime >= 5) {
                  trackEvent('ai_snippet_dwell', { seconds: String(dwellTime), pageType, entityId: entityId || '' });
                }
              };
              setTimeout(trackDwell, 10000);
            }
          });
        },
        { threshold: 0.3 }
      );
      aiBlocks.forEach(block => observer.observe(block));
      return observer;
    };

    // 11. NEW: Branded search tracking
    const trackBrandedSearch = () => {
      try {
        const referrer = document.referrer;
        if (referrer) {
          const searchEngines = ['google.', 'yandex.', 'bing.'];
          const isSearch = searchEngines.some(se => referrer.includes(se));
          if (isSearch) {
            trackEvent('search_arrival', { referrer, pageType, entityId: entityId || '' });
            // Store for branded search analysis
            const searchArrivals = JSON.parse(sessionStorage.getItem('chipnet_search_arrivals') || '[]');
            searchArrivals.push({ referrer, pageType, entity: entityId || '', timestamp: new Date().toISOString() });
            if (searchArrivals.length > 10) searchArrivals.splice(0, searchArrivals.length - 10);
            sessionStorage.setItem('chipnet_search_arrivals', JSON.stringify(searchArrivals));
          }
        }
      } catch {}
    };

    // 12. NEW: Entity-based engagement scoring
    const calculateEngagementScore = () => {
      try {
        const events = JSON.parse(sessionStorage.getItem('chipnet_events') || '[]');
        const rfqFunnel = JSON.parse(sessionStorage.getItem('chipnet_rfq_funnel') || '{}');
        const journey = JSON.parse(sessionStorage.getItem('chipnet_journey') || '[]');

        let score = 0;
        // Base engagement from events
        score += Math.min(events.length * 2, 20);
        // RFQ intent bonus
        if (rfqFunnel.clickCount) score += rfqFunnel.clickCount * 15;
        // Journey depth bonus
        score += Math.min(journey.length * 3, 15);
        // Time bonus
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        if (timeSpent > 60) score += 10;
        if (timeSpent > 300) score += 20;

        document.body.setAttribute('data-engagement-score', String(score));
        document.body.setAttribute('data-engagement-level', score > 60 ? 'high' : score > 30 ? 'medium' : 'low');

        // Store score for analytics
        sessionStorage.setItem('chipnet_engagement_score', JSON.stringify({
          score,
          level: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
          pageType,
          entity: entityId || '',
          timestamp: new Date().toISOString(),
        }));
      } catch {}
    };

    // Setup all trackers
    window.addEventListener('scroll', trackScroll, { passive: true });
    const timeInterval = setInterval(trackTimeOnPage, 1000);

    // Delay link/DOM tracking
    const linkTrackTimeout = setTimeout(() => {
      trackRfqInteraction();
      trackAlternativeClicks();
      trackSearchInteraction();
      trackInternalLinkClicks();
    }, 1000);

    const engObserver = trackEngineeringEngagement();
    const ctaObserver = trackCtaVisibility();
    const aiObserver = trackAiSnippetEngagement();

    // Track initial page view
    trackEvent('page_view', { pageType, entityId: entityId || '', category: category || '', brand: brand || '' });

    // Track procurement journey
    trackProcurementJourney();
    trackBrandedSearch();

    // Calculate engagement score periodically
    const scoreInterval = setInterval(calculateEngagementScore, 15000);
    calculateEngagementScore(); // Initial

    // Store page context for ranking
    const pageContext = {
      pageType,
      entityId: entityId || '',
      category: category || '',
      brand: brand || '',
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
    };
    document.body.setAttribute('data-page-context', JSON.stringify(pageContext));

    return () => {
      window.removeEventListener('scroll', trackScroll);
      clearInterval(timeInterval);
      clearInterval(scoreInterval);
      clearTimeout(linkTrackTimeout);
      engObserver?.disconnect();
      ctaObserver?.disconnect();
      aiObserver?.disconnect();
    };
  }, [pageType, entityId, category, brand, trackEvent]);

  return null;
}
