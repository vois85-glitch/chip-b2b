'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SESSION_KEY = 'chipnet_sticky_rfq_dismissed';
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

function getSessionDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  const ts = Number(raw);
  if (isNaN(ts)) return false;
  return Date.now() - ts < COOLDOWN_MS;
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function StickyRfqBar() {
  const [visible, setVisible] = useState(false);
  const [manuallyDismissed, setManuallyDismissed] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [urgentDelivery, setUrgentDelivery] = useState(false);

  // Read session dismissal reactively (no setState in effect)
  const sessionDismissed = useSyncExternalStore(
    subscribeToStorage,
    getSessionDismissed,
    () => false // server snapshot
  );

  const dismissed = sessionDismissed || manuallyDismissed;

  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const scrollPercent = window.scrollY / scrollHeight;
    if (scrollPercent >= 0.3) {
      setVisible(true);
      // Track visibility in Yandex.Metrika
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).ym?.(109105382, 'reachGoal', 'sticky_rfq_shown');
      } catch {
        // Metrika not available
      }
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Defer initial scroll check to avoid synchronous setState in effect
    const rafId = requestAnimationFrame(() => {
      handleScroll();
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [dismissed, handleScroll]);

  const handleClose = () => {
    setVisible(false);
    setManuallyDismissed(true);
    sessionStorage.setItem(SESSION_KEY, String(Date.now()));
  };

  const handleCtaClick = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ym?.(109105382, 'reachGoal', 'sticky_rfq_click');
    } catch {
      // Metrika not available
    }
  };

  const ctaHref = urgentDelivery ? '/rfq?urgency=urgent' : '/#bom';

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e8e8e8] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
            {/* Quantity input */}
            <div className="flex items-center gap-2">
              <label htmlFor="rfq-qty" className="text-xs text-[#555] whitespace-nowrap">
                Кол-во:
              </label>
              <input
                id="rfq-qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-20 bg-[#f0f4ee] border border-[#d4ddd2] rounded-lg px-3 py-1.5 text-sm text-[#121212] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Urgent delivery toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs text-[#555]">Срочная поставка</span>
              <button
                type="button"
                role="switch"
                aria-checked={urgentDelivery}
                onClick={() => setUrgentDelivery(!urgentDelivery)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  urgentDelivery ? 'bg-primary' : 'bg-[#d4ddd2]'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    urgentDelivery ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>

            {/* CTA Button */}
            <Link
              href={ctaHref}
              onClick={handleCtaClick}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary hover:bg-primary-dark rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 text-white flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Запросить КП
            </Link>

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-1 right-2 sm:static sm:ml-2 p-1 text-[#999] hover:text-[#555] transition-colors"
              aria-label="Закрыть"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
