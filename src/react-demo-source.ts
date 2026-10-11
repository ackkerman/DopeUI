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
