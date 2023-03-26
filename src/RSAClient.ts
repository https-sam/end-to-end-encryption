import crypto, { webcrypto } from "crypto";
import { BufferSource } from "stream/web";

export class RSAClient {
	private _privateKey: webcrypto.CryptoKey | undefined;
	private _clientPublicKey: webcrypto.CryptoKey | undefined;
	public publicKey: webcrypto.CryptoKey | undefined;

	constructor() {}

	/**
	 * Initializes the RSA key pair - public & private
	 */
	public async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			webcrypto.subtle
				.generateKey(
					{
						name: "RSA-OAEP",
						modulusLength: 2048,
						publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
						hash: { name: "SHA-256" },
					},
					false, // private key not exportable
					["encrypt", "decrypt"]
				)
				.then(({ publicKey, privateKey }: webcrypto.CryptoKeyPair) => {
					this.publicKey = publicKey;
					this._privateKey = privateKey;
					resolve();
				})
				.catch((e) => {
					this.publicKey = undefined;
					this._privateKey = undefined;
					reject(e);
				});
		});
	}

	/**
	 * Exports this object's public key so that the client can
	 * encrypt their data using this person's public key
	 */
	public async exportPublicKey(): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			if (!this.publicKey)
				return reject(
					"Export failed: public key not found. Call init() first."
				);
			webcrypto.subtle
				.exportKey("spki", this.publicKey)
				.then((keyBuffer: ArrayBuffer) => {
					resolve(keyBuffer as ArrayBuffer);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/**
	 * Loads the ArrayBuffer representing the client's public key
	 * to this object
	 */
	public async importClientPublic(
		clientPublicBuffer: ArrayBuffer
	): Promise<void> {
		return new Promise((resolve, reject) => {
			webcrypto.subtle
				.importKey(
					"spki",
					clientPublicBuffer,
					{
						name: "RSA-OAEP",
						hash: { name: "SHA-256" },
					},
					false,
					["encrypt"]
				)
				.then((importedPublic) => {
					this._clientPublicKey = importedPublic;
					resolve();
				})
				.catch((e) => reject(e));
		});
	}

	/**
	 * Encrypts BufferSource using the client's public key
	 */
	public encrypt(data: BufferSource): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			if (!this._clientPublicKey)
				return reject("Error while encrypting: No client public key found.");
			webcrypto.subtle
				.encrypt({ name: "RSA-OAEP" }, this._clientPublicKey, data)
				.then((encryptedData: ArrayBuffer) => {
					resolve(encryptedData);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/**
	 * Decrypts ArrayBuffer using the private key
	 */
	public decrypt(data: ArrayBuffer): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			if (!this._privateKey)
				return reject("Error while decrypting: No private key found.");
			webcrypto.subtle
				.decrypt({ name: "RSA-OAEP" }, this._privateKey, data)
				.then((encryptedData: ArrayBuffer) => {
					resolve(encryptedData);
				})
				.catch((e) => reject(e));
		});
	}

	public arrayBufferToString(buffer: ArrayBuffer) {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		for (var i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return binary;
	}

	private formatAsPem(str: string): string {
		const header = "-----BEGIN PUBLIC KEY-----\n";
		const footer = "-----END PUBLIC KEY-----";
		let content = "";
		while (str.length > 0) {
			content += str.substring(0, 64) + "\n";
			str = str.substring(64);
		}
		return header + content + footer;
	}

	/**
	 * Returns human readable PEM
	 */
	public spkiToPEM(keydata: ArrayBuffer): string {
		const keydataS = this.arrayBufferToString(keydata);
		const keydataB64 = btoa(keydataS);
		const keydataB64Pem = this.formatAsPem(keydataB64);
		return keydataB64Pem;
	}
}
