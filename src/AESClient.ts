import { webcrypto } from "crypto";

export class AESClient {
	private _key: webcrypto.CryptoKey | undefined;
	constructor() {}

	public async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			webcrypto.subtle
				.generateKey(
					{
						name: "AES-GCM",
						length: 256,
					},
					true, // exportable
					["encrypt", "decrypt"]
				)
				.then((key: webcrypto.CryptoKey) => {
					this._key = key;
					resolve();
				})
				.catch((e) => {
					this._key = undefined;
					reject(e);
				});
		});
	}

	/**
	 * Exports this object's public key so that the client can
	 * encrypt their data using this person's public key
	 */
	public async exportKey(): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			if (!this._key) return reject(undefined);
			webcrypto.subtle
				.exportKey("raw", this._key)
				.then((keyBuffer: ArrayBuffer) => {
					resolve(keyBuffer as ArrayBuffer);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/**
	 * Loads the ArrayBuffer representing the key
	 * to this object, can only be used to decrypt
	 */
	public async loadBufferKey(bufferKey: ArrayBuffer): Promise<void> {
		return new Promise((resolve, reject) => {
			webcrypto.subtle
				.importKey(
					"raw",
					bufferKey,
					{
						name: "AES-GCM",
					},
					false,
					["decrypt"]
				)
				.then((importedKey) => {
					this._key = importedKey;
					resolve();
				})
				.catch((e) => reject(e));
		});
	}
}
