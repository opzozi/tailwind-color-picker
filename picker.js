import {
  TAILWIND_DEFAULT_PALETTE,
  findNearestTailwindColor,
  normalizeHex
} from "./utils/colors.js";

const $ = (id) => document.getElementById(id);

const LAST_PICK_KEY = "lastPick";
const HISTORY_KEY = "pickHistory";
const HISTORY_LIMIT = 5;

const historyListEl = $("historyList");
const clearHistoryBtn = $("clearHistory");

let history = [];

const pickBtn = $("pickBtn");
const copyBtn = $("copyBtn");
const swatch = $("swatch");
const hexOut = $("hexOut");
const twClass = $("twClass");
const matchPct = $("matchPct");
const rgbOut = $("rgbOut");
const hslOut = $("hslOut");
const statusEl = $("status");
const toastEl = $("toast");

function setStatus(message, type = "info") {
  statusEl.textContent = message || "";
  statusEl.classList.toggle("error", type === "error");
}

function showToast(message, variant = "success") {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.className = `toast ${variant}`;
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2000);
}

function setResult({ hex, className, matchPercent }) {
  const norm = normalizeHex(hex);
  swatch.style.background = norm;
  hexOut.textContent = norm.toUpperCase();

  const rgb = hexToRgb(norm);
  if (rgb) {
    rgbOut.textContent = `${rgb.r},${rgb.g},${rgb.b}`;
    const hsl = rgbToHsl(rgb);
    hslOut.textContent = `${hsl.h}°,${hsl.s}%,${hsl.l}%`;
  } else {
    rgbOut.textContent = "—";
    hslOut.textContent = "—";
  }

  twClass.textContent = className;
  matchPct.textContent = `${matchPercent.toFixed(1)}%`;
  matchPct.dataset.tone = matchPercent >= 99.95 ? "good" : "warn";

  copyBtn.disabled = false;
  copyBtn.dataset.state = "idle";
  copyBtn.title = "Copy class";
}

function saveLastPick({ hex, className, matchPercent }) {
  chrome.storage.local.set(
    {
      [LAST_PICK_KEY]: {
        hex: normalizeHex(hex),
        className,
        matchPercent,
        savedAt: Date.now()
      }
    },
    () => {
      if (chrome.runtime.lastError) {
        // Silently fail - not critical
      }
    }
  );
}

function saveHistoryEntry(entry) {
  const deduped = [entry, ...history].filter(
    (item, idx, arr) =>
      arr.findIndex((x) => x.hex === item.hex && x.className === item.className) === idx
  );
  history = deduped.slice(0, HISTORY_LIMIT);
  chrome.storage.local.set({ [HISTORY_KEY]: history }, () => {
    void chrome.runtime.lastError;
  });
  renderHistory();
}

function renderHistory() {
  if (!historyListEl) return;
  historyListEl.innerHTML = "";
  if (!history.length) {
    const p = document.createElement("p");
    p.className = "history-empty";
    p.textContent = "No history yet.";
    historyListEl.appendChild(p);
    return;
  }

  for (const item of history) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "history-item";
    row.title = "Restore this pick";
    row.addEventListener("click", () => {
      setResult(item);
      saveLastPick(item);
      setStatus("Restored from history.", "info");
    });

    const sw = document.createElement("div");
    sw.className = "history-swatch";
    sw.style.background = item.hex;

    const txt = document.createElement("div");
    txt.className = "history-text";

    const cls = document.createElement("div");
    cls.className = "history-class";
    cls.textContent = item.className;

    const hex = document.createElement("div");
    hex.className = "history-hex";
    hex.textContent = item.hex.toUpperCase();

    txt.appendChild(cls);
    txt.appendChild(hex);

    row.appendChild(sw);
    row.appendChild(txt);
    historyListEl.appendChild(row);
  }
}

function loadHistory() {
  chrome.storage.local.get(HISTORY_KEY, (data) => {
    if (chrome.runtime.lastError) return;
    const list = Array.isArray(data?.[HISTORY_KEY]) ? data[HISTORY_KEY] : [];
    history = list.slice(0, HISTORY_LIMIT);
    renderHistory();
  });
}

function loadLastPick() {
  chrome.storage.local.get(LAST_PICK_KEY, (data) => {
    if (chrome.runtime.lastError) return;
    const last = data?.[LAST_PICK_KEY];
    if (!last?.hex || !last?.className || typeof last?.matchPercent !== "number") {
      return;
    }
    setResult(last);
  });
}

