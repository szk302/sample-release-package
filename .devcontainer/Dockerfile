FROM debian:12.11-slim

ARG UID=1000
ARG GID=1000
ARG USER_NAME=dev
ARG NODE_VERSION=24.10.0
ARG BUN_VERSION=1.2.19
ARG DENO_VERSION=2.5.4
ARG YQ_VERSION=v4.47.2
ARG ARCH=x64
ARG Q_VERSION=1.17.1
ARG CLAUDE_CODE_VERSION=2.0.25
ARG LEFT_HOOK_VERSION=2.0.0
ARG GH_VERSION=2.82.1

LABEL maintainer="69619077+szk302@users.noreply.github.com" \
      description="sample-release-package developer image" \
      version="1.0.0"

ENV DEVCONTAINER=true \
    LC_ALL=ja_JP.UTF-8 \
    LANG=ja_JP.UTF-8 \
    PATH="/usr/local/bin:${PATH}" \
    HISTFILE="/commandhistory/.bash_history" \
    DEBIAN_FRONTEND=noninteractive \
    USER_NAME="${USER_NAME}"

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# -------------------------------------------------------------------
# 基本ツール + ロケール
# -------------------------------------------------------------------
# hadolint ignore=DL3008
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        gnupg \
        locales \
        build-essential \
        unzip \
        jq \
        less \
        git \
        gosu \
        sudo \
        # Git SSH署名用
        openssh-client && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i -E 's/# (ja_JP.UTF-8)/\1/' /etc/locale.gen && \
    locale-gen

# -------------------------------------------------------------------
# ユーザー作成
# -------------------------------------------------------------------
RUN groupadd --gid "${GID}" "${USER_NAME}" && \
    useradd --uid "${UID}" --gid "${GID}" --shell /bin/bash --create-home "${USER_NAME}" && \
    echo "${USER_NAME}:${USER_NAME}" | /usr/sbin/chpasswd && \
    echo "${USER_NAME} ALL=(ALL:ALL) ALL" | tee "/etc/sudoers.d/${USER_NAME}" && \
    chmod 0440 "/etc/sudoers.d/${USER_NAME}"

WORKDIR /tmp

