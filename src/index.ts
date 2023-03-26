import { E2EEClient } from "./E2EEClient";

(async () => {
	const message = "Secret Message";
	const client1 = new E2EEClient();
	await client1.init();
	const expotedKey1 = await client1.exportPublicKey();

	const client2 = new E2EEClient();
	await client2.init();
	const expotedKey2 = await client2.exportPublicKey();
	await client2.loadClientPublic(expotedKey1 as ArrayBuffer);
	const client2Encrypted = await client2.encrypt(Buffer.from(message));

	const client1Decrypted = await client1.decrypt(
		client2Encrypted as ArrayBuffer
	);
	console.log(client1.arrayBufferToString(client1Decrypted as ArrayBuffer));
})();
