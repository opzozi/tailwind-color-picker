import {
  TAILWIND_DEFAULT_PALETTE,
  findNearestTailwindColor,
  normalizeHex
} from "./utils/colors.js";

const $ = (id) => document.getElementById(id);

const LAST_PICK_KEY = "lastPick";

const pickBtn = $("pickBtn");
const copyBtn = $("copyBtn");
const swatch = $("swatch");
const hexOut = $("hexOut");
const twClass = $("twClass");
const matchPct = $("matchPct");
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

function loadLastPick() {
  chrome.storage.local.get(LAST_PICK_KEY, (data) => {
    if (chrome.runtime.lastError) return;
    const last = data?.[LAST_PICK_KEY];
    if (!last?.hex || !last?.className || typeof last?.matchPercent !== "number") {
      return;
    }
    setResult(last);
    setStatus("Restored last picked color.", "info");
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

async function pickColor() {
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

    showToast("Color picked!");
  } catch (err) {
    if (err && (err.name === "AbortError" || /abort/i.test(String(err)))) {
      setStatus("Cancelled.", "info");
    } else {
      setStatus(`Pick failed: ${err?.message ?? String(err)}`, "error");
    }
  } finally {
    pickBtn.disabled = false;
    pickBtn.textContent = "Pick Color";
  }
}

pickBtn.addEventListener("click", () => {
  pickColor();
});

copyBtn.addEventListener("click", async () => {
  setStatus("", "info");
  const text = twClass.textContent?.trim();
  if (!text || text === "—") return;

  copyBtn.disabled = true;
  copyBtn.dataset.state = "copied";
  const prevTitle = copyBtn.title;
  copyBtn.title = "Copied!";

  try {
    await copyToClipboard(text);
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast(`Copy failed: ${err?.message ?? String(err)}`, "error");
  } finally {
    setTimeout(() => {
      copyBtn.disabled = false;
      copyBtn.dataset.state = "idle";
      copyBtn.title = prevTitle;
    }, 650);
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

setStatus("Click “Pick Color” to sample a pixel anywhere on screen.", "info");
loadLastPick();

window.addEventListener("unload", () => {
  try {
    chrome.runtime.sendMessage({ type: "popup-closed" }, () => {
      void chrome.runtime.lastError;
    });
  } catch {
    // ignore
  }
});


