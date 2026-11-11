/* 選手日誌（journal-data.js）
 *
 * 新增一筆紀錄：把物件加到 WX_JOURNAL 陣列「最前面」（新的在上）。
 * 首頁「最新動態」會自動顯示最新 3 筆；完整內容在 journal.html。
 *
 * 欄位說明：
 *   id     必填，頁內錨點，建議用日期，例如 "2026-11-10"
 *          （對應連結 journal.html#2026-11-10）
 *   date   必填，顯示日期，例如 "2026/11/10"
 *   tag    必填，標籤，例如 "選手訓練"
 *   title  必填，標題
 *   text   必填，內文（首頁卡片只顯示一行）
 *   photos 選填，照片陣列：{ src, alt, width, height }
 *          src 路徑相對網站根目錄，例如 "images/news/2026-11-10-trowel.jpg"
 *          首頁卡片使用第一張作為代表照片
 *   videos 選填，影片陣列：{ src, poster, type }，會顯示在該則照片下方
 *
 * 名次請用阿拉伯數字；「茒」請維持原寫法，勿改偏旁。
 */
(function (global) {
  const JOURNAL = [
    {
      id: "2026-11-11",
      date: "2026/11/11",
      tag: "工科賽",
      title: "工科賽選手拍攝",
      text: "工科賽選手拍攝。",
      photos: [
        {
          src: "images/news/2026-11-11-filming-wall.jpg",
          alt: "工科賽選手拍攝：攝影師與選手在牆邊",
          width: 960,
          height: 1280
        },
        {
          src: "images/news/2026-11-11-filming-line.jpg",
          alt: "工科賽選手拍攝：兩位選手蹲著拉線",
          width: 960,
          height: 1280
        },
        {
          src: "images/news/2026-11-11-filming-monitor.jpg",
          alt: "工科賽選手拍攝：監視螢幕",
          width: 1140,
          height: 1520
        }
      ],
      videos: []
    },
    {
      id: "2026-11-10",
      date: "2026/11/10",
      tag: "選手訓練",
      title: "115 學年度第二屆選手訓練",
      text: "工場進行砌磚訓練：學長示範拌漿、撥漿、置漿技巧，選手以水平尺及捲尺砌磚 3×10。",
      photos: [
        {
          src: "images/news/2026-11-10-trowel.jpg",
          alt: "砌磚練習：學長示範拌漿、撥漿、置漿技巧",
          width: 900,
          height: 1200
        },
        {
          src: "images/news/2026-11-10-level.jpg",
          alt: "選手以水平尺與捲尺校正磚列",
          width: 900,
          height: 1200
        }
      ],
      videos: []
    }
  ];

  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function sortKey(entry) {
    const m = String(entry.id || entry.date || "").match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})?/);
    if (!m) return 0;
    return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3] || 1));
  }

  function getEntries() {
    return JOURNAL.slice().sort(function (a, b) { return sortKey(b) - sortKey(a); });
  }

  function monthLabel(entry) {
    const m = String(entry.id || entry.date || "").match(/(\d{4})\D?(\d{1,2})/);
    if (!m) return "其他";
    return m[1] + " 年 " + String(Number(m[2])) + " 月";
  }

  function photoUrl(src) {
    return esc(src || "");
  }

  function renderHomeNews(rail) {
    if (!rail) return;
    const entries = getEntries().slice(0, 3);
    const parts = entries.map(function (e) {
      const photo = (e.photos && e.photos[0]) || null;
      const href = "journal.html#" + encodeURIComponent(e.id);
      const frame = photo
        ? '<div class="wx-ph"><div class="pt" role="img" aria-label="' + esc(photo.alt || e.title) + '" style="background-image:url(\'' + photoUrl(photo.src) + '\')"></div></div>'
        : "";
      return '<a class="wx-card" href="' + esc(href) + '">' +
        frame +
        '<div class="wx-ct" style="border-top:2px solid var(--wx-teal)">' +
        '<span class="wx-eye">' + esc(e.tag) + "</span>" +
        "<h3>" + esc(e.title) + "</h3>" +
        '<p class="wx-card-line">' + esc(e.text) + "</p>" +
        '<div class="wx-date">' + esc(e.date) + "</div>" +
        "</div></a>";
    });
    parts.push(
      '<a class="wx-card wx-card-more" href="journal.html">' +
      '<div class="wx-ph wx-ph-more"><span>看完整選手日誌 →</span></div>' +
      '<div class="wx-ct" style="border-top:2px solid var(--wx-teal)">' +
      '<span class="wx-eye">選手日誌</span>' +
      "<h3>看完整選手日誌 →</h3>" +
      "</div></a>"
    );
    rail.innerHTML = parts.join("");
  }

  function renderMedia(entry) {
    const photos = entry.photos || [];
    const videos = (entry.videos || []).filter(function (v) { return v && v.src; });
    if (!photos.length && !videos.length) return "";
    let html = '<div class="wx-news-media">';
    if (photos.length) {
      html += '<div class="wx-news-photos">';
      photos.forEach(function (p) {
        const wh = (p.width ? ' width="' + Number(p.width) + '"' : "") +
                   (p.height ? ' height="' + Number(p.height) + '"' : "");
        html += '<img src="' + photoUrl(p.src) + '" alt="' + esc(p.alt || "") + '"' + wh + ' loading="lazy">';
      });
      html += "</div>";
    }
    videos.forEach(function (v) {
      const poster = v.poster ? ' poster="' + photoUrl(v.poster) + '"' : "";
      const type = v.type || "video/mp4";
      html += '<video controls playsinline preload="metadata"' + poster + ">" +
        '<source src="' + photoUrl(v.src) + '" type="' + esc(type) + '">' +
        "</video>";
    });
    html += "</div>";
    return html;
  }

  function renderJournal(mount) {
    if (!mount) return;
    const entries = getEntries();
    if (!entries.length) {
      mount.innerHTML = '<p class="wx-jempty">尚無日誌紀錄。</p>';
      return;
    }
    let html = "";
    let currentMonth = null;
    entries.forEach(function (e) {
      const month = monthLabel(e);
      if (month !== currentMonth) {
        if (currentMonth !== null) html += "</div>";
        html += '<div class="wx-jmonth"><h2 class="wx-jmonth-h">' + esc(month) + "</h2>";
        currentMonth = month;
      }
      html += '<article class="wx-jentry" id="' + esc(e.id) + '">' +
        '<div class="wx-ct" style="border-top:2px solid var(--wx-teal)">' +
        '<span class="wx-eye">' + esc(e.tag) + "</span>" +
        "<h3>" + esc(e.title) + "</h3>" +
        '<div class="wx-date">' + esc(e.date) + "</div>" +
        "<p>" + esc(e.text) + "</p>" +
        "</div>" +
        renderMedia(e) +
        "</article>";
    });
    if (currentMonth !== null) html += "</div>";
    mount.innerHTML = html;
  }

  global.WX_JOURNAL = JOURNAL;
  global.WX = global.WX || {};
  global.WX.getEntries = getEntries;
  global.WX.renderHomeNews = renderHomeNews;
  global.WX.renderJournal = renderJournal;
})(window);
