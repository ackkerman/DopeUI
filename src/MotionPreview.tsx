import { cn } from "./class-names";
import ModalEntrance from "./library/components/modal";
// This file guarantees that every preview renders the same component offered for copying.
import type { MotionDemo } from "./catalog";
import { libraryEntries } from "./library/registry";
export function MotionPreview({ demo }: { demo: MotionDemo }) {
  const entry = libraryEntries[demo.id];
  const Component = entry.Component;
  if (demo.kind === "modal")
    return (
      <ModalEntrance preview className={cn(`preview preview-${demo.kind}`)} />
    );
  return <Component className={cn(`preview preview-${demo.kind}`)} />;
}
