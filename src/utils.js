import { sign, verify } from 'jsonwebtoken'
import isEqual from 'lodash.isequal'

const generateAccessToken = userId => sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' })
const generateRefreshToken = userId => sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' })
const verifyAccessToken = token => {
    try {
        return verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return null
    }
}
const verifyRefreshToken = token => {
    try {
        return verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
        return null
    }
}

const isArray = v => Array.isArray(v)
const isString = value => type(value) === 'string'
const isNumber = value => type(value) === 'number'
const isBoolean = value => type(value) === 'boolean'
const isFunction = value => type(value) === 'function'
const isObject = value => type(value) === 'object'

const nonStringList = [-1, 0, 1, null, true, false, [], {}]

// https://stackoverflow.com/a/41457071/14243840

const functionNamePattern = /^function\s+([^(]+)?\(/
const classNamePattern = /^class(\s+[^{]+)?{/

function type(value) {
    if (value === null) return 'null'
    const typeOfValue = typeof value
    const isPrimitive = typeOfValue !== 'function' && typeOfValue !== 'object'
    if (isPrimitive) return typeOfValue
    const objectToString = Object.prototype.toString.call(value).slice(8, -1)
    // eslint-disable-next-line @typescript-eslint/ban-types
    const valueToString = value.toString()
    if (objectToString === 'Function') {
        // A function or a constructor
        const indexOfArrow = valueToString.indexOf('=>')
        const indexOfBody = valueToString.indexOf('{')
        if (indexOfArrow !== -1 && (indexOfBody === -1 || indexOfArrow < indexOfBody)) {
            // Arrow function
            return 'function'
        }
        // Anonymous and named functions
        const functionName = functionNamePattern.exec(valueToString)
        if (functionName !== null && typeof functionName[1] !== 'undefined') {
            // Found a named function or class constructor
            return 'function'
        }
        const className = classNamePattern.exec(valueToString)
        if (className !== null && typeof className[1] !== 'undefined') {
            // When running under ES6+
            return 'class'
        }
        // Anonymous function
        return 'function'
    }
    if (objectToString === 'Array') return 'array'

    return 'object'
}

// https://filesignatures.net/index.php?search=png&mode=EXT
const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

// https://filesignatures.net/index.php?search=jpg&mode=EXT
const jpgOrjpegSig = [
    [0xff, 0xd8, 0xff, 0xe0],
    [0xff, 0xd8, 0xff, 0xe1],
    [0xff, 0xd8, 0xff, 0xe8],
]

// https://stackoverflow.com/a/45503154/14243840
const webpSig1 = [0x52, 0x49, 0x46, 0x46]
const webpSig2 = [0x57, 0x45, 0x42, 0x50]

// https://filesignatures.net/index.php?search=gif&mode=EXT
const gifSig = [0x47, 0x49, 0x46, 0x38]

function isImage(buf) {
    const pngSigSize = [...buf.slice(0, 8)]
    const jpgSigSize = [...buf.slice(0, 4)]
    const webpSigSize1 = [...buf.slice(0, 4)]
    const webpSigSize2 = [...buf.slice(8, 12)]

    const isPng = isEqual(pngSigSize, pngSig)
    const isJpgOrJpeg = jpgOrjpegSig.some(i => isEqual(jpgSigSize, i))
    const isWebp = isEqual(webpSigSize1, webpSig1) && isEqual(webpSigSize2, webpSig2)

    return isPng || isJpgOrJpeg || isWebp
}

function isGif(buf) {
    const gifSigSize = [...buf.slice(0, 4)]
    const isGif = isEqual(gifSigSize, gifSig)

    return isGif
}

const findPath = (ob, key) => {
    if (ob[key] !== undefined) {
        return [key]
    }
    
    const path = []
    const keyExists = obj => {
        if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
            return false
        } else if (obj.hasOwnProperty(key)) {
            return true
        } else if (Array.isArray(obj)) {
            let parentKey = path.length ? path.pop() : ''

            for (let i = 0; i < obj.length; i++) {
                path.push(`${parentKey}[${i}]`)
                const result = keyExists(obj[i], key)
                if (result) {
                    return result
                }
                path.pop()
            }
        } else {
            for (const k in obj) {
                path.push(k)
                const result = keyExists(obj[k], key)
                if (result) {
                    return result
                }
                path.pop()
            }
        }
        return false
    }

    keyExists(ob)

    return path
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    isString,
    isNumber,
    isBoolean,
    isFunction,
    isArray,
    isObject,
    nonStringList,
    isGif,
    isImage,
    findPath,
}
