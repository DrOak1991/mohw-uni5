# 開發環境設定

> 最後更新：2026-07-16

## Node 版本

本專案使用 **Node.js 24.16.0**，已由 `.nvmrc` 指定。

Next.js 16.1.6 要求 `>=20.9.0`，低於此版本 dev server 會直接拒絕啟動。

```bash
nvm use          # 讀取 .nvmrc
npm install
npm run dev      # http://localhost:3000
```

## 已知地雷：舊版 npm 會漏裝原生套件

**症狀**：`npm ci` 回報成功（exit 0），dev server 也顯示 `✓ Ready`，但每個頁面都回 HTTP 500，log 出現：

```
Error: Cannot find native binding.
Cannot find module '@tailwindcss/oxide-darwin-arm64'
```

**原因**：npm 9.x 有 optional dependencies 的已知 bug（https://github.com/npm/cli/issues/4828），
會漏裝平台專屬的原生套件（此專案是 Tailwind 4 的 `@tailwindcss/oxide`）。
安裝過程不會報錯，所以很容易誤判成安裝成功。

**修復**：確認 node/npm 版本正確後重裝。不需要刪 `package-lock.json`：

```bash
nvm use
rm -rf node_modules
npm ci
ls node_modules/@tailwindcss/   # 應出現 oxide-darwin-arm64
```

## 環境現況（2026-07-16 整理後）

- nvm 由 Homebrew 安裝，載入設定在 `~/.zshrc` 末尾（`NVM_DIR` + `source nvm.sh`）。
  這段設定在 2026-07-16 前是缺的，導致 shell 裡完全沒有 `node` 和 `nvm` 指令。
- nvm 目前保留 `v20.20.2` 和 `v24.16.0`，default alias 指向 `24.16.0`。
  已移除 `v19.6.0`（EOL）和 `v20.19.2`（被 v20.20.2 取代）。

## 給 Claude Code session 的注意事項

Claude Code 的執行環境會把 **所有** nvm 已安裝的 node 版本目錄一併塞進 `PATH`，
並依版本號排序 —— 也就是說 `node -v` 拿到的是**最舊**的版本，不是 nvm 的 default。
這與使用者 terminal 看到的版本不一致。

因此：

- 起 server 請走 `.claude/launch.json`（在 repo 外層的 `五科/.claude/`），
  它直接指定 node 絕對路徑，不受 PATH 排序影響。
- 若要在 shell 手動跑 npm，先 `source /opt/homebrew/opt/nvm/nvm.sh && nvm use`，
  不要直接用 PATH 上的 npm。
