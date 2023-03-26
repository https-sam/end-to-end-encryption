import { AESClient } from "./AESClient";
import { RSAClient } from "./ASAClient";

(async () => {
	// const message = "Secret Message";
	// const client1 = new RSAClient();
	// await client1.init();
	// const expotedKey1 = await client1.exportPublicKey();

	// const client2 = new RSAClient();
	// await client2.init();
	// const expotedKey2 = await client2.exportPublicKey();
	// console.log(client1.spkiToPEM(expotedKey2));
	// await client2.loadClientPublic(expotedKey1);
	// const client2Encrypted = await client2.encrypt(Buffer.from(message));

	// const client1Decrypted = await client1.decrypt(
	// 	client2Encrypted as ArrayBuffer
	// );
	// console.log(client1.arrayBufferToString(client1Decrypted));

	const AES = new AESClient();
	await AES.init();
	AES.exportKey()
		.then((d) => {
			console.log(d);
		})
		.catch((e) => console.log(e));
})();
