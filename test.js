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

const a = {
    id: 'Y2zxYOIeUm2V6v24BT4xS',
    createdAt: '2022-04-27T14:04:35.711Z',
    updatedAt: '2022-04-27T14:04:35.711Z',
    name: 'teste',
    email: 'foo@bar.com',
    password: '12345678',
    avatar: 'a'
  }

console.log(findPath(a, 'avatar'))
