# End to End Encryption
A cryptography module that provides RSA & AES encryption interfaces.  
Currently supports RSA-OAEP (Asymmetrical) encryption and AES-GCM (Symmetrical) encryption.   
This module is available on [npm](https://www.npmjs.com/package/e2ee-ts?activeTab=readme).

## Feature highlights

- [x] Easy interfaces to safely **encrypt / decrypt**
- [x] **RSA** & **AES** encryption algorithms
- [x] PEM format export


*   [When should I use this?](#when-should-i-use-this)
*   [Installation](#installation)
*   [APIs](#apis)
    *   [RSA-OAEP](#rsa-client)
        *   [`init`](#rsa-init)
        *   [`exportPublicKey()`](#rsa-export-public-key)
        *   [`loadClientPublic()`](#rsa-load-client-public)
        *   [`encrypt()`](#rsa-encrypt)
        *   [`decrypt()`](#rsa-decrypt)
        *   [`spkiToPEM()`](#rsa-spkitopem)
    *   [AES-GCM](#aes)
        *   [`init`](#aes-init)

# Installation 
**Yarn** 
```
yarn add e2ee-ts
```

**npm**
```
npm i e2ee-ts
```

# RSA Client

### <p id="rsa-init">init()</p>
Creates a RSA key pair, note that the private key cannot be exported. This method must be called first before other methods can be called, otherwise, it will reject all the operations. 
```js
const client = new RSAClient();
await client.init();
```

### <p id="rsa-export-public-key">exportPublicKey()<p>
Exports the public key as `ArrayBuffer`. Returns `Promise<ArrayBuffer>`.
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();
```

### <p id="rsa-load-client-public">loadClientPublic(ArrayBuffer)</p>
Loads a public key into the object, which will be used for encryption.
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();

const client2 = new RSAClient();
await client2.importClientPublic(expotedKey);

```

### <p id="rsa-encrypt">encrypt(BufferSource)</p>
Encrypts BufferSource using the public key. Returns `Promise<ArrayBuffer>`.
```js
await client.encrypt(
  message as ArrayBuffer,
);
```

### <p id="rsa-decrypt">decrypt(ArrayBuffer)</p>
Decrypts ArrayBuffer using the private key. Returns `Promise<ArrayBuffer>`.
```js
await client.decrypt(
  encryptedMessage as ArrayBuffer
);
```

### <p id="rsa-spkitopem">spkiToPEM(ArrayBuffer)</p>
Converts `spki` into human readable PEM format. 
```js
const client = new RSAClient();
await client.init();
const expotedKey = await client.exportPublicKey();
const pem = client.spkiToPEM(expotedKey)

```


