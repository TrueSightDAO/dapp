# TrueSight DAO DApp

This repository contains decentralized application (DApp) tools for TrueSight DAO members. The initial initiative is the Agroverse cacao circles, providing web-based utilities to manage serialized cacao bags, scan QR codes, and share sale information seamlessly.

## Modules

### [Serialized Cacao Bag Scanner](./scanner.html)
QR Code Scanner


The QR Code Scanner provides DAO members with the ability to:

- Scan the QR code on a cacao bag using the device camera.
- Extract the bag’s unique identifier (`qr_code` parameter) from the scanned URL.
- Generate a standardized sale message (e.g., `ABC123 – this bag of cacao just sold by me for $25.`).
- Share the sale/stock check message via native share (mobile) or clipboard copy (desktop) to our Town Hall channel on WhatsApp.

#### Usage

1. Open [our scanner](./scanner.html) in a modern browser (Chrome, Firefox, Safari) with camera support.
2. Grant camera access when prompted.
3. Point the camera at the QR code on the serialized cacao bag.
4. Click **Scan QR Code**.
5. Once the `qr_code` parameter is detected, it appears on screen and enables **Report Sold**.
6. Click **Report Sold** to share or copy the sale message.


## Future Modules

- Inventory movement reporting
- Contributions reporting for $TDG awards

## License

This project is licensed under the terms in the [LICENSE](./LICENSE) file.
