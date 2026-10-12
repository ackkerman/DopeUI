import { DocsSidebar } from "./DocsSidebar";
// This file guarantees a directly addressable introduction to dope/ui and its editable components.
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "./SiteHeader";
import { Button } from "./library/primitives/button";
import "./InstallationPage.css";
import "./IntroductionPage.css";

const sections = [
  { id: "editable-code", title: "Code you can make your own" },
  { id: "composition", title: "Small pieces, useful together" },
  { id: "shared-style", title: "A shared visual language" },
  { id: "motion", title: "Motion with a purpose" },
  { id: "getting-started", title: "Start with one interaction" },
];

export function IntroductionPage() {
  return (
    <>
      <a className="skip-link" href="#introduction">
        Skip to introduction
      </a>
      <SiteHeader
        navigation={
          <>
            <a href="/library">Library</a>
            <a href="/introduction.html" aria-current="page">
              Docs
            </a>
            <a href="/colors.html">Colors</a>
          </>
        }
        actions={
          <Button
            variant="primary"
            className="get-started"
            href="/installation.html"
          >
            Get started <ArrowRight size={14} />
          </Button>
        }
      />
      <div className="detail-shell docs-shell installation-shell introduction-shell">
        <DocsSidebar current="introduction" />
        <main
          id="introduction"
          className="detail-main installation-content introduction-content"
        >
          <div className="detail-heading">
            <div>
              <h1>Introduction</h1>
              <p>A little more feeling.</p>
            </div>
          </div>
          <p className="introduction-lead">
            dope/ui is a collection of editable React components for the small
            moments that make an interface feel alive.
          </p>
          <p>
            Buttons that respond, images that open, text that reveals, and
            feedback that makes an action clear. Explore each interaction in the
            Library, then bring the source into your own project.
          </p>
          <p>
            Built for React 19 and Tailwind CSS v4, the components are available
            through the shadcn CLI or as source you can copy directly. You
            choose the pieces your app needs.
          </p>
          <section id="editable-code">
            <h2>Code you can make your own</h2>
            <p>
              The component code lives in your project. Change its props, adjust
              an animation, or reshape the markup to fit the way your product
              works. You can read and edit the implementation alongside the rest
              of your app.
            </p>
            <p>
              Each detail page includes an interactive preview, the React
              source, and its installation instructions. The source you copy and
              the Registry version come from the same component implementation.
            </p>
          </section>
          <section id="composition">
            <h2>Small pieces, useful together</h2>
            <p>
              Start with a single interaction and build from there. Combine a
              clearable input with sliding tabs for a search interface, use a
              code block to explain an example, or add a confirmation step to a
              delete action.
            </p>
            <p>
              The components expose their own props and callbacks so you can
              connect them to your application state. The Library lets you try
              their behavior before deciding where they belong.
            </p>
          </section>
          <section id="shared-style">
            <h2>A shared visual language</h2>
            <p>
              Shared colors, typography, and control shapes keep the components
              comfortable together. The FROST palette pairs calm surfaces with
              color for actions and feedback.
            </p>
            <p>
              Load the shared foundation once, then adapt the tokens and
              component styles to your theme. Explore the{" "}
              <a href="/colors.html">Colors page</a> to see the palette,
              semantic roles, and a working example in light and dark themes.
            </p>
          </section>
          <section id="motion">
            <h2>Motion with a purpose</h2>
            <p>
              Motion helps explain what changed: a selected tab moves into
              place, a deleted item gets confirmation, and a loading state shows
              that work is still in progress.
            </p>
            <p>
              Keep the effect appropriate to the task. The components include
              reduced-motion handling, and interactive examples use native
              controls where appropriate. When you customize them, keep keyboard
              access, focus, and clear feedback part of the experience.
            </p>
          </section>
          <section id="getting-started">
            <h2>Start with one interaction</h2>
            <ol>
              <li>
                Browse the <a href="/library">Library</a> and try an
                interaction.
              </li>
              <li>
                Follow <a href="/installation.html">Installation</a> to prepare
                your project and add the component.
              </li>
              <li>
                Connect it to your app and customize the source to suit your
                interface.
              </li>
            </ol>
            <p>
              The detail page lists the dependencies and usage for each
              component. Keep the included license when redistributing the code.
            </p>
          </section>
          <div className="introduction-next">
            <Button href="/library" variant="secondary">
              Explore components <ArrowRight size={16} />
            </Button>
            <Button href="/installation.html" variant="primary">
              Installation <ArrowRight size={16} />
            </Button>
          </div>
        </main>
        <nav className="introduction-toc" aria-label="On this page">
          <span>On this page</span>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
