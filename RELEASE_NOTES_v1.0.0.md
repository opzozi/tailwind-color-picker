# Release v1.0.0 - Initial Stable Release

**Release Date:** December 18, 2025

## 🎉 First Stable Release

Tailwind Color Picker v1.0.0 is the initial stable release of a lightweight Chrome extension that helps developers pick colors from webpages and instantly find matching Tailwind CSS class names.

## ✨ Features

### Core Functionality
- **EyeDropper Integration** — Use the native browser EyeDropper API to pick colors from anywhere on your screen
- **Smart Color Matching** — Finds the nearest Tailwind CSS color using CIE Lab color space and DeltaE (1976) distance calculation
- **Dual Copy Options** — Copy the Tailwind class name (e.g., `bg-blue-500`) or the raw HEX code
- **Keyboard Shortcut** — Press `Alt+C` to open the picker window instantly
- **Last Pick Memory** — Automatically restores your last picked color when reopening

### User Experience
- **Modern UI** — Clean, dark-themed interface inspired by developer tools like Raycast and Linear
- **Toast Notifications** — Visual feedback when copying colors
- **Color Accuracy Badge** — Shows match percentage with color-coded indicators
- **Privacy First** — 100% offline, no network requests, no analytics, all processing happens locally

## 🛠️ Technical Details

- **Manifest Version:** 3
- **Permissions:** `storage` (for local data persistence only)
- **APIs Used:** EyeDropper API, Chrome Storage API, Chrome Commands API
- **No External Dependencies:** Pure vanilla JavaScript, HTML, and CSS
- **Offline First:** All processing happens locally, no network requests

## 📦 Installation

### From Chrome Web Store
Visit the [Chrome Web Store page](https://chrome.google.com/webstore) (coming soon)

### Manual Installation
1. Download the latest release
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extension directory

## 🌐 Browser Compatibility

- Chrome 95+ (EyeDropper API support required)
- Edge 95+ (Chromium-based)
- Other Chromium-based browsers with EyeDropper API support

## 🔒 Privacy

This extension:
- ✅ Processes everything locally
- ✅ Never sends data over the network
- ✅ Doesn't use analytics or tracking
- ✅ Only stores your last picked color locally (optional)
- ✅ Has no external dependencies or CDN calls

## 📝 Changelog

### 1.0.0 (2025-12-18)
- Initial release
- EyeDropper color picking
- Tailwind CSS color matching with DeltaE calculation
- Keyboard shortcut support (Alt+C)
- Dual copy functionality (class name and HEX)
- Last pick persistence
- Modern, dark-themed UI
- Full offline operation

## 🚀 What's Next?

Planned features for future releases:
- Custom Tailwind palette support
- Export functionality
- Advanced color matching features

## 💬 Feedback

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/opzozi/tailwind-color-picker/issues).

## 💰 Support

If you find this extension useful, consider supporting its development:
[Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=KSNA8YZWGMDFG)

---

**Full Changelog:** [View on GitHub](https://github.com/opzozi/tailwind-color-picker/compare/v1.0.0)

