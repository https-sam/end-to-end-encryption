import { AESClient } from "../src/AESClient";

describe("AES key initialization: init()", () => {
	it("Should generate a key", async () => {
		expect.assertions(1);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
	});
});

describe("AES key export: exportKey()", () => {
	it("Should export key", async () => {
		expect.assertions(2);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
		await expect(AES.exportKey()).resolves.not.toThrow();
	});

	it("Should not export key", async () => {
		expect.assertions(1);
		const AES = new AESClient();
		await expect(AES.exportKey()).rejects.toEqual(
			"Error while exporting: No key found."
		);
	});

	it("Should export key of 32 Byets", async () => {
		expect.assertions(3);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
		const exportedKey = await AES.exportKey();
		expect(exportedKey).toBeTruthy();
		expect(exportedKey.byteLength === 32).toBe(true);
	});
});

describe("AES key import: importBufferKey()", () => {
	it("Should import key", async () => {
		expect.assertions(3);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
		const exportedKey = await AES.exportKey();
		expect(exportedKey).toBeTruthy();
		await expect(AES.importBufferKey(exportedKey)).resolves.not.toThrow();
	});

	it("Should not import key", async () => {
		expect.assertions(3);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
		const exportedKey = await AES.exportKey();
		expect(exportedKey).toBeTruthy();
		await expect(
			AES.importBufferKey(new Uint8Array([0x01, 0x00, 0x01]))
		).rejects.toThrow();
	});
});

describe("AES Encrytion: encrypt()", () => {
	it("should encrypt", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		await expect(AESClient1.init()).resolves.not.toThrow();
		expect(AESClient1.encrypt(Buffer.from(message))).resolves.not.toThrow();
	});

	it("should encrypt and message should be encrypted", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		await expect(AESClient1.init()).resolves.not.toThrow();
		const { data: encryptedMessage } = await AESClient1.encrypt(
			Buffer.from(message)
		);
		expect(AESClient1.arrayBufferToString(encryptedMessage)).not.toBe(message);
	});

	it("should encrypt and return length 12 of init ventor", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		await expect(AESClient1.init()).resolves.not.toThrow();
		const { initVector } = await AESClient1.encrypt(Buffer.from(message));
		expect(initVector.length).toBe(12);
	});

	it("should not encrypt", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		expect(AESClient1.encrypt(Buffer.from(message))).rejects.toEqual(
			"Error while encrypting: No key found."
		);
	});
});

describe("AES Decryption: decrypt()", () => {
	it("should not decrypt", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		expect(
			AESClient1.decrypt(Buffer.from(message), new Uint8Array(12))
		).rejects.toEqual("Error while decrypting: No key found.");
	});
});

describe("AES Encryption Encryption intergration", () => {
	it("should encrypt and decrypt a message", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		await expect(AESClient1.init()).resolves.not.toThrow();
		const exportedKey = await AESClient1.exportKey();
		expect(exportedKey).toBeTruthy();
		const { data: encryptedMessage, initVector } = await AESClient1.encrypt(
			Buffer.from(message)
		);
		expect(encryptedMessage).toBeTruthy();

		const AESClient2 = new AESClient();
		await expect(
			AESClient2.importBufferKey(exportedKey)
		).resolves.not.toThrow();
		const decryptedData = await AESClient2.decrypt(
			encryptedMessage,
			initVector
		);
		expect(decryptedData).toBeTruthy();
		expect(AESClient2.arrayBufferToString(decryptedData)).toBe(
			"Secret Message"
		);
	});

	it("should encrypt, but not decrypt a message", async () => {
		const message = "Secret Message";
		const AESClient1 = new AESClient();
		await expect(AESClient1.init()).resolves.not.toThrow();
		const exportedKey = await AESClient1.exportKey();
		expect(exportedKey).toBeTruthy();
		const { data: encryptedMessage, initVector } = await AESClient1.encrypt(
			Buffer.from(message)
		);
		expect(initVector).toBeTruthy();
		expect(encryptedMessage).toBeTruthy();

		const AESClient2 = new AESClient();
		await expect(
			AESClient2.importBufferKey(exportedKey)
		).resolves.not.toThrow();
		expect(
			AESClient2.decrypt(encryptedMessage, new Uint8Array(12)) // passing wrong init vector
		).rejects.toThrow();
	});
});