async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

async function setCopiedUI() {
  copyBtn.dataset.state = "copied";
  const prevTitle = copyBtn.title;
  copyBtn.title = "Copied!";
  setTimeout(() => {
    copyBtn.dataset.state = "idle";
    copyBtn.title = prevTitle;
  }, 650);
}

async function autoCopyClass() {
  const text = twClass.textContent?.trim();
  if (!text || text === "—") return;
  try {
    await copyToClipboard(text);
    await setCopiedUI();
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  }
}

async function pickColor({ source = "manual" } = {}) {
  setStatus("", "info");

  if (!("EyeDropper" in window)) {
    setStatus("EyeDropper API not available in this browser.", "error");
    return;
  }

  pickBtn.disabled = true;
  pickBtn.textContent = "Picking…";

  try {
    const eyeDropper = new EyeDropper();
    const { sRGBHex } = await eyeDropper.open();

    const match = findNearestTailwindColor(sRGBHex, TAILWIND_DEFAULT_PALETTE, {
      prefix: "bg",
      maxDeltaEFor100: 100
    });

    setResult({
      hex: match.inputHex,
      className: match.className,
      matchPercent: match.matchPercent
    });
    saveLastPick({
      hex: match.inputHex,
      className: match.className,
      matchPercent: match.matchPercent
    });
    saveHistoryEntry({
      hex: normalizeHex(match.inputHex),
      className: match.className,
      matchPercent: match.matchPercent
    });

    if (source !== "manual") {
      setStatus("Picked.", "info");
    }

    await autoCopyClass();
  } catch (err) {
    if (err && (err.name === "AbortError" || /abort/i.test(String(err)))) {
      setStatus("Cancelled.", "info");
    } else {
      const msg = err?.message ?? String(err);
      if (/gesture|user activation|user/i.test(msg)) {
        setStatus("Press Enter (or click Pick Color) to start the eyedropper.", "info");
      } else {
        setStatus(`Pick failed: ${msg}`, "error");
      }
    }
  } finally {
    pickBtn.disabled = false;
    pickBtn.textContent = "Pick Color";
  }
}

pickBtn.addEventListener("click", () => pickColor({ source: "manual" }));

rgbOut.addEventListener("click", async () => {
  const rgb = rgbOut.textContent?.trim();
  if (!rgb || rgb === "—") return;
  try {
    await copyToClipboard(rgb);
    showToast(`Copied: ${rgb}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  }
});

hslOut.addEventListener("click", async () => {
  const hsl = hslOut.textContent?.trim();
  if (!hsl || hsl === "—") return;
  try {
    await copyToClipboard(hsl);
    showToast(`Copied: ${hsl}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  }
});

copyBtn.addEventListener("click", async () => {
  setStatus("", "info");
  const text = twClass.textContent?.trim();
  if (!text || text === "—") return;

  copyBtn.disabled = true;
  try {
    await copyToClipboard(text);
    await setCopiedUI();
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  } finally {
    setTimeout(() => {
      copyBtn.disabled = false;
    }, 250);
  }
});

hexOut.addEventListener("click", async () => {
  const hex = hexOut.textContent?.trim();
  if (!hex || hex === "—") return;
  try {
    await copyToClipboard(hex);
    showToast(`Copied: ${hex}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  }
});

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    history = [];
    chrome.storage.local.remove(HISTORY_KEY, () => {
      void chrome.runtime.lastError;
      renderHistory();
    });
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (!pickBtn.disabled) pickColor({ source: "hotkey" });
  }
});

function loadVersion() {
  const versionEl = document.getElementById("version");
  if (!versionEl) return;
  const manifest = chrome.runtime.getManifest();
  if (manifest?.version) {
    versionEl.textContent = `v${manifest.version}`;
  }
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return null;
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16)
  };
}

function rgbToHsl({ r, g, b }) {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r1:
        h = (g1 - b1) / d + (g1 < b1 ? 6 : 0);
        break;
      case g1:
        h = (b1 - r1) / d + 2;
        break;
      default:
        h = (r1 - g1) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

setStatus("Press Enter (or click Pick Color) to start.", "info");
loadLastPick();
loadHistory();
loadVersion();


