import { AESClient } from "../src/AESClient";

describe("AES key generation", () => {
	it("Should generate a key", async () => {
		expect.assertions(1);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
	});
});

describe("AES key export", () => {
	it("Should export key", async () => {
		expect.assertions(2);
		const AES = new AESClient();
		await expect(AES.init()).resolves.not.toThrow();
		await expect(AES.exportKey()).resolves.not.toThrow();
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
