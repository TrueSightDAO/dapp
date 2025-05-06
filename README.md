# Cacao Bag Sales QR Scanner

This project provides a simple web-based QR code scanner (`scanner.html`) designed for members of a Decentralized Autonomous Organization (DAO) to easily share the sale of serialized bags of cacao.

## Purpose

DAO members often sell individually serialized bags of cacao. Each bag is labeled with a unique QR code that encodes a URL containing a `qr_code` parameter. The `scanner.html` tool enables members to:

- Scan the QR code on a cacao bag using their device camera.
- Extract the serialized bag identifier (`qr_code` parameter) from the scanned data.
- Generate a standardized sale message (e.g., `ABC123 – this bag of cacao just sold by me for $25.`).
- Share the sale message via the device's native share interface (on mobile) or copy it to the clipboard (on desktop).

## Usage

1. Open `scanner.html` in a modern web browser (Chrome, Firefox, Safari) with camera support.
2. Grant camera access when prompted.
3. Point the camera at the bag's QR code.
4. Click **Scan QR Code** to capture and decode the QR data.
5. If the decoded URL contains a `qr_code` parameter, it will be displayed and the **Report Sold** button will be enabled.
6. Click **Report Sold** to either:
   - Trigger the native share sheet on mobile devices.
   - Copy the sale message to the clipboard on desktop.

## Features

- Real-time video capture from the device camera.
- Automatic detection and decoding of QR codes using the [jsQR](https://github.com/cozmo/jsQR) library.
- Digital zoom controls on supported cameras.
- Mobile-friendly native sharing and desktop clipboard support.

## Requirements

- A modern browser with support for `getUserMedia` and the MediaStream APIs.
- Camera hardware (rear-facing camera recommended on mobile).
- Internet connection (to load the jsQR library from CDN) or download `jsQR.min.js` locally.

## Customization

- To adjust the predefined sale message format or price wording, edit the JavaScript snippet in `scanner.html` around the `reportButton` click handler.
- To host the tool on your own server, simply serve the project directory over HTTPS (required by most browsers for camera access).

## License

This project is licensed under the terms described in the [LICENSE](./LICENSE) file.