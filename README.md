# SJWT
A simple Json Web Token module written with minimal footprint in mind. SJWT uses SHA256 for signatures. Injecting custom hash functions is also supported.

### Installation
```sh
$ npm install -S '@paweljarema/sjwt'
```

### Setup
To create secure tokens, you need to pass a secret to SJWT constructor. It's best to prepare an instance in a separate file and require later:

###### **`jwt.js`**
```sh
const SJWT = require('@paweljarema/sjwt')
const { appSecret } = require('../config/keys')   // appSecret is just a string

module.exports = new SJWT({ secret: appSecret })
```
### Usage
To create a secure token, do:
```sh
const jwt = require('jwt.js')   // jwt.js from previous step
const token = jwt.tokenize(dataObject)
```
To parse token:
```sh
jwt.parse(token)   // returns 'undefined' for invalid tokens
```
### Token expiry date
If you want your tokens to expire with time, you need to implement this yourself:
```sh
const TTL = 24 * 60 * 60 * 1000
const data = {
    _id: 'session_id or user_id',
    expires: Date.now() + TTL,
}
const token = jwt.tokenize(data)
```
To test if token expired:
```sh
    const data = jwt.parse(token)
    const tokenIsValid = data && data.expires >= Date.now()
```
### Custom hash function
To use customgit hashing function, provide additional props in constructor, just like we did in setup. Hash function should take a **string** and return a **hashed string**:
```sh
const SJWT = require('@paweljarema/sjwt')
const { appSecret } = require('../config/keys')
const myHashFunction = require('my-hash-function')
module.exports = new SJWT({
    secret: appSecret,
    hashFunction: myHashFunction,
    hashFunctionName: 'my-hash-function'
})
```
### License
Use for good as much as you like :)