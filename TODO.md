# TODO

## microCMS 接続の安定性改善

### 現状
- ビルド時に microCMS API への接続が不安定（ローカル環境のみ）
- リトライ機能（最大3回、1秒間隔）を実装済み → 成功率は改善
- 原因: ローカルのネットワーク環境（AdGuard 等）の影響が大きい

### 対応方針
- **現在の自作ローダー + リトライで継続**
  - 自作することで Astro Content Layer と microCMS SDK の理解を深める
  - デプロイ環境では問題が発生しない可能性が高い
- デプロイ後も問題が続く場合のみ、追加対策を検討
  - `customRequestInit` でタイムアウト調整
  - リトライ回数・待機時間の調整

### 参考（将来の選択肢）
- `microcms-astro-loader`: Astro 向け microCMS ローダー（内部は同じ SDK を使用）
  - https://github.com/morinokami/microcms-astro-loader

### クリーンアップ
- [ ] デバッグログを削除（`src/content.config.ts` 4-8行目の環境変数確認ログ）
- [ ] デプロイ安定後、リトライ機能の要否を再評価
