'use client';
 
import { useEffect } from 'react';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);
 
  return (
    <html lang="ru">
      <body style={{ fontFamily: 'system-ui, -apple-system, sans-serif', margin: 0, padding: '40px 20px', background: '#f8fafc', color: '#1e293b' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Ошибка на сервере</h1>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Что-то пошло не так. Мы уже знаем о проблеме и работаем над её устранением.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: '#0f172a',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Попробовать снова
          </button>
          <p style={{ marginTop: '2rem' }}>
            <a href="/" style={{ color: '#0369a1' }}>← На главную</a>
          </p>
        </div>
      </body>
    </html>
  );
}
