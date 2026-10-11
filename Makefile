TEST_FLAGS ?=
.PHONY: help install dev lint typecheck test build format check registry sources
help: ## コマンド一覧
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "%-16s %s\n", $$1, $$2}' $(MAKEFILE_LIST)
install: ## 依存関係を導入
	npm install
dev: ## ローカル開発
	npm run dev -- --host 0.0.0.0 --port 4173
lint: ## 静的解析と整形確認
	npm run lint
	npm run format:check
typecheck: ## 型検証
	npm run typecheck
test: ## 振る舞いテスト
	npm test -- $(TEST_FLAGS)
build: ## 本番ビルド
	npm run build
format: ## 整形
	npm run format
check: lint typecheck test build ## 一括検証
	npm run test:sites
	npm run test:registry

colors: ## FROSTの配布CSSを生成
	npx tsx scripts/prepare-frost-colors.ts

registry: ## shadcn互換配布JSONを生成
	npm run registry:build

sources: ## 共通Library graphから自己完結TSXを生成
	npm run sources:build

pages-build: ## Cloudflare Pages用の静的配布物を生成
	npm run build:pages
