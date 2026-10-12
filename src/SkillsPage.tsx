// This file guarantees discoverable installation and usage instructions for the public dope/ui Agent Skill.
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";
import { SiteHeader } from "./SiteHeader";
import { SiteCode } from "./SiteCode";
import { Button } from "./library/primitives/button";
import "./InstallationPage.css";

export function SkillsPage() {
  return (
    <>
      <a className="skip-link" href="#skills">
        Skip to skills
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
          <Button variant="primary" className="get-started" href="/library">
            Explore library <ArrowRight size={14} />
          </Button>
        }
      />
      <div className="detail-shell docs-shell installation-shell">
        <DocsSidebar current="skills" />
        <main id="skills" className="detail-main installation-content">
          <div className="detail-heading">
            <div>
              <h1>Skills</h1>
              <p>Give your AI agent context for dope/ui.</p>
            </div>
          </div>
          <p>
            The dope-ui skill helps your agent find, install, compose, and
            customize components using the APIs and styles already in your
            project.
          </p>
          <section id="install">
            <h2>Install</h2>
            <p>
              Run this command from your project directory. Choose the agents
              you use when prompted.
            </p>
            <SiteCode
              code="npx skills add ackkerman/DopeUI --skill dope-ui"
              language="Shell"
            />
            <p>To install specifically for Codex:</p>
            <SiteCode
              code="npx skills add ackkerman/DopeUI --skill dope-ui --agent codex"
              language="Shell"
            />
            <p>
              The default scope is your project. Add <code>--global</code> if
              you want the skill available across projects. The skill provides
              guidance; it does not install UI components until you ask your
              agent to do so.
            </p>
            <p>You can also install from the published definition:</p>
            <SiteCode
              code="npx skills add https://ui.0xdope.com/skills/dope-ui/SKILL.md"
              language="Shell"
            />
            <p>
              <a href="/skills/dope-ui/SKILL.md" download>
                Download SKILL.md
              </a>{" "}
              ·{" "}
              <a
                href="https://github.com/ackkerman/DopeUI/tree/main/skills/dope-ui"
                target="_blank"
                rel="noreferrer"
              >
                View skill source <ArrowUpRight size={13} />
              </a>
            </p>
          </section>
          <section id="included">
            <h2>What’s included</h2>
            <p>
              <strong>Project context.</strong> The agent checks your package
              manifest, components.json, aliases, CSS entry, and installed
              components before proposing an integration.
            </p>
            <p>
              <strong>Component discovery.</strong> The skill points to the
              current catalogue and Registry, including stable installation IDs,
              real exports, props, and dependencies.
            </p>
            <p>
              <strong>Installation and composition.</strong> Guidance covers the
              shadcn CLI, the shared foundation, manual installation, and
              choosing a reusable primitive rather than importing its demo
              controls.
            </p>
            <p>
              <strong>Styles and interaction.</strong> The agent follows FROST
              roles and checks hover, disabled, empty, expanded, keyboard, and
              reduced-motion states relevant to your component.
            </p>
          </section>
          <section id="usage">
            <h2>Try it with your agent</h2>
            <p>
              After installation, ask for the interaction you want to build. For
              example:
            </p>
            <ul>
              <li>“Add a dope/ui Clearable Input to this search bar.”</li>
              <li>
                “Use Collapsible Sidebar for these documentation sections.”
              </li>
              <li>“Add an Organic Shimmer with diagonal motion.”</li>
              <li>
                “Install Pulse Button and match it to our existing theme.”
              </li>
            </ul>
            <p>
              In Codex, you can explicitly invoke <code>$dope-ui</code>. Skill
              discovery and invocation depend on your agent’s support.
            </p>
          </section>
          <section id="how-it-works">
            <h2>How it works</h2>
            <p>
              The installer adds SKILL.md to your agent’s skills directory. The
              agent reads those instructions when the skill applies, inspects
              your project, and fetches the selected component’s current
              Registry source.
            </p>
            <p>
              The skill keeps guidance small and uses live references for the
              catalogue and code. It preserves your project configuration and
              does not assume every component has the same export or props.
            </p>
            <p>
              <a href="/llms.txt">llms.txt</a> provides the catalogue and docs
              index. <a href="/llms-full.txt">llms-full.txt</a> includes setup
              instructions and complete component source.
            </p>
          </section>
          <Button href="/installation.html" variant="primary">
            Component installation <ArrowRight size={16} />
          </Button>
        </main>
      </div>
    </>
  );
}
