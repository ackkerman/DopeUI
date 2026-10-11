// This entry mounts the opt-in FROST color documentation independently of the motion catalogue.
import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import { FrostColorPage } from "./FrostColorPage";
import "./styles.css";
import "./frost-color-page.css";
createRoot(document.getElementById("root")!).render(<FrostColorPage />);
