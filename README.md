# End to End Encryption
This is a personal module intended to be used for other projects.

# RSA Client

### Init()
Creates a RSA key pair, note that the private key cannot be exported. This method must be called first before other methods can be called, otherwise, it will reject all the operations. 

### exportPublicKey()
Exports the public key as `ArrayBuffer`. Returns `Promise<ArrayBuffer>`.

### loadClientPublic(ArrayBuffer)
Loads a public key into the object, which will be used for encryption.


### encrypt(BufferSource)
Encrypts BufferSource using the public key. Returns `Promise<ArrayBuffer>`.


### decrypt(ArrayBuffer)
Decrypts ArrayBuffer using the private key. Returns `Promise<ArrayBuffer>`.

### spkiToPEM(ArrayBuffer)
Converts `spki` into human readable PEM format. 

# AES Client

