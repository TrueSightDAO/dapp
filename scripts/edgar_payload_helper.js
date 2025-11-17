/**
 * EdgarPayloadHelper
 * ------------------
 * Encapsulates the formatting, signing, and verification logic that
 * TrueSight DApp modules use when talking to Edgar.
 *
 * Features:
 *  - Build canonical payload strings based on an event name + attributes.
 *  - Sign the payload with a PKCS#8 RSA private key (base64) to obtain the
 *    Request Transaction ID (base64 signature).
 *  - Verify a payload + transaction ID using the contributor's public key.
 *  - Generate share text (optional) that mirrors the existing DApp pattern.
 *  - Includes self-test helpers so developers can validate the flow quickly.
 *
 * Usage:
 *   const helper = new EdgarPayloadHelper({
 *     digitalSignature: localStorage.getItem('publicKey'),
 *     generationSource: window.location.href
 *   });
 *
 *   const { payload, requestTransactionId, shareText } =
 *     await helper.generatePayload({
 *       eventName: 'CONTRIBUTION EVENT',
 *       attributes: {
 *         'Type': 'Time (Minutes)',
 *         'Amount': '30',
 *         'Description': 'Closing out Townhall',
 *         'Contributor(s)': 'Gary Teh'
 *       },
 *       privateKey: localStorage.getItem('privateKey'),
 *       digitalSignature: localStorage.getItem('publicKey') // optional override
 *     });
 *
 *   const isValid = await helper.verifyPayload(payload, requestTransactionId);
 */
