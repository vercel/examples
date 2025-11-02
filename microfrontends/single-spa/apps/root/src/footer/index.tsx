import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';

function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-muted bg-background">
      <div className="px-4 py-12 md:px-6 md:py-16 mx-auto max-w-7xl">
        <div className="grid gap-8 grid-cols-5">
          <div className="col-span-1 sm:col-span-2 lg:col-span-2">
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
            <p className="mt-4 max-w-xs text-muted-foreground">
              Empowering businesses with innovative solutions since 2010. Your
              success is our priority.
            </p>
            <div className="mt-6 flex gap-4">
              {[
                {
                  name: 'Twitter',
                  icon: (
                    <svg
                      className="size-5"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                },
                {
                  name: 'LinkedIn',
                  icon: (
                    <svg
                      className="size-5"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect height="12" width="4" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
                {
                  name: 'Facebook',
                  icon: (
                    <svg
                      className="size-5"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  name: 'Instagram',
                  icon: (
                    <svg
                      className="size-5"
                      fill="none"
                      height="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  href="/"
                  key={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Integrations', 'FAQ', 'Changelog'].map(
                (item) => (
                  <li key={item}>
                    <a
                      className="text-muted-foreground hover:text-foreground"
                      href="/"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                <li key={item}>
                  <a
                    className="text-muted-foreground hover:text-foreground"
                    href="/"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      className="text-muted-foreground hover:text-foreground"
                      href="/"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: Footer,
  errorBoundary() {
    return <></>;
  },
});
