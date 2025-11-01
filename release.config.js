export default {
  plugins: [
    // 1. コミット履歴からバージョン番号を算出
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    // 2. リリースノートを生成
    [
      "@semantic-release/release-notes-generator",
      { preset: "conventionalcommits" },
    ],
    // 3. [2. リリースノートを生成] の内容を Changelog ファイルに記載
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    // 4. npm パッケージ
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    // 5. リリースアセットをコミット
    [
      "@semantic-release/git",
      {
        assets: ["docs/CHANGELOG.md", "package.json", "package-lock.json"],
      },
    ],
    // 6. GitHub リリースを公開
    // "@semantic-release/github",
  ],
  dryRun: false,
  ci: false,
};
