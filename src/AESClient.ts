import { getRandomValues, webcrypto } from "crypto";
import { BufferSource } from "stream/web";
import { AESEncrypt, AESTagLength } from "./@types/AES";

export class AESClient {
	private _key: webcrypto.CryptoKey | undefined;

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
			if (!this._key) return reject("Error while exporting: No key found.");
			webcrypto.subtle
				.exportKey("raw", this._key)
				.then((keyBuffer: ArrayBuffer) => {
					resolve(keyBuffer);
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
	public async importBufferKey(bufferKey: ArrayBuffer): Promise<void> {
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

	/**
	 * Encrypts BufferSource using the secret key
	 */
	public encrypt(
		data: BufferSource,
		tagLength: AESTagLength = 128
	): Promise<AESEncrypt> {
		return new Promise((resolve, reject) => {
			if (!this._key) return reject("Error while encrypting: No key found.");
			const iv = getRandomValues(new Uint8Array(12));
			webcrypto.subtle
				.encrypt(
					{
						name: "AES-GCM",
						iv,
						tagLength: tagLength,
					},
					this._key,
					data
				)
				.then((encryptedData: ArrayBuffer) => {
					resolve({
						data: encryptedData,
						iv,
					});
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/**
	 * Decrypts ArrayBuffer using the secret key
	 */
	public decrypt(
		data: ArrayBuffer,
		iv: Uint8Array,
		tagLength: AESTagLength = 128
	): Promise<ArrayBuffer> {
		return new Promise((resolve, reject) => {
			if (!this._key) return reject("Error while decrypting: No key found.");
			webcrypto.subtle
				.decrypt(
					{
						name: "AES-GCM",
						iv,
						tagLength: tagLength,
					},
					this._key,
					data
				)
				.then((decryptedData: ArrayBuffer) => {
					resolve(decryptedData);
				})
				.catch((e) => reject(e));
		});
	}

	public arrayBufferToString(buffer: ArrayBuffer) {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		for (var = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return binary;
	}
}
