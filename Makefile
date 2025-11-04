ifneq (,$(wildcard ./.env))
    include .env
    export
endif

DEFAULT_NEXT_VERSION := $(shell git cliff --bump --context | jq -r '.[0].version')
DEFAULT_BUMP_TYPE := auto

.PHONY: start-agent-d
start-agent-d: ## developer agentを開始します。
	q chat --agent developer

.PHONY: release
release: ## release を開始します。
	npm run release

.PHONY: show-next-version
show-next-version: $(addprefix show-next-version-, $(DEFAULT_BUMP_TYPE))

.PHONY: show-next-version-%
show-next-version-%: ## 次のバージョンを表示します。 (-%: 更新対象(major | minor | patch | auto(default)))
	@git-cliff --bump "${@:show-next-version-%=%}" --context | jq -r '.[0].version'

.PHONY: gen-changelog
gen-changelog: $(addprefix gen-changelog-, $(DEFAULT_NEXT_VERSION))

.PHONY: gen-changelog-%
gen-changelog-%: ## changelog を生成します。(-%: バージョン(vX.X.X(default: 次のバージョン)))
	git-cliff --tag "${@:gen-changelog-%=%}" --output docs/CHANGELOG.md

.PHONY: bump-version-%
bump-version-%: ## パッケージ のバージョンを更新します。(-%: バージョン)
	@npm version "${@:bump-version-%=%}" --no-git-tag-version

.PHONY: help
help:
	@grep -E '^[0-9a-zA-Z_%-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help
