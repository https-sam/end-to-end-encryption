# End to End Encryption
A cryptography module that provides RSA & AES encryption interfaces.  
Currently supports RSA-OAEP (Asymmetrical) encryption and AES-GCM (Symmetrical) encryption.   
This module is available on [npm](https://www.npmjs.com/package/e2ee-ts?activeTab=readme).

# RSA Client (RSA-OAEP)

### Init()
Creates a RSA key pair, note that the private key cannot be exported. This method must be called first before other methods can be called, otherwise, it will reject all the operations. 
```js
const client = new RSAClient();
await client.init();
```

### exportPublicKey()
Exports the public key as `ArrayBuffer`. Returns `Promise<ArrayBuffer>`.
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();
```

### loadClientPublic(ArrayBuffer)
Loads a public key into the object, which will be used for encryption.
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();

const client2 = new RSAClient();
await client2.importClientPublic(expotedKey);

```

### encrypt(BufferSource)
Encrypts BufferSource using the public key. Returns `Promise<ArrayBuffer>`.
```js
await client.encrypt(
  message as ArrayBuffer,
);
```

### decrypt(ArrayBuffer)
Decrypts ArrayBuffer using the private key. Returns `Promise<ArrayBuffer>`.
```js
await client.decrypt(
  encryptedMessage as ArrayBuffer
);
```

### spkiToPEM(ArrayBuffer)
Converts `spki` into human readable PEM format. 
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();
const pem = client.spkiToPEM(expotedKey)

```

# AES Client

