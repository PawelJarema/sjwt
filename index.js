const hasher = require('crypto-js/hmac-sha512')
const base64url = require('base64url')
module.exports = class Token {
    constructor ({ type = 'JWT', secret = 'secret', hashFunction = hasher, hashFunctionName = 'HS512' }) {
        this._secret = secret
        this._hashFunction = hashFunction
        this._head = {
            alg: hashFunctionName,
            typ: type
        }
    }

    _encBase64Url (object) {
        return base64url(JSON.stringify(object))
    }

    _makeSignature (headerBase64Url, payloadBase64Url) {
        return this._hashFunction(
            headerBase64Url + '.' + payloadBase64Url,
            this._secret
        ).toString()
    }

    tokenize (bodyObject) {
        const headerBase64 = this._encBase64Url(this._head)
        const payloadBase64 = this._encBase64Url(bodyObject)
        const signature = this._makeSignature(headerBase64, payloadBase64)

        return [headerBase64, payloadBase64, signature].join('.')
    }

    parse (token) {
        if (typeof token !== 'string') return
        const [headerBase64, payloadBase64, signature] = token.split('.')
        const testSignature = this._makeSignature(headerBase64, payloadBase64)
        if (signature === testSignature) {
            try {
                const string = Buffer.from(payloadBase64, 'base64').toString()
                return JSON.parse(string)
            } catch (err) {
                console.log({ msg: 'Error parsing token.', err })
            }
        }
    }
}