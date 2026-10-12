import { SiteHeader } from "./SiteHeader";
import { Button } from "./library/primitives/button";
// This file guarantees a directly addressable guide to the current component distribution.

import type { CodeLanguage } from "./demo-source";
import { SiteCode } from "./SiteCode";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "./InstallationPage.css";

function Command({
  code,
  language = "Shell",
}: {
  code: string;
  language?: CodeLanguage;
}) {
  return <SiteCode code={code} language={language} />;
}

export function InstallationPage() {
  return (
    <>
      <a className="skip-link" href="#installation">
        Skip to installation
      </a>
      <SiteHeader
        navigation={
          <>
            <a href="/library">Library</a>
            <a href="/installation.html" aria-current="page">
              Docs
            </a>
            <a href="/colors.html">Colors</a>
          </>
        }
        actions={
          <>
            <Button variant="primary" className="get-started" href="/library">
              Explore library <ArrowRight size={14} />
            </Button>
          </>
        }
      />
      <div className="detail-shell installation-shell">
        <aside className="detail-sidebar">
          <nav className="sidebar-section" aria-label="Getting started">
            <span className="sidebar-label">Getting started</span>
            <a href="/installation.html" aria-current="page">
              Installation
            </a>
            <a href="#requirements">Requirements</a>
            <a href="#shadcn">Using shadcn</a>
            <a href="#styles">Shared styles</a>
            <a href="#manual">Manual installation</a>
            <a href="/library">Browse components</a>
          </nav>
        </aside>
        <main id="installation" className="detail-main installation-content">
          <div className="detail-heading">
            <div>
              <h1>Installation</h1>
              <p>Add a little more feeling to your app.</p>
            </div>
          </div>
          <p>
            Install editable React components with the shadcn CLI, or copy the
            source directly. The code lives in your project, ready to customize.
          </p>
          <section id="requirements">
            <h2>1. Prepare your project</h2>
            <p>
              Use React 19 and Tailwind CSS v4. Configure Tailwind for your
              framework before adding a component.
            </p>
            <p>For Vite, install the Tailwind plugin:</p>
            <Command code="npm install tailwindcss @tailwindcss/vite" />
            <Command
              language="JavaScript"
              code={
                'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n});'
              }
            />
            <p>
              Keep your existing Vite plugins and configuration. For other
              frameworks, follow the{" "}
              <a
                href="https://tailwindcss.com/docs/installation"
                target="_blank"
                rel="noreferrer"
              >
                Tailwind setup guide <ArrowUpRight size={13} />
              </a>
              .
            </p>
          </section>
          <section id="shadcn">
            <h2>2. Add a component</h2>
            <p>
              In an existing project, initialize shadcn once. If you already
              have a components.json file, skip init.
            </p>
            <Command code="npx shadcn@latest init" />
            <p>
              Set up your components alias using the{" "}
              <a
                href="https://ui.shadcn.com/docs/installation"
                target="_blank"
                rel="noreferrer"
              >
                shadcn framework guide <ArrowUpRight size={13} />
              </a>
              , then add a component from dope/ui:
            </p>
            <Command code="npx shadcn@latest add https://ui.0xdope.com/r/like.json" />
            <p>
              The CLI installs the component source, npm dependencies, shared
              foundation.css, and LICENSE.txt. Other components have their own
              install command on the detail page.
            </p>
          </section>
          <section id="styles">
            <h2>3. Load the shared styles</h2>
            <p>
              Import the foundation once in your global CSS. This example
              assumes src/index.css and a components alias pointing to
              src/components:
            </p>
            <Command
              language="CSS"
              code={'@import "./components/dope-ui/foundation.css";'}
            />
            <p>
              Adjust the path to the installed file. The foundation already
              imports Tailwind and shadow-plugin, so replace a duplicate
              Tailwind import. Its base styles and tokens apply across the page;
              adapt them to your app’s theme.
            </p>
            <p>Then import the installed component:</p>
            <Command
              language="React"
              code={
                'import LikeButton from "@/components/like";\n\nexport default function Example() {\n  return <LikeButton />;\n}'
              }
            />
            <p>
              Follow the alias in components.json. In Next.js, keep the
              component’s use client directive.
            </p>
          </section>
          <section id="namespace">
            <h2>Use a shorter install command</h2>
            <p>Optionally merge this registries entry into components.json:</p>
            <Command
              language="JSON"
              code={
                '{\n  "registries": {\n    "@dope-ui": "https://ui.0xdope.com/r/{name}.json"\n  }\n}'
              }
            />
            <Command code="npx shadcn@latest add @dope-ui/like" />
          </section>
          <section id="manual">
            <h2>Install manually</h2>
            <ol>
              <li>
                Open a component in the <a href="/library">Library</a> and copy
                its complete React source into the filename shown under Use in
                React.
              </li>
              <li>
                Run the npm dependency command on that detail page. Add
                shadow-plugin for the shared CSS.
              </li>
              <li>
                Download{" "}
                <a href="/library/foundation.css" download>
                  foundation.css
                </a>
                , import it once, and use the component’s default export.
              </li>
            </ol>
            <Command code="npm install shadow-plugin" />
            <p>
              Retain the{" "}
              <a
                href="https://github.com/ackkerman/DopeUI/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
              >
                MIT license
              </a>{" "}
              when redistributing. You can change the source, props, and styles
              in your own project.
            </p>
          </section>
          <Button
            variant="primary"
            className="introduction-action"
            href="/library"
          >
            Browse components <ArrowRight size={16} />
          </Button>
        </main>
      </div>
    </>
  );
}
