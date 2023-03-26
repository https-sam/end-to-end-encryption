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
