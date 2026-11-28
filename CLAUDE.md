# dxdimix-website

## 何をするものか
DimiX の公式ホームページ（https://dxdimix.com）。
以前は Canva で作成・公開していたものを、このリポジトリで管理する形に移した。
掲載サービスは 2 つ。中心は NOTYCE。
- NOTYCE（ノーティス）：医療機器管理システム。表記は常に大文字「NOTYCE」
- メディクリ（Medical Creator）：医療特化型動画編集サービス

## どこで動くか
- 公開：GitHub Pages（リポジトリ `dxdimix/dxdimix-website` の `main` ブランチ直下をそのまま公開）
- 独自ドメイン：`CNAME` ファイルに `dxdimix.com` を記載。DNS は Squarespace で管理（Google Workspace のメールと Vercel の別アプリのレコードも同居しているので、触るのは A `@` と CNAME `www` だけ）。詳細は `docs/公開手順.md`
- HTTPS：GitHub Pages の「Enforce HTTPS」を有効化済み
- ローカル：デスクトップ PC は `C:\Users\sike1\dev\dxdimix-website`、ノート PC（KnotePC）は `C:\Users\sike1\dxdimix-website`
- ビルド工程なし。HTML・CSS・少しの JS をそのまま置いている

## ファイル構成
| パス | 内容 |
|---|---|
| `index.html` | トップ（NOTYCE のメインメッセージ → NOTYCE 紹介 → メディクリ紹介 → 会社情報への導線） |
| `services/notyce.html` | NOTYCE 専用ページ（概要／主要機能3つ／対象／導入の流れ）。料金欄は設けない方針 |
| `services/medicli.html` | メディクリ専用ページ（11 セクション。料金表は JS で表示） |
| `about.html` | 会社情報 |
| `contact.html` | お問い合わせ（メール。`?service=notyce|medicli&plan=light|standard|premium` で件名と本文のひな形が入る） |
| `404.html` | ページが見つからない時の表示（パスは `/` 始まり） |
| `assets/css/style.css` | 全ページ共通のデザイン。色・文字・余白・角丸・影は先頭の `:root` のトークンで管理。考え方とルールは `docs/デザインシステム.md` |
| `assets/js/site.js` | 全ページ共通の動き（スマホのメニュー開閉、スクロールで表示、スマホ下部の固定ボタン、ページ内目次の現在地） |
| `assets/js/medicli-pricing.js` | **メディクリの料金はここだけで管理**（プラン・長さ別料金・比較表・オプション・割増） |
| `assets/img/icons.svg` | 線のアイコン集（`<use href="…icons.svg#i-bell"/>` で使う） |
| `assets/img/` | ロゴ（DimiX・メディクリ・NOTYCE）。NOTYCE の元データは OneDrive `医療機器メンテ代行事業/NOTYCE_brand_kit` |
| `CNAME` | 独自ドメイン設定（消さないこと） |
| `.nojekyll` | GitHub Pages の自動変換を止める指定（消さないこと） |

## 書いてよいこと・いけないこと（必ず守る）
- NOTYCE：ISO/IEC 27001 は「管理策に沿って設計・運用」まで。**第三者認証の取得とは書かない**。効果の断定・誇大表現はしない。「患者情報は保存しない設計」は書いてよい。
- メディクリ：料金・追加料金・修正回数は資料（2026年11月改訂版）から変えない。**税込／税別、具体的な納期日数は運営者の確認なしに書かない**。実在しない実績・利用者数・お客様の声は載せない。LMS など資料にないサービスは足さない。
- メディクリの料金は料金シミュレーター（`dxdimix/medicri-price-simulator`）とそろえる。
- 文章は比喩や気取った言い回しを避け、具体的に書く。

## 編集ルール
- ヘッダーとフッターは各 HTML に同じものを書いている。メニューを変える時は全ページ（404.html を含む）を揃えて直す。スマホ用の `header-cta`（ロゴ横のお問い合わせボタン）と、メニューボタン（`.menu-btn`）も忘れずに。
- 新しい色・影・角丸を直接書かない。`docs/デザインシステム.md` のトークンとコンポーネントを使う。
- 見出しは「、」「。」ごとに `<span class="ib">` で包む（語の途中で改行しないため）。
- `services/` 配下のページは CSS や他ページへのパスに `../` が付く。
- まだ中身が決まっていない箇所は `<span class="todo">（…）</span>`（黄色表示）にする。`grep -rn 'class="todo"' .` で残りを確認できる。
- `main` に push すると 1〜2 分で本番に反映される。大きな変更はブランチを切って確認してから `main` に入れる。

## 確認方法
ローカルで表示を見る：`python -m http.server 8765` を実行し、ブラウザで http://localhost:8765 を開く。
（`404.html` は GitHub Pages 上でだけ使われる。ローカルの存在しない URL では Python の 404 が出る）

## ログ
- サーバーのログはない（GitHub Pages のため）。
- 公開処理の結果：GitHub の リポジトリ → Actions タブ（「pages build and deployment」）。
- 変更履歴：`git log`。進み具合：`PROGRESS.md`。
- ドメイン・HTTPS の状態：リポジトリ → Settings → Pages。
