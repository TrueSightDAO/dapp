# TrueSight DAO DApp

<div align="center">
  <img height="200px" src="https://github.com/TrueSightDAO/.github/blob/main/assets/20240612_truesight_dao_logo_square.png?raw=true" alt="TrueSight DAO Logo"/>
</div>

This repository contains decentralized application (DApp) tools for TrueSight DAO members. The initial initiative is the Agroverse cacao circles, providing web-based utilities to manage serialized cacao bags, scan QR codes, and share sale information seamlessly.

## Modules

### [Digital Signature Creator](./create_signature.html)
Secure digital identity management:

The Digital Signature Creator enables DAO members to:
- Generate a unique cryptographic key pair for identity verification
- Securely store keys in the browser's local storage
- Register their public key with the DAO community
- Manage their digital identity for DAO operations

#### Usage
1. Open [Digital Signature Creator](./create_signature.html) in a modern browser
2. Click **Create Digital Signature** to generate your cryptographic identity
3. Securely store your private key (never share this)
4. Click **Register It with Our Community** to share your public key
5. Use your digital signature to authenticate with other DAO tools

### [Voting Rights Cash Out](./withdraw_voting_rights.html)
Voting rights management and exchange:

This tool allows DAO members to:
- View their current voting rights balance
- Check the current value per voting right
- Submit requests to exchange voting rights for other assets
- Generate signed withdrawal requests for community verification

#### Usage
1. Open [Voting Rights Cash Out](./withdraw_voting_rights.html) in a modern browser
2. The system automatically verifies your digital signature
3. View your available voting rights and current valuation
4. Enter the amount of voting rights you wish to cash out
5. Specify your asking price
6. Click **Submit Request** to generate a signed withdrawal message
7. Share the request with the DAO community via your preferred channel

### [Withdrawal Request Verifier](./verify_request.html)
Verify authenticity of withdrawal requests:

The Withdrawal Request Verifier allows DAO members to:
- Verify the authenticity of a voting rights withdrawal request
- Check if the digital signature matches the request details
- Confirm the signature belongs to a registered DAO member
- View member details and transaction information

#### Usage
1. Open [Withdrawal Request Verifier](./verify_request.html) in a modern browser
2. Paste the complete withdrawal request (including digital signature and transaction ID) into the provided textarea
3. Click **Check Request** to verify the request
4. Review the verification results, including member name, signature status, and transaction details
5. Note that verification confirms authenticity but does not approve the request

### [Serialized Cacao Bag Scanner](./scanner.html)
QR Code Scanner:

The QR Code Scanner provides DAO members with the ability to:
- Scan the QR code on a cacao bag using the device camera
- Extract the bag's unique identifier (`qr_code` parameter) from the scanned URL
- Generate a standardized sale message (e.g., `ABC123 – this bag of cacao just sold by me for $25.`)
- Share the sale/stock check message via native share (mobile) or clipboard copy (desktop) to our Town Hall channel on WhatsApp

#### Usage
1. Open [our scanner](./scanner.html) in a modern browser (Chrome, Firefox, Safari) with camera support
2. Grant camera access when prompted
3. Point the camera at the QR code on the serialized cacao bag
4. Click **Scan QR Code**
5. Once the `qr_code` parameter is detected, it appears on screen and enables **Report Sold**
6. Click **Report Sold** to share or copy the sale message

### [Inventory Expense Reporter](./report_dao_expenses.html)
Form-based inventory expense reporting:
- Select a DAO member from the API-driven dropdown
- Choose an inventory resource and view its available quantity
- Enter the quantity expensed
- Attach an image or PDF file
- Submit to share (mobile, e.g., to Telegram or WhatsApp) or copy to clipboard (desktop)

#### Usage
1. Open [Inventory Expense Reporter](./report_dao_expenses.html) in a modern browser
2. Select a **DAO Member** from the dropdown
3. Choose an **Inventory Resource** and view its available quantity
4. Enter the **Quantity Expensed**
5. Optionally, attach an image or PDF file
6. Click **Submit Expense Report** to share (mobile) or copy (desktop) the standardized report text

### [Inventory Movement Reporter](./report_inventory_movement.html)
Camera-based inventory movement reporting with dynamic selections:
- Select a warehouse manager from the API-driven dropdown
- Load and choose an inventory item under that manager, view available quantity
- Select a recipient from the contact list
- Enter the quantity to move
- Capture the current camera view and share a standardized report message

#### Usage
1. Open [Inventory Movement Reporter](./report_inventory_movement.html) in a modern browser with camera support
2. Grant camera access when prompted
3. Select a **Warehouse Manager** from the dropdown
4. Once loaded, choose an **Inventory Item** and view its available quantity
5. Select a **Recipient** from the contacts dropdown
6. Enter the **Quantity to Move**
7. Click **Report Inventory Movement** to share (mobile) or copy (desktop) the report text and attach the current camera snapshot

## Future Modules
* Contributions reporting for $TDG awards
* Voting rights marketplace
* DAO governance proposal system

## License

This project is licensed under the terms in the [LICENSE](./LICENSE) file.