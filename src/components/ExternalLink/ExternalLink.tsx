import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useLang } from '../../context/LangContext';

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> & {
  href: string;
  children: ReactNode;
};

/** Link that opens in a new tab, safely, and tells screen reader users so. */
export function ExternalLink({ children, ...props }: ExternalLinkProps) {
  const { copy } = useLang();
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="visually-hidden"> ({copy.a11y.newTab})</span>
    </a>
  );
}
