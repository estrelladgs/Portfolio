export type EventName =
  | 'case_view'
  | 'showreel_play'
  | 'lightbox_open'
  | 'cv_download'
  | 'email_copy'
  | 'linkedin_click'
  | 'contact_submit';

type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Provider-agnostic: forwards to Plausible and/or GA4 if their script is loaded. */
export function track(name: EventName, props?: Props) {
  try {
    window.plausible?.(name, props ? { props } : undefined);
    window.gtag?.('event', name, props);
  } catch {
    /* analytics must never break the page */
  }
  if (import.meta.env.DEV) console.debug('[analytics]', name, props ?? {});
}
