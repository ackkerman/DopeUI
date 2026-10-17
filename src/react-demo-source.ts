import { libraryEntries } from "./library/registry";
// This file guarantees consistent filenames and usage examples for canonical components.
export function reactComponentName(id: string): string {
  const filename = libraryEntries[id]?.filename;
  if (filename) return filename.replace(/\.tsx$/, "");
  return id
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

/** Public primitives are shown where a demo's default export would obscure the reusable API. */
export function reactUsageExample(id: string): string {
  if (id === "image-generation") {
    return `import { ImageGeneration } from './ImageGeneration';

export default function App() {
  return (
    <ImageGeneration status="complete" prompt="two friends taking a selfie in a car">
      <img src="/generated-image.jpg" alt="Two friends taking a selfie in a car" />
    </ImageGeneration>
  );
}`;
  }
  if (id === "decorative-arrow") {
    return `import { DecorativeArrow } from './DecorativeArrow';

export default function App() {
  return (
    <div style={{ position: 'relative', paddingTop: 100 }}>
      <DecorativeArrow
        shape="loop" width={160} height={96} rotate={15}
        style={{ position: 'absolute', top: 0, left: 32 }}
      />
      <button>Try it out</button>
    </div>
  );
}`;
  }
  if (id === "arrow") {
    return `import { Arrow, ArrowLayer } from './Arrow';

export default function App() {
  return (
    <ArrowLayer style={{ height: 200 }}>
      <Arrow
        from={{ x: 30, y: 140 }}
        to={{ x: 250, y: 40 }}
        appearance="handdrawn"
        variant="curved"
        animated
      />
    </ArrowLayer>
  );
}`;
  }
  const name = reactComponentName(id);
  return `import ${name} from './${name}';\n\nexport default function App() {\n  return <${name} />;\n}`;
}
