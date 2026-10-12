// This file guarantees every site page shares the same header and final repository action slot.
import type { ReactNode } from "react";
import { RepositoryLink } from "./RepositoryLink";

export function SiteHeader({
  navigation,
  actions,
  mobileNav,
}: {
  navigation: ReactNode;
  actions?: ReactNode;
  mobileNav?: ReactNode;
}) {
  return (
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="dope/ui home">
        dope<span>/</span>ui<span className="brand-dot">.</span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {navigation}
      </nav>
      <div className="header-actions">
        {actions}
        <RepositoryLink />
      </div>
      {mobileNav}
    </header>
  );
}