# -------------------------------------------------------------------
# Node.js
# -------------------------------------------------------------------
RUN TMP_DIR=$(mktemp -d) && \
    export TMP_DIR && \
    ( \
      pushd "$TMP_DIR" && \
      NODE_DISTRO="linux-${ARCH}" && \
      curl -fsSLO "https://github.com/nodejs/release-keys/raw/HEAD/gpg/pubring.kbx" && \
      curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-${NODE_DISTRO}.tar.gz" && \
      curl -fsSLO "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt.asc" && \
      gpgv --keyring="./pubring.kbx" --output SHASUMS256.txt < SHASUMS256.txt.asc && \
      grep "node-v${NODE_VERSION}-${NODE_DISTRO}.tar.gz" SHASUMS256.txt | sha256sum -c - && \
      tar -xzf "node-v${NODE_VERSION}-${NODE_DISTRO}.tar.gz" -C /usr/local --strip-components=1 && \
      popd \
    ) && \
      rm -rf "${TMP_DIR}" \
      node --version && npm --version

# -------------------------------------------------------------------
# Bun
# -------------------------------------------------------------------
RUN TMP_DIR=$(mktemp -d) && \
    export TMP_DIR && \
    ( \
      pushd "$TMP_DIR" && \
      BUN_FILE="bun-linux-${ARCH}-baseline" && \
      BUN_GPG="F3DCC08A8572C0749B3E18888EAB4D40A7B22B59" && \
      gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys "${BUN_GPG}" && \
      curl -fsSLO "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/${BUN_FILE}.zip" && \
      curl -fsSLO "https://github.com/oven-sh/bun/releases/download/bun-v${BUN_VERSION}/SHASUMS256.txt.asc" && \
      gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc && \
      grep "${BUN_FILE}.zip" SHASUMS256.txt | sha256sum -c - && \
      unzip "${BUN_FILE}.zip" && \
      mv "${BUN_FILE}/bun" /usr/local/bin/bun && \
      chmod +x /usr/local/bin/bun && \
      popd \
    ) && \
      rm -rf "${TMP_DIR}" \
      bun --version

# -------------------------------------------------------------------
# Deno
# -------------------------------------------------------------------
RUN TMP_DIR=$(mktemp -d) && \
    export TMP_DIR && \
    ( \
      pushd "$TMP_DIR" && \
      curl -fsSLO "https://deno.land/install.sh" && \
      curl -fsSLO "https://raw.githubusercontent.com/denoland/deno_install/master/SHA256SUM" && \
      grep "install.sh" SHA256SUM | sha256sum -c && \
      DENO_INSTALL=/usr/local bash ./install.sh --version "v${DENO_VERSION}" && \
      popd \
    ) && \
    rm -rf "${TMP_DIR}" && \
    deno --version

# -------------------------------------------------------------------
# GitHub CLI
# -------------------------------------------------------------------
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
      -o /etc/apt/keyrings/githubcli-archive-keyring.gpg && \
    chmod a+r /etc/apt/keyrings/githubcli-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
      | tee /etc/apt/sources.list.d/github-cli.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y "gh=${GH_VERSION}" && \
    rm -rf /var/lib/apt/lists/* && \
    gh --version

# -------------------------------------------------------------------
# Lefthook
# -------------------------------------------------------------------
RUN curl -fsSL https://dl.cloudsmith.io/public/evilmartians/lefthook/gpg.A05F5DDE3A0BB1D2.key \
    | gpg --dearmor >> /etc/apt/keyrings/evilmartians-lefthook-archive-keyring.gpg && \
    chmod a+r /etc/apt/keyrings/evilmartians-lefthook-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/evilmartians-lefthook-archive-keyring.gpg] https://dl.cloudsmith.io/public/evilmartians/lefthook/deb/debian bookworm main" \
      | tee /etc/apt/sources.list.d/evilmartians-lefthook.list && \
    apt-get update && \
    apt-get install --no-install-recommends -y "lefthook=${LEFT_HOOK_VERSION}" && \
    rm -rf /var/lib/apt/lists/* && \
    lefthook --version

# -------------------------------------------------------------------
# yq
# -------------------------------------------------------------------
RUN TMP_DIR=$(mktemp -d) && \
    export TMP_DIR && \
    ( \
      pushd "$TMP_DIR" && \
      YQ_BINARY=yq_linux_amd64 && \
      curl -fsSLO "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/${YQ_BINARY}" && \
      curl -fsSLO "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/checksums" && \
      curl -fsSLO "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/checksums_hashes_order" && \
      SHA256_POS="$(grep -n "^SHA-256$" checksums_hashes_order | cut -d: -f1)" && \
      FIELD_NUM="$((SHA256_POS + 1))" && \
      echo "$(grep "^${YQ_BINARY} " checksums | tr -s ' ' | cut -d' ' "-f${FIELD_NUM}")  ${YQ_BINARY}" | sha256sum -c - && \
      mv "${YQ_BINARY}" /usr/local/bin/yq && \
      chmod +x /usr/local/bin/yq && \
      popd \
    ) && \
    rm -rf "${TMP_DIR}" \
    yq --version

# -------------------------------------------------------------------
# 開発ツール（ユーザ権限）
# -------------------------------------------------------------------
USER ${USER_NAME}
WORKDIR /home/${USER_NAME}

# -------------------------------------------------------------------
# Amazon Q CLI
# -------------------------------------------------------------------
RUN TMP_DIR=$(mktemp -d) && \
    export TMP_DIR && \
    ( \
      pushd "$TMP_DIR" && \
      OS=$(uname -m) && \
      curl -fsSL "https://desktop-release.q.us-east-1.amazonaws.com/${Q_VERSION}/q-${OS}-linux-musl.zip" -o q.zip && \
      unzip q.zip && \
      q/install.sh --no-confirm --force && \
      popd \
    ) && \
    rm -rf "${TMP_DIR}" \
    q --version

# UV (Python tool)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Claude Code CLI
RUN npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" && \
    claude --version
COPY --chown=${USER_NAME}:${USER_NAME} .claude /home/${USER_NAME}/.claude

# -------------------------------------------------------------------
# エントリポイント
# -------------------------------------------------------------------
# hadolint ignore=DL3002
USER root
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
