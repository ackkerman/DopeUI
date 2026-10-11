// This file guarantees the distributed FROST CSS matches the typed token definitions.
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createFrostStylesheet } from "../src/library/frost-colors";
const path = "src/library/frost-colors.css",
  content = createFrostStylesheet();
if (!existsSync(path) || readFileSync(path, "utf8") !== content)
  writeFileSync(path, content);
console.log("FROST CSS synchronized.");

mkdirSync("public/library", { recursive: true });
for (const name of ["frost-colors.css", "frost-tailwind.css"]) {
  const output = "public/library/" + name,
    content = readFileSync("src/library/" + name, "utf8");
  if (!existsSync(output) || readFileSync(output, "utf8") !== content)
    writeFileSync(output, content);
}
