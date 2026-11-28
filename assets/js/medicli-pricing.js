/*
 * メディクリの料金データ（料金を変えるときは、このファイルの「料金データ」だけを書き換える）
 * 参照元：メディクリ業者様用プレゼン資料 2026年11月改訂版
 * 料金シミュレーター（dxdimix/medicri-price-simulator）の値とも必ずそろえること。
 * 表示先：services/medicli.html と index.html の data-pricing="…" が付いた場所
 */
(function () {
  'use strict';

  // ===== 料金データ ここから =====
  var LENGTHS = ['15分', '30分', '45分', '60分'];   // 完成動画の長さ
  var BASE_LENGTH_INDEX = 1;                         // カードに出す基本料金（30分）
  var TAX = '税込';                                  // 料金はすべて税込（運営者確認済み 2026-11-27）

  var PLANS = [
    {
      id: 'light', en: 'LIGHT PLAN', name: 'ライトプラン',
      catch: 'シンプルに、きれいに、使いやすく。',
      prices: [6000, 10000, 14000, 18000],
      desc: '撮影済みの動画を、記録・保存・共有・配信に適した状態に整える基本的な編集プランです。',
      items: ['動画素材の確認', '動画前後の不要部分のカット', '簡易的なトリミング', '基本的な音量調整', '簡易的な明るさ調整', 'シンプルなタイトル挿入', '動画の結合', '指定形式での動画書き出し'],
      revisions: 1,
      uses: '院内研修の記録、会議・講演会の記録、セミナー動画の保存、アーカイブ動画'
    },
    {
      id: 'standard', en: 'STANDARD PLAN', name: 'スタンダードプラン', recommend: true,
      catch: 'わかりやすく、見やすく、伝わる動画へ。',
      prices: [20000, 40000, 50000, 65000],
      desc: '詳細なカット編集やフルテロップを加え、視聴者が内容を理解しやすい動画に仕上げる、メディクリの標準プランです。',
      items: ['ライトプランの基本編集内容', '動画全体の不要部分のカット', '無音部分・言い直しの整理', '視聴しやすいテンポへの調整', 'フルテロップ（全文字幕）の挿入', 'テロップデザインの統一', 'AIによる文字起こし', '人によるテロップの確認・校正', '基本的なノイズ除去', '音量・明るさ調整', '基本的なBGMの挿入', 'シンプルなオープニング・エンディング'],
      revisions: 2,
      uses: '院内教育、医療機関の研修、社内研修、オンライン講義、業務マニュアル、eラーニング教材'
    },
    {
      id: 'premium', en: 'PREMIUM PLAN', name: 'プレミアムプラン',
      catch: '理解を深め、印象に残るコンテンツへ。',
      prices: [35000, 60000, 85000, 110000],
      desc: 'スタンダードプランの内容に加え、画像・図解・アニメーションなどを活用し、教育効果を意識した動画を制作する上位プランです。',
      items: ['スタンダードプランの基本編集内容', '動画構成・演出のブラッシュアップ', '画像・イラストの挿入', 'オリジナル図解・イラストの作成', 'PowerPointなどの提供資料の挿入', '視覚的な強調表現', 'アニメーション効果', 'トランジション・エフェクト', 'BGM・効果音による演出', 'テロップデザインの高度化', 'オープニング・エンディングの強化', '全体のデザイン・トーンの統一'],
      revisions: 3,
      uses: '医療手技の教育動画、医療機器の操作説明、医療安全・感染対策研修、新人教育、本格的な研修教材、製品紹介、採用・広報動画'
    }
  ];

  // サービス比較表（true=含む、false=含まない、文字列=そのまま表示）。並びは ライト／スタンダード／プレミアム
  var COMPARE = [
    ['動画素材の確認・書き出し', true, true, true],
    ['動画前後の簡易カット', true, true, true],
    ['動画全体の詳細カット', false, true, true],
    ['音量・明るさ調整', true, true, true],
    ['タイトル挿入', true, true, true],
    ['AI文字起こしの活用', false, true, true],
    ['フルテロップ', false, true, true],
    ['テロップの確認・校正', false, true, true],
    ['ノイズ除去', false, true, true],
    ['基本的なBGM', false, true, true],
    ['AIナレーション', 'オプション', 'オプション', 'オプション'],
    ['オープニング・エンディング', '簡易タイトル', '基本仕様', 'デザイン強化'],
    ['画像・イラスト・提供資料の挿入', false, false, true],
    ['オリジナル図解・イラスト作成', false, false, true],
    ['アニメーション・エフェクト', false, false, true],
    ['構成・演出のブラッシュアップ', false, false, true],
    ['修正対応', '1回', '2回', '3回']
  ];

  var OPTIONS = [
    ['サムネイル作成', '¥3,000／枚'],
    ['AIナレーション', '¥3,000〜¥10,000'],
    ['ショート動画への再編集', '¥5,000〜／本'],
    ['撮影サービス', '個別見積もり'],
    ['高度なアニメーション制作', '個別見積もり'],
    ['その他特殊編集', '個別見積もり']
  ];

  var SURCHARGES = [
    ['3カメラ以上の編集', '基本料金の20％増'],
    ['特急納品', '基本料金の30％増'],
    ['規定回数を超える修正', '¥3,000／回'],
    ['元素材の超過分', '¥5,000〜／30分']
  ];
  // ===== 料金データ ここまで =====

  function yen(n) { return '¥' + n.toLocaleString('ja-JP'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var ICONS = document.documentElement.getAttribute('data-icons') || '../assets/img/icons.svg';
  function icon(id) { return '<svg class="icon" aria-hidden="true"><use href="' + ICONS + '#' + id + '"/></svg>'; }

  function renderPlans(el) {
    var contact = el.getAttribute('data-contact') || '../contact.html?service=medicli';
    el.innerHTML = PLANS.map(function (p) {
      return '<article class="plan' + (p.recommend ? ' recommend' : '') + '" aria-labelledby="plan-' + p.id + '">' +
        (p.recommend ? '<span class="plan-badge">おすすめ</span>' : '') +
        '<div class="plan-en">' + esc(p.en) + '</div>' +
        '<h3 id="plan-' + p.id + '">' + esc(p.name) + '</h3>' +
        '<p class="plan-catch">' + esc(p.catch) + '</p>' +
        '<p class="price">' + yen(p.prices[BASE_LENGTH_INDEX]) + '<small>（' + TAX + '）／完成動画' + LENGTHS[BASE_LENGTH_INDEX] + '</small></p>' +
        '<p class="plan-desc">' + esc(p.desc) + '</p>' +
        '<h4>主な編集内容</h4>' +
        '<ul class="items">' + p.items.map(function (i) { return '<li>' + icon('i-check') + '<span>' + esc(i) + '</span></li>'; }).join('') + '</ul>' +
        '<p class="revise">修正対応：' + p.revisions + '回まで</p>' +
        '<div class="uses"><strong>おすすめの用途</strong>' + esc(p.uses) + '</div>' +
        '<a class="btn' + (p.recommend ? '' : ' btn-outline') + '" href="' + contact + '&amp;plan=' + p.id + '">このプランで相談する</a>' +
        '</article>';
    }).join('');
  }

  function renderLengthTable(el) {
    var head = '<thead><tr><th scope="col">プラン</th>' + LENGTHS.map(function (l) { return '<th scope="col">' + l + '</th>'; }).join('') + '</tr></thead>';
    var body = '<tbody>' + PLANS.map(function (p) {
      return '<tr' + (p.recommend ? ' class="col-rec"' : '') + '><th scope="row">' + esc(p.name.replace('プラン', '')) + '</th>' +
        p.prices.map(function (v) { return '<td class="num">' + yen(v) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';
    el.innerHTML = '<caption>完成動画の長さ別料金（' + TAX + '）</caption>' + head + body;
  }

  function renderCompare(el) {
    var head = '<thead><tr><th scope="col">サービス内容</th>' + PLANS.map(function (p) {
      return '<th scope="col"' + (p.recommend ? ' class="col-rec"' : '') + '>' + esc(p.name.replace('プラン', '')) + '</th>';
    }).join('') + '</tr></thead>';
    var body = '<tbody>' + COMPARE.map(function (row) {
      return '<tr><th scope="row">' + esc(row[0]) + '</th>' + row.slice(1).map(function (v, i) {
        var cls = PLANS[i].recommend ? ' class="col-rec"' : '';
        if (v === true) return '<td' + cls + '><span class="yes" aria-label="含む">○</span></td>';
        if (v === false) return '<td' + cls + '><span class="no" aria-label="含まない">―</span></td>';
        return '<td' + cls + '>' + esc(v) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    el.innerHTML = '<caption>サービス比較表</caption>' + head + body;
  }

  function renderSimple(el, rows, caption) {
    el.innerHTML = '<caption>' + esc(caption) + '（' + TAX + '）</caption><thead><tr><th scope="col">サービス</th><th scope="col">料金</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td class="num">' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody>';
  }

  function render() {
    document.querySelectorAll('[data-pricing]').forEach(function (el) {
      var kind = el.getAttribute('data-pricing');
      if (kind === 'plans') renderPlans(el);
      else if (kind === 'lengths') renderLengthTable(el);
      else if (kind === 'compare') renderCompare(el);
      else if (kind === 'options') renderSimple(el, OPTIONS, '追加制作');
      else if (kind === 'surcharges') renderSimple(el, SURCHARGES, '割増・追加料金');
      // トップページ用：いちばん安い料金（ライトプランの最短の長さ）を表示する
      else if (kind === 'from') el.textContent = yen(PLANS[0].prices[0]);
      else if (kind === 'from-unit') el.textContent = '（' + TAX + '）から／完成動画' + LENGTHS[0] + '・' + PLANS[0].name;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
