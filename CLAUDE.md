# dxdimix-website

## 何をするものか
個人事業 DXDIMIX の公式ホームページ（https://dxdimix.com）。
以前は Canva で作成・公開していたものを、このリポジトリで管理する形に移した。
掲載サービスは 2 つ。
- メディクリ：医療機関向けの動画編集サービス
- NOTYCE：医療機器管理システム

## どこで動くか
- 公開：GitHub Pages（リポジトリ `dxdimix/dxdimix-website` の `main` ブランチ直下をそのまま公開）
- 独自ドメイン：`CNAME` ファイルに `dxdimix.com` を記載。DNS は Squarespace で管理（Google Workspace のメールと Vercel の別アプリのレコードも同居しているので、触るのは A `@` と CNAME `www` だけ）。詳細は `docs/公開手順.md`
- HTTPS：GitHub Pages の「Enforce HTTPS」を有効化済み
- ローカル：デスクトップ PC の `C:\Users\sike1\dev\dxdimix-website`
- ビルド工程なし。HTML と CSS をそのまま置いている

## ファイル構成
| パス | 内容 |
|---|---|
| `index.html` | トップページ |
| `services/medicli.html` | メディクリ紹介 |
| `services/notyce.html` | NOTYCE 紹介 |
| `about.html` | 事業者情報 |
| `contact.html` | お問い合わせ |
| `404.html` | ページが見つからない時の表示 |
| `assets/css/style.css` | 全ページ共通のデザイン。色は先頭の `:root` で変更 |
| `assets/img/` | 画像置き場 |
| `CNAME` | 独自ドメイン設定（消さないこと） |
| `.nojekyll` | GitHub Pages の自動変換を止める指定（消さないこと） |

## 編集ルール
- ヘッダーとフッターは各 HTML に同じものを書いている。メニューを変える時は全ページ（404.html を含む）を揃えて直す。
- `services/` 配下のページは CSS や他ページへのパスに `../` が付く。
- まだ中身が決まっていない箇所は `<span class="todo">（…）</span>`（黄色表示）にしている。本文が決まったら span ごと置き換える。`grep -rn 'class="todo"' .` で残りを確認できる。
- 文章は比喩や気取った言い回しを避け、具体的に書く。
- `main` に push すると 1〜2 分で本番に反映される。大きな変更はブランチを切って確認してから `main` に入れる。

## 確認方法
ローカルで表示を見る：`python3 -m http.server 8000` を実行し、ブラウザで http://localhost:8000 を開く。

## ログ
- サーバーのログはない（GitHub Pages のため）。
- 公開処理の結果：GitHub の リポジトリ → Actions タブ（「pages build and deployment」）。
- 変更履歴：`git log`。
- ドメイン・HTTPS の状態：リポジトリ → Settings → Pages。
