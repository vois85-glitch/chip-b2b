// lib/metrika.ts — Yandex Metrika goal tracking helper.
//
// Centralizes all ym() reachGoal calls so we can:
//   - Track conversions in one place
//   - Avoid duplicating the Metrika counter ID everywhere
//   - Gracefully degrade when Metrika is not loaded (SSR, adblock, etc.)
//
// Yandex Metrika counter: 109105382 (chip-net.ru)
//
// Conversions tracked:
//   - lead_callback_submitted — /api/callback form submitted
//   - lead_cart_submitted — /api/cart-submit form submitted (cart checkout)
//   - lead_bom_submitted — BOM upload form submitted
//   - lead_rfq_submitted — RFQ form submitted
//   - lead_phone_click — Phone number clicked (mobile)
//   - lead_email_click — Email link clicked
//   - lead_telegram_click — Telegram contact clicked
//
// Engagement events (already tracked by EngagementTracker):
//   - scroll_25, scroll_50, scroll_75, scroll_100 — scroll depth
//   - time_15s, time_30s, time_60s, time_120s — time on page
//   - sticky_rfq_shown, sticky_rfq_click — RFQ sticky bar interaction
//
// Micro-conversions:
//   - search_used — Catalog search used
//   - catalog_filter_used — Catalog filter applied
//   - component_page_view — Component detail page opened
//   - analog_page_view — Analog/alternative page opened
//   - brand_page_view — Brand hub page opened
//   - bom_page_view — BOM page opened
//   - external_yandex_business_click — Yandex Business card click

export const METRIKA_COUNTER_ID = 109105382;

type GoalParams = Record<string, string | number | boolean | undefined>;

/**
 * Send a Yandex Metrika goal.
 * Safe to call during SSR or when Metrika is not loaded.
 *
 * @example
 * trackGoal('lead_callback_submitted', { page: '/contacts' });
 */
export function trackGoal(goal: string, params?: GoalParams): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ym = (window as any).ym;
    if (typeof ym === 'function') {
      ym(METRIKA_COUNTER_ID, 'reachGoal', goal);
      if (params) {
        ym(METRIKA_COUNTER_ID, 'params', params);
      }
    }
  } catch {
    // Metrika not available — silent fail
  }
}

/**
 * Track a page view (for SPA route changes if needed).
 * Metrika usually auto-tracks page views, but useful for programmatic navigation.
 */
export function trackPageView(url: string, title?: string): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ym = (window as any).ym;
    if (typeof ym === 'function') {
      ym(METRIKA_COUNTER_ID, 'hit', url, { title: title || document.title });
    }
  } catch {
    // Silent fail
  }
}

/**
 * Track e-commerce event (for products in cart).
 * Uses dataLayer — same as GA4 ecommerce.
 *
 * @example
 * trackEcommerce('add', { id: 'STM32F103C8T6', name: 'STM32F103', brand: 'STMicroelectronics' });
 */
export function trackEcommerce(event: 'add' | 'remove' | 'purchase' | 'detail', product: {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  quantity?: number;
  price?: number;
}): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataLayer = (window as any).dataLayer || ((window as any).dataLayer = []);
    dataLayer.push({
      ecommerce: {
        currencyCode: 'RUB',
        [event]: {
          products: [product],
        },
      },
    });
  } catch {
    // Silent fail
  }
}

/**
 * Track outbound link click (for partner links, social media, etc.)
 */
export function trackOutbound(target: string, category: string = 'outbound'): void {
  trackGoal('outbound_click', { target, category });
}
