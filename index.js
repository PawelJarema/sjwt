const hasher = require('./hashFunction')
module.exports = class Token {
    constructor ({ type = 'JWT', secret = 'secret', hashFunction = hasher, hashFunctionName = 'sha256' }) {
        this._secret = secret
        this._hashFunction = hashFunction
        this._head = {
            alg: hashFunctionName,
            typ: type
        }
    }

    _encBase64 (object) {
        return Buffer.from(JSON.stringify(object)).toString('base64')
    }

    _makeSignature (headerBase64, payloadBase64) {
        return this._hashFunction(
            [headerBase64, payloadBase64, this._secret].join('.')
        )
    }

    tokenize (bodyObject) {
        const headerBase64 = this._encBase64(this._head)
        const payloadBase64 = this._encBase64(bodyObject)
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