chrome.runtime.onInstalled.addListener(() => {});

const PICKER_WINDOW_ID_KEY = "pickerWindowId";
const PICKER_URL = "picker.html";

function sessionGet(key) {
  return new Promise((resolve) => chrome.storage.local.get(key, resolve));
}

function sessionSet(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
}

function sessionRemove(key) {
  return new Promise((resolve) => chrome.storage.local.remove(key, resolve));
}

function windowsCreate(createData) {
  return new Promise((resolve) => chrome.windows.create(createData, resolve));
}

function windowsUpdate(windowId, updateInfo) {
  return new Promise((resolve, reject) => {
    chrome.windows.update(windowId, updateInfo, (win) => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(win);
    });
  });
}

async function openPickerWindow() {
  const data = await sessionGet(PICKER_WINDOW_ID_KEY);
  const existingId = data?.[PICKER_WINDOW_ID_KEY];

  if (typeof existingId === "number") {
    try {
      await windowsUpdate(existingId, { focused: true });
      return;
    } catch {
      await sessionRemove(PICKER_WINDOW_ID_KEY);
    }
  }

  const win = await windowsCreate({
    url: chrome.runtime.getURL(PICKER_URL),
    type: "popup",
    width: 520,
    height: 380,
    focused: true
  });

  if (win?.id != null) {
    await sessionSet({ [PICKER_WINDOW_ID_KEY]: win.id });
  }
}

async function focusPickerWindowIfOpen() {
  const data = await sessionGet(PICKER_WINDOW_ID_KEY);
  const existingId = data?.[PICKER_WINDOW_ID_KEY];
  if (typeof existingId !== "number") return;
  try {
    await windowsUpdate(existingId, { focused: true });
  } catch {
    await sessionRemove(PICKER_WINDOW_ID_KEY);
  }
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "open-picker") {
    openPickerWindow();
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "popup-closed") {
    setTimeout(() => focusPickerWindowIfOpen(), 0);
  } else if (msg?.type === "open-picker") {
    openPickerWindow();
  }
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  try {
    const data = await sessionGet(PICKER_WINDOW_ID_KEY);
    const existingId = data?.[PICKER_WINDOW_ID_KEY];
    if (existingId === windowId) {
      await sessionRemove(PICKER_WINDOW_ID_KEY);
    }
  } catch {
    // Ignore cleanup errors
  }
});