(function attachEdgarPayloadHelper(global) {
  const DEFAULT_VERIFY_URL = 'https://dapp.truesight.me/verify_request.html';

  const textEncoder = new TextEncoder();

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return global.btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const normalized = base64.replace(/[\r\n]+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '==='.slice((normalized.length + 3) % 4);
    const binary = global.atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function importPrivateKey(privateKeyBase64) {
    if (!privateKeyBase64) {
      throw new Error('Private key (base64 PKCS#8) is required to sign payloads.');
    }
    return await global.crypto.subtle.importKey(
      'pkcs8',
      base64ToArrayBuffer(privateKeyBase64),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );
  }

  async function importPublicKey(publicKeyBase64) {
    if (!publicKeyBase64) {
      throw new Error('Digital signature / public key (base64 SPKI) is required to verify payloads.');
    }
    return await global.crypto.subtle.importKey(
      'spki',
      base64ToArrayBuffer(publicKeyBase64),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
  }

  class EdgarPayloadHelper {
    constructor(options = {}) {
      this.digitalSignature = options.digitalSignature || null;
      this.generationSource = options.generationSource || null;
    }

    setDigitalSignature(signature) {
      this.digitalSignature = signature;
    }

    setGenerationSource(source) {
      this.generationSource = source;
    }

    formatAttributes(attributes) {
      if (!attributes || (typeof attributes !== 'object' && !Array.isArray(attributes))) {
        throw new Error('Attributes must be an object, Map, or array of [label, value] pairs.');
      }

      if (Array.isArray(attributes)) {
        return attributes;
      }

      if (attributes instanceof Map) {
        return Array.from(attributes.entries());
      }

      return Object.entries(attributes);
    }

    formatAttributeValue(value) {
      if (value === undefined || value === null) return 'N/A';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value);
        } catch (err) {
          return String(value);
        }
      }
      return String(value);
    }

    buildPayloadString(eventName, attributes) {
      if (!eventName) throw new Error('eventName is required.');
      const entries = this.formatAttributes(attributes);
      const lines = entries.map(([label, rawValue]) => {
        const value = this.formatAttributeValue(rawValue);
        if (value.includes('\n')) {
          const indented = value.replace(/\r?\n/g, '\n  ');
          return `- ${label}: ${indented}`;
        }
        return `- ${label}: ${value}`;
      });
      return `[${eventName.trim()}]\n${lines.join('\n')}\n--------`;
    }

    buildShareText(payload, requestTransactionId, overrides = {}) {
      const digitalSignature = overrides.digitalSignature || this.digitalSignature || 'UNREGISTERED SIGNATURE';
      const generationSource = overrides.generationSource || this.generationSource || global.location?.href || 'Unknown Source';
      const verifyUrl = overrides.verifyUrl || DEFAULT_VERIFY_URL;

      return `${payload}\n\nMy Digital Signature: ${digitalSignature}\n\nRequest Transaction ID: ${requestTransactionId}\n\nThis submission was generated using ${generationSource}\n\nVerify submission here: ${verifyUrl}`;
    }

    async generatePayload({ eventName, attributes, privateKey, digitalSignature, generationSource, includeShareText = true }) {
      if (!eventName) throw new Error('eventName is required.');
      if (!attributes) throw new Error('attributes are required.');

      const payload = this.buildPayloadString(eventName, attributes);
      const key = await importPrivateKey(privateKey);
      const signatureBuffer = await global.crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, textEncoder.encode(payload));
      const requestTransactionId = arrayBufferToBase64(signatureBuffer);

      if (digitalSignature) {
        this.digitalSignature = digitalSignature;
      }
      if (generationSource) {
        this.generationSource = generationSource;
      }

      const shareText = includeShareText
        ? this.buildShareText(payload, requestTransactionId, { digitalSignature, generationSource })
        : null;

      return { payload, requestTransactionId, shareText };
    }

    async verifyPayload(payload, requestTransactionId, digitalSignatureOverride) {
      if (!payload || !requestTransactionId) {
        throw new Error('Both payload and requestTransactionId are required for verification.');
      }
      const signature = digitalSignatureOverride || this.digitalSignature;
      const publicKey = await importPublicKey(signature);
      try {
        return await global.crypto.subtle.verify(
          'RSASSA-PKCS1-v1_5',
          publicKey,
          base64ToArrayBuffer(requestTransactionId),
          textEncoder.encode(payload)
        );
      } catch (err) {
        console.error('Verification error:', err);
        return false;
      }
    }

    /**
     * Generates an ephemeral RSA key pair (base64 encoded) for testing purposes.
     */
    static async generateEphemeralKeyPair() {
      const keyPair = await global.crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['sign', 'verify']
      );

      const publicKey = await global.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const privateKey = await global.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      return {
        publicKey: arrayBufferToBase64(publicKey),
        privateKey: arrayBufferToBase64(privateKey)
      };
    }

    /**
     * Runs a lightweight end-to-end test: generate payload, sign, and verify.
     * Returns diagnostic info to aid debugging.
     */
    static async runSelfTest() {
      const { publicKey, privateKey } = await EdgarPayloadHelper.generateEphemeralKeyPair();
      const helper = new EdgarPayloadHelper({
        digitalSignature: publicKey,
        generationSource: 'https://example.com/test'
      });

      const attributes = {
        'Type': 'Time (Minutes)',
        'Amount': '30',
        'Description': 'Closing out Townhall',
        'Contributor(s)': 'Test User',
        'TDG Issued': '50.00',
        'Attached Filename': 'IMG_4249.png',
        'Destination Contribution File Location': 'https://github.com/TrueSightDAO/.github/tree/main/assets/example.png'
      };

      const { payload, requestTransactionId } = await helper.generatePayload({
        eventName: 'CONTRIBUTION EVENT',
        attributes,
        privateKey,
        includeShareText: false
      });

      const verified = await helper.verifyPayload(payload, requestTransactionId);
      return { payload, requestTransactionId, verified };
    }
  }

  // expose helpers for other modules or unit tests
  EdgarPayloadHelper.utils = {
    arrayBufferToBase64,
    base64ToArrayBuffer,
    importPrivateKey,
    importPublicKey
  };

  global.EdgarPayloadHelper = EdgarPayloadHelper;
})(window);

