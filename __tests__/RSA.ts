import { RSAClient } from "../src/RSAClient";

describe("RSA key initialization: init()", () => {
	it("Should generate a key", async () => {
		expect.assertions(1);
		const RSA = new RSAClient();
		await expect(RSA.init()).resolves.not.toThrow();
	});
});

describe("RSA key export: exportKey()", () => {
	it("Should export key", async () => {
		expect.assertions(2);
		const RSA = new RSAClient();
		await expect(RSA.init()).resolves.not.toThrow();
		await expect(RSA.exportPublicKey()).resolves.not.toThrow();
	});

	it("Should not export key", async () => {
		expect.assertions(1);
		const RSA = new RSAClient();
		await expect(RSA.exportPublicKey()).rejects.toEqual(
			"Export failed: public key not found. Call init() first."
		);
	});
});

describe("RSA key import: importBufferKey()", () => {
	it("Should import key", async () => {
		expect.assertions(3);
		const RSA = new RSAClient();
		await expect(RSA.init()).resolves.not.toThrow();
		const exportedKey = await RSA.exportPublicKey();
		expect(exportedKey).toBeTruthy();
		await expect(RSA.importClientPublic(exportedKey)).resolves.not.toThrow();
	});

	it("Should not import a key", async () => {
		const client = new RSAClient();
		await client.init();
		expect(
			client.importClientPublic(new Uint8Array([0x01, 0x00, 0x01]))
		).rejects.toThrow();
	});
});

describe("RSA encryption", () => {
	it("Should encrypt a message", async () => {
		const message = "Secret Message";
		const client1 = new RSAClient();
		await client1.init();
		const client1Public = await client1.exportPublicKey();

		const client2 = new RSAClient();
		await client2.init();
		await client2.importClientPublic(client1Public);
		expect(client2.encrypt(Buffer.from(message))).resolves.not.toThrow();
		expect(client2.encrypt(Buffer.from(message))).resolves.not.toEqual(
			Buffer.from(message)
		);
	});

	it("Should not encrypt a message", async () => {
		const message = "Secret Message";
		const client1 = new RSAClient();

		await expect(client1.encrypt(Buffer.from(message))).rejects.toEqual(
			"Error while encrypting: No client public key found."
		);
	});
});

describe("RSA decryption", () => {
	it("Should encrypt and decrypt a message", async () => {
		const message = "Secret Message";
		const client1 = new RSAClient();
		await client1.init();
		const client1Public = await client1.exportPublicKey();

		const client2 = new RSAClient();
		await client2.init();
		await client2.importClientPublic(client1Public);
		const client2Encrypted = await client2.encrypt(Buffer.from(message));

		const client1Decrypted = await client1.decrypt(
			client2Encrypted as ArrayBuffer
		);

		expect(client1Decrypted).toBeTruthy();
		expect(client1.arrayBufferToString(client1Decrypted)).toBe(message);
	});

	it("Should encrypt but not decrypt a message", async () => {
		const message = "Secret Message";
		const client1 = new RSAClient();
		await client1.init();

		const client3 = new RSAClient();
		await client3.init();
		const client3Public = await client3.exportPublicKey();

		const client2 = new RSAClient();
		await client2.init();
		await client2.importClientPublic(client3Public);
		const client2Encrypted = await client2.encrypt(Buffer.from(message));

		await expect(
			client1.decrypt(client2Encrypted as ArrayBuffer)
		).rejects.toThrow();
	});

	it("Should not decrypt a message", async () => {
		const message = "Secret Message";
		const client1 = new RSAClient();

		await expect(client1.decrypt(Buffer.from(message))).rejects.toEqual(
			"Error while decrypting: No private key found."
		);
	});
});
