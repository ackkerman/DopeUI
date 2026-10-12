---
name: dope-ui
description: Find, install, compose, and customize dope/ui React components using its public Registry and shared FROST styles. Use when adding dope/ui interactions, choosing components from its Library, or fixing installed dope/ui components in a React and Tailwind project.
---

# dope/ui

Use dope/ui's editable React components for purposeful interaction and motion. Adapt the selected component to the user's project rather than recreating its preview by eye.

## Discover the component and project

- Read the project's package manifest, relevant UI source, CSS entry, and `components.json` when present. Confirm the framework, React/Tailwind versions, component aliases, existing styles, and package manager.
- Find current component names and stable install IDs in [llms.txt](https://ui.0xdope.com/llms.txt). Public labels and install IDs differ: **Pulse Button** uses `pulsating-button`, **Clearable Input** uses `clear-input`, and **Collapsible Sidebar** uses `hook-sidebar`.
- Inspect the chosen Registry JSON at `https://ui.0xdope.com/r/{id}.json`. Read its source, exports, props, dependencies, files and installation notes before writing usage. Do not assume that the public display name is an import or that all components export the same API.
- Use [llms-full.txt](https://ui.0xdope.com/llms-full.txt) when a consolidated source reference helps; otherwise fetch only the selected Registry item. Use the [Library](https://ui.0xdope.com/library) and its detail page to inspect behavior.
- If a reference cannot be fetched, use an available local source and state what was unverified. Do not invent component IDs, props, exports, package names, or dependencies.

## Install into the existing project

The published distribution targets **React 19 and Tailwind CSS v4**. If the project uses different versions, explain the compatibility gap and choose a scoped approach with the user instead of silently upgrading the framework.

If the project already has `components.json`, preserve its aliases and configuration. Initialize shadcn only when needed. For example:

```sh
npx shadcn@latest init
npx shadcn@latest add https://ui.0xdope.com/r/like.json
```

Use the project's package manager equivalent where appropriate. Install only the requested components. The Registry declares runtime and development dependencies, the shared foundation and LICENSE.txt; inspect the resolved files after installation.

Load the installed foundation **once** from the app's global CSS. With `src/components` as the alias and `src/index.css` as the CSS entry:

```css
@import "./components/dope-ui/foundation.css";
```

Adjust the path to the actual installed location. The foundation imports Tailwind and shadow-plugin and includes base styles; avoid duplicate Tailwind imports and check its effect on existing pages. Follow [Installation](https://ui.0xdope.com/installation) for framework setup and manual use. Preserve included license files when redistributing.

For manual installation, save the complete Registry component source as TSX, install its declared dependencies, and download the shared [foundation.css](https://ui.0xdope.com/library/foundation.css). Do not leave imports to private site files such as demo.css or site utilities.

## Compose and customize

- Use the real component exports and callbacks in the source. Connect controlled values to app state when the API supports them. Preserve the existing user's form, routing and data behavior.
- Distinguish the interaction component from its demo wrapper. A preview may include a reset button, explanatory text or variant controls that do not belong in the product. Use named primitives when available; inspect the default export before choosing it.
- Follow the shared [Colors](https://ui.0xdope.com/colors.html) tokens for surface, foreground, primary, muted and disabled roles. Avoid unrelated palettes or overly dark hover effects. Adapt existing theme tokens before adding new ones.
- Check CSS precedence: unlayered site rules for `a`, `button`, `input` or `pre` can override component utility styles. Verify the rendered foreground, background, dimensions and alignment, not just class names.
- Preserve native button/link semantics, labels, keyboard access, focus return and reduced-motion behavior. Disabled motion controls should stop their decorative animation as well as clicks.
- Keep input height stable when cleared. Hide the native search cancel affordance when the component already provides an animated clear control.
- For code display, use the component's shared copy/header behavior rather than positioning a second copy button outside it. Preserve complete copy/download source even if the visible preview is limited.
- For Collapsible Sidebar, use `HookSidebar` with `children` on items and `defaultExpanded` or controlled `expanded`/`onExpandedChange`. Keep the parent link and its expansion toggle separate; indent visible child sections.

## Verify the result

Run the project's relevant checks. Inspect the actual UI at desktop and narrow widths, including empty, disabled, expanded and reduced-motion states relevant to the selected component. Verify the requested interaction and integration rather than treating a passing build as visual proof. Report what changed and what was verified; deploy only when the user's task authorizes deployment.
