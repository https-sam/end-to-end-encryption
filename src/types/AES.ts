type AESTagLength = 32 | 64 | 96 | 104 | 112 | 120 | 128;

interface AESEncrypt {
	data: ArrayBuffer;
	initVector: Uint8Array;
}
