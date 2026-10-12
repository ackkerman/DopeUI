import { SiteHeader } from "./SiteHeader";
import { SiteTabs } from "./SiteTabs";
import { SiteSearch } from "./SiteSearch";
import { Button } from "./library/primitives/button";
import { SiteCode } from "./SiteCode";
// This file guarantees searchable FROST color documentation with scoped, live component examples.
import { lazy, Suspense, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "./class-names";

const CodeDialog = lazy(() =>
  import("./CodeDialog").then((module) => ({ default: module.CodeDialog })),
);
import { FrostExample } from "./FrostExample";
import {
  frostBrands,
  frostShades,
  frostColorFamilies,
  getFrostRamp,
  nordColors,
  frostExtensions,
  frostContrast,
  getFrostTokens,
  type FrostBrand,
  type FrostTheme,
} from "./library/frost-colors";
const brandNames = Object.keys(frostBrands) as FrostBrand[];
const roles = [
  { name: "Primary", key: "primary", use: "メインアクション・リンク" },
  { name: "Secondary", key: "secondary", use: "AI機能・特別な操作" },
  { name: "Accent", key: "accent", use: "選択状態・フォーカス" },
  { name: "Success", key: "success", use: "成功・成長" },
  { name: "Warning", key: "warning", use: "注意・確認" },
  { name: "Danger", key: "danger", use: "エラー・削除" },
];
const links = [
  { id: "palette", label: "Color palette" },
  { id: "nord", label: "Nord primitives" },
  { id: "example", label: "Example" },
  { id: "roles", label: "Semantic tokens" },
  { id: "usage", label: "Use in React" },
];
export function FrostColorPage() {
  const [theme, setTheme] = useState<FrostTheme>("light"),
    [brand, setBrand] = useState<FrostBrand>("frost");
  const [status, setStatus] = useState(""),
    [query, setQuery] = useState(""),
    [docs, setDocs] = useState(false),
    [mobile, setMobile] = useState(false);
  const tokens = getFrostTokens(theme, brand);
  const families = Object.entries(frostColorFamilies).filter(([key, family]) =>
    `${key} ${family.label} ${family.value}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setStatus(`${hex} をコピーしました`);
    } catch {
      setStatus(`コピーできませんでした。${hex} を手動でコピーしてください。`);
    }
  }
  return (
    <>
      <a className={cn("skip-link")} href="#palette">
        Skip to colors
      </a>
      <SiteHeader
        navigation={
          <>
            <a href="/library">Library</a>
            <Button variant="quiet" size="sm" onClick={() => setDocs(true)}>
              Docs
            </Button>
            <a href="/#about">
              About <span className={cn("new-badge")}>New</span>
            </a>
            <a
              href="/colors.html"
              className={cn("nav-active")}
              aria-current="page"
            >
              Colors
            </a>
          </>
        }
        actions={
          <>
            <Button
              variant="primary"
              className={cn("get-started")}
              href="#usage"
            >
              Get started <ArrowUpRight size={14} />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              className={cn("icon-button mobile-menu-button")}
              aria-label="Toggle navigation"
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
            >
              {mobile ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </>
        }
        mobileNav={
          mobile && (
            <nav className={cn("mobile-nav")} aria-label="Mobile navigation">
              <a href="/library">Library</a>
              <Button
                variant="quiet"
                size="sm"
                onClick={() => {
                  setMobile(false);
                  setDocs(true);
                }}
              >
                Docs
              </Button>
              <a href="/colors.html">Colors</a>
              <a href="#usage" onClick={() => setMobile(false)}>
                Use in React
              </a>
            </nav>
          )
        }
      />
      <div className={cn("frost-doc-layout")}>
        <aside className={cn("frost-doc-sidebar")}>
          <p>Foundations</p>
          <a href="/library">Motion library</a>
          <strong>Colors</strong>
          <nav aria-label="Color sections">
            {links.map((link) => (
              <a href={`#${link.id}`} key={link.id}>
                {link.label}
              </a>
            ))}
          </nav>
          <div>
            <span>FROST / 02</span>
            <small>Nord × Pastel</small>
          </div>
        </aside>
        <main className={cn("frost-doc-main")}>
          <div className={cn("frost-doc-intro")}>
            <span>Foundations</span>
            <h1>
              Colors<span>.</span>
            </h1>
            <p>
              Nordic calm, colorful expression.
              Nordの静けさに、パステルの表情を。
            </p>
          </div>
          <section id="palette" className={cn("frost-doc-section")}>
            <div className={cn("frost-doc-section-head")}>
              <h2>Color palette</h2>
              <SiteSearch
                value={query}
                onValueChange={setQuery}
                label="Search colors"
                placeholder="Search colors…"
              />
            </div>
            <p>
              スウォッチをクリックしてHEXをコピー。500がFROST / 02の原色です。
            </p>
            <div className={cn("frost-palette-grid")}>
              <div className={cn("frost-ramp-head")}>
                <span />
                {frostShades.map((shade) => (
                  <span key={shade}>{shade}</span>
                ))}
              </div>
              {families.map(([name, family]) => {
                const ramp = getFrostRamp(family.value);
                return (
                  <div className={cn("frost-ramp-row")} key={name}>
                    <div>
                      <strong>{family.label}</strong>
                      <code>{name}</code>
                    </div>
                    {frostShades.map((shade) => (
                      <Button
                        variant="unstyled"
                        size="sm"
                        type="button"
                        key={shade}
                        aria-label={`${family.label} ${shade} ${ramp[shade]} をコピー`}
                        title={`${family.label} ${shade} · ${ramp[shade]}`}
                        onClick={() => copyHex(ramp[shade])}
                      >
                        <i style={{ background: ramp[shade] }} />
                        <code>{ramp[shade]}</code>
                        <span>{shade}</span>
                      </Button>
                    ))}
                  </div>
                );
              })}
              {!families.length && (
                <div className={cn("frost-empty")}>
                  <p>一致するカラーはありません。</p>
                  <Button
                    variant="quiet"
                    size="sm"
                    type="button"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
            <p
              role="status"
              aria-live="polite"
              data-testid="frost-copy-status"
              className={cn("frost-copy-status")}
            >
              {status ||
                "50〜950はWhite / Polar Nightへ補間した独自階調。Nord公式色はそのまま保持しています。"}
            </p>
          </section>
          <section id="nord" className={cn("frost-doc-section")}>
            <h2>Nord primitives</h2>
            <p>
              公式16色は、階調とは別の名前空間 <code>--nord-0</code> 〜{" "}
              <code>--nord-15</code> で利用できます。
            </p>
            <div className={cn("frost-nord-grid")}>
              {nordColors.map((hex, i) => (
                <Button
                  variant="unstyled"
                  size="sm"
                  key={hex}
                  type="button"
                  aria-label={`Nord ${i} ${hex} をコピー`}
                  onClick={() => copyHex(hex)}
                >
                  <i style={{ background: hex }} />
                  <span>nord-{i}</span>
                  <code>{hex}</code>
                </Button>
              ))}
            </div>
          </section>
          <section id="example" className={cn("frost-doc-section")}>
            <div className={cn("frost-doc-section-head")}>
              <h2>Example</h2>
              <SiteTabs
                items={["light", "dark"] as const}
                labels={["Light", "Dark"]}
                value={theme}
                onValueChange={setTheme}
                label="カラーテーマ"
                className="frost-doc-toggle"
              />
            </div>
            <p>
              ライブラリの実コンポーネントを合成したWorkspace。配色を変えて、ナビ・タスク・通知も試せます。
            </p>
            <div
              className={cn("frost-doc-brands")}
              role="group"
              aria-label="ブランドカラー"
            >
              {brandNames.map((value) => (
                <Button
                  variant="quiet"
                  size="sm"
                  key={value}
                  type="button"
                  aria-pressed={brand === value}
                  onClick={() => setBrand(value)}
                >
                  <i style={{ background: frostBrands[value].fill }} />
                  {frostBrands[value].label}
                </Button>
              ))}
            </div>
            <FrostExample theme={theme} brand={brand} />

            <div className={cn("frost-example-values")}>
              <span>
                Accent <code>{frostBrands[brand].fill}</code>
              </span>
              <span>
                Primary <code>{tokens.primary}</code>
              </span>
              <span>
                Primary contrast{" "}
                <strong>
                  {frostContrast(
                    tokens.primary,
                    tokens["primary-foreground"],
                  ).toFixed(2)}
                  :1
                </strong>
              </span>
              <Button
                variant="quiet"
                size="sm"
                type="button"
                onClick={() => copyHex(frostBrands[brand].fill)}
              >
                Copy HEX
              </Button>
            </div>
          </section>
          <section id="roles" className={cn("frost-doc-section")}>
            <h2>Semantic tokens</h2>
            <p>
              原色を用途に結びつけます。淡い色の上にはPolar
              Night、ライトテーマの文字には濃い派生色を。
            </p>
            <div className={cn("frost-doc-table")}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Current value</th>
                    <th scope="col">用途</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.key}>
                      <th scope="row">{role.name}</th>
                      <td>
                        <i style={{ background: tokens[role.key] }} />
                        <code>{tokens[role.key]}</code>
                      </td>
                      <td>{role.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Success <code>{frostExtensions.mint}</code> · Warning{" "}
              <code>{frostExtensions.lemon}</code> · Danger{" "}
              <code>{frostExtensions.coral}</code>
            </p>
          </section>
          <section id="usage" className={cn("frost-doc-section")}>
            <h2>Use in React</h2>
            <p>
              Frost
              CSSとTailwindマッピングを同じフォルダーへ保存し、利用する範囲へ{" "}
              <code>data-frost</code> を付けます。
            </p>
            <div className={cn("frost-doc-downloads")}>
              <a href="/library/frost-colors.css" download="frost-colors.css">
                Theme tokens ↓
              </a>
              <a
                href="/library/frost-tailwind.css"
                download="frost-tailwind.css"
              >
                Tailwind mapping ↓
              </a>
            </div>
            <SiteCode
              code={
                '/* app.css */\n@import "tailwindcss";\n@import "./frost-tailwind.css";'
              }
              language={"CSS"}
            />
            <SiteCode
              code={`<section data-frost data-theme="${theme}" data-brand="${brand}">\n  <button className="bg-frost-primary hover:bg-frost-primary-hover\n    text-frost-primary-foreground">\n    Primary action\n  </button>\n</section>`}
              language={"React"}
            />
            <p>
              階調は <code>bg-frost-lavender-100</code>・
              <code>text-frost-blue-900</code>{" "}
              のように利用できます。上のExampleは同じSemantic
              Tokensをライブラリ部品に適用しています。
            </p>
          </section>
          <div className={cn("frost-doc-source")}>
            <span>FROST / 02</span>
            <a
              href="https://www.nordtheme.com/docs/colors-and-palettes/"
              target="_blank"
              rel="noreferrer"
            >
              Nord palette ↗
            </a>
            <span>原色16 + 拡張7 + Semantic Tokens + ブランドテーマ</span>
          </div>
        </main>
      </div>
      <footer>
        <div>
          <a className={cn("wordmark")} href="/">
            dope<span>/</span>ui<span className={cn("brand-dot")}>.</span>
          </a>
          <p>Thoughtful motion for everyday interfaces.</p>
        </div>
        <div className={cn("footer-links")}>
          <a href="/library">Library</a>
          <Button variant="quiet" size="sm" onClick={() => setDocs(true)}>
            Documentation
          </Button>
          <a href="/colors.html">Colors</a>
          <a href="/#about">About</a>
        </div>
      </footer>
      {docs && (
        <Suspense fallback={null}>
          <CodeDialog docs demo={null} onClose={() => setDocs(false)} />
        </Suspense>
      )}
    </>
  );
}
