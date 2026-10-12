// @vitest-environment jsdom
// This file guarantees fragments navigate to mounted document sections without remounting content.
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useDocumentAnchor } from "./use-document-anchor";
const previous = window.location.href;
afterEach(() => {
  cleanup();
  document
    .querySelectorAll("[data-anchor-fixture]")
    .forEach((node) => node.remove());
  window.history.replaceState(null, "", previous);
});
it("reveals the initial section after mount and follows subsequent fragment changes", async () => {
  const install = document.createElement("section");
  install.id = "manual install";
  install.dataset.anchorFixture = "";
  install.scrollIntoView = vi.fn();
  document.body.appendChild(install);
  const usage = document.createElement("section");
  usage.id = "usage";
  usage.dataset.anchorFixture = "";
  usage.scrollIntoView = vi.fn();
  document.body.appendChild(usage);
  window.history.replaceState(null, "", "/installation#manual%20install");
  renderHook(() => useDocumentAnchor());
  await waitFor(() =>
    expect(install.scrollIntoView).toHaveBeenCalledWith({
      behavior: "instant",
      block: "start",
    }),
  );
  window.history.replaceState(null, "", "#usage");
  window.dispatchEvent(new HashChangeEvent("hashchange"));
  await waitFor(() => expect(usage.scrollIntoView).toHaveBeenCalled());
});
it("ignores missing and malformed fragments", () => {
  window.history.replaceState(null, "", "/installation#%ZZ");
  expect(() => renderHook(() => useDocumentAnchor())).not.toThrow();
  window.history.replaceState(null, "", "#missing");
  expect(() =>
    window.dispatchEvent(new HashChangeEvent("hashchange")),
  ).not.toThrow();
});
