# Tailwind Color Picker

A lightweight Chrome extension that picks colors from any webpage and instantly finds the closest matching Tailwind CSS class name. Fully offline, private, and built with Manifest V3.

## Features

- **EyeDropper Integration** — Use the native browser EyeDropper API to pick colors from anywhere on your screen
- **Smart Color Matching** — Finds the nearest Tailwind CSS color using CIE Lab color space and DeltaE (1976) distance calculation
- **Dual Copy Options** — Copy the Tailwind class name (e.g., `bg-blue-500`) or the raw HEX code
- **Keyboard Shortcut** — Press `Alt+C` to open the picker window instantly
- **Last Pick Memory** — Automatically restores your last picked color when reopening
- **Privacy First** — 100% offline, no network requests, no analytics, all processing happens locally
- **Modern UI** — Clean, dark-themed interface inspired by developer tools like Raycast and Linear

## Installation

### From Chrome Web Store

1. Visit the [Chrome Web Store page](https://chromewebstore.google.com/detail/tailwind-color-picker/iijbeejepebedocldehadgofaejcmbla?hl=hu&utm_source=ext_sidebar)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the extension directory

## Usage

### Basic Usage

1. Click the extension icon in your toolbar
2. Click "Pick Color" in the popup
3. Click anywhere on your screen to sample a color
4. The extension displays:
   - The picked HEX color
   - The closest Tailwind CSS class (e.g., `bg-indigo-300`)
   - Match accuracy percentage
5. Click the copy icon to copy the class name, or click the HEX code to copy the color value

### Keyboard Shortcut

Press `Alt+C` to open a dedicated picker window. This window can be moved around and won't block content on the page you're working with.

## How It Works

The extension uses the EyeDropper API to sample pixel colors, then compares them against the full Tailwind CSS default palette using color distance calculations:

- Colors are converted to CIE Lab color space for perceptual accuracy
- DeltaE (1976) distance is calculated between the picked color and each Tailwind color
- The closest match is selected and displayed with a match percentage

The palette is swappable, making it easy to support custom Tailwind configurations in the future.

## Technical Details

- **Manifest Version:** 3
- **Permissions:** `storage` (for local data persistence only)
- **APIs Used:** EyeDropper API, Chrome Storage API, Chrome Commands API
- **No External Dependencies:** Pure vanilla JavaScript, HTML, and CSS
- **Offline First:** All processing happens locally, no network requests

## Browser Compatibility

- Chrome 95+ (EyeDropper API support required)
- Edge 95+ (Chromium-based)
- Other Chromium-based browsers with EyeDropper API support

## Privacy

This extension:
- ✅ Processes everything locally
- ✅ Never sends data over the network
- ✅ Doesn't use analytics or tracking
- ✅ Only stores your last picked color locally (optional)
- ✅ Has no external dependencies or CDN calls

## Development

### Project Structure

```
_color-picker/
├── manifest.json       # Extension manifest
├── background.js       # Service worker
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic
├── picker.html         # Standalone picker window
├── picker.js           # Picker window logic
├── styles.css          # Shared styles
├── icons/              # Extension icons
└── utils/
    └── colors.js       # Tailwind palette and color matching logic
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

If you find this extension useful, consider supporting its development:

[Donate via PayPal](https://www.paypal.com/donate/?hosted_button_id=KSNA8YZWGMDFG)

## Changelog

### 1.0.0 (2025-12-18)

- Initial release
- EyeDropper color picking
- Tailwind CSS color matching with DeltaE calculation
- Keyboard shortcut support (Alt+C)
- Dual copy functionality (class name and HEX)
- Last pick persistence
- Modern, dark-themed UI
- Full offline operation

