# End to End Encryption
A cryptography module that provides RSA & AES encryption interfaces.  
Currently supports RSA-OAEP (Asymmetrical) encryption and AES-GCM (Symmetrical) encryption.   
This module is available on [npm](https://www.npmjs.com/package/e2ee-ts?activeTab=readme).

## Feature highlights

- [x] Easy interfaces to safely **encrypt / decrypt**
- [x] **RSA** & **AES** encryption algorithms
- [x] PEM format export

## Contents

*   [When should I use this?](#when-should-i-use-this)
*   [Installation](#installation)
*   [APIs](#apis)
    *   [RSA-OAEP](#rsa-client)
        *   [`init()`](#rsa-init)
        *   [`exportPublicKey()`](#rsa-export-public-key)
        *   [`importClientPublic()`](#rsa-import-client-public)
        *   [`encrypt()`](#rsa-encrypt)
        *   [`decrypt()`](#rsa-decrypt)
        *   [`spkiToPEM()`](#rsa-spkitopem)
    *   [AES-GCM](#aes)
        *   [`init()`](#aes-init)
        *   [`exportKey()`](#aes-export-key)
        *   [`importBufferKey()`](#aes-import-buffer-key)
        *   [`encrypt()`](#aes-encrypt)
        *   [`decrypt()`](#aes-decrypt)
        
# Why should I use this?
This module abstracts the [webcrypto APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API), and provides easier interfaces to interact with.

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

### <p id="rsa-import-client-public">importClientPublic(ArrayBuffer)</p>
Imports a public key into the object, which will be used for encryption.
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




# AES Client

### <p id="aes-init">init()</p>
Generates a AES key, note that the private key cannot be exported. This method must be called first before other methods can be called, otherwise, it will reject all the operations. 
```js
const client = new AESClient();
await client.init();
```

### <p id="aes-export-key">exportKey()<p>
Exports the key as `ArrayBuffer`. Returns `Promise<ArrayBuffer>`.
```js
const client = new AESClient();
await client.init();
const expotedKey = await client.exportKey();
```

### <p id="aes-import-buffer-key">importBufferKey(ArrayBuffer)</p>
Imports a key into the object, which will be used for encryption.
```js
const client = new AESClient();
await client.init();
const expotedKey = await client.exportKey();

const client2 = new AESClient();
await client2.importBufferKey(expotedKey);

```

### <p id="aes-encrypt">encrypt(BufferSource)</p>
Encrypts BufferSource using the public key. Returns `Promise<ArrayBuffer>`.
```js
await client.encrypt(
  message as ArrayBuffer,
);
```

### <p id="aes-decrypt">decrypt(ArrayBuffer)</p>
Decrypts ArrayBuffer using the private key. Returns `Promise<ArrayBuffer>`.
```js
await client.decrypt(
  encryptedMessage as ArrayBuffer
);
```


