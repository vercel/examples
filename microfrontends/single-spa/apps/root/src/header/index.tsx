import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { MobileMenuButton } from './mobile-menu-button';
import './header.css';

function Header(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-muted bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <a className="flex items-center gap-2" href="/">
          <img
            alt="Logo"
            className="rounded"
            height="32"
            src="/abstract-geometric-logo.png"
            width="32"
          />
          <span className="text-xl font-bold">Company</span>
        </a>
        <nav className="hidden sm:flex gap-6 ">
          <a
            className="text-sm font-medium hover:text-primary"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:text-primary"
            href="#testimonials"
          >
            Testimonials
          </a>
          <a className="text-sm font-medium hover:text-primary" href="#pricing">
            Pricing
          </a>
          <a className="text-sm font-medium hover:text-primary" href="#about">
            About
          </a>
        </nav>
        <MobileMenuButton />
      </div>
    </header>
  );
}

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Header,
  errorBoundary() {
    return <></>;
  },
});
