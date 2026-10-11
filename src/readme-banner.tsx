// This file guarantees the README banner renders the actual library components.
import { createRoot } from "react-dom/client";
import { OtpInput } from "./library/components/otp-input";
import { FluidOrb } from "./library/components/fluid-orb";
import { LoadingIndicator } from "./library/components/dot-loader";
import Like from "./library/components/like";
import AiPromptBar from "./library/components/ai-prompt-bar";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./styles.css";
import "./readme-banner.css";

function ReadmeBanner() {
  return (
    <main className="readme-banner">
      <div className="readme-outline" aria-hidden="true" />
      <header className="readme-brand">
        <h1>dope/ui</h1>
        <p>Move. Interact. Make it yours.</p>
      </header>
      <section className="readme-components" aria-label="Library components">
        <div className="readme-otp">
          <OtpInput length={4} defaultValue="5" size="lg" autoFocus />
        </div>
        <div className="readme-orbs" aria-label="Fluid Orb colors">
          {["#416C91", "#59687D", "#567E62", "#B48E55", "#BF616A"].map(
            (color) => (
              <FluidOrb key={color} size={66} color={color} />
            ),
          )}
        </div>
        <div className="readme-like">
          <Like defaultPressed />
        </div>
        <div className="readme-prompt">
          <AiPromptBar variant="Pill" demo={false} />
        </div>
        <div className="readme-cards">
          <article>
            <div className="readme-card-demo">
              <FluidOrb size={110} color="#416C91" />
            </div>
            <h2>Fluid Orb</h2>
            <p>Motion with character.</p>
          </article>
          <article>
            <div className="readme-card-demo">
              <LoadingIndicator variant="bouncing-dots" size={84} />
            </div>
            <h2>Loading State</h2>
            <p>Small details. Better flow.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<ReadmeBanner />);
