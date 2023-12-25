import core from '@actions/core'

export function log(message) {
    console.log(message);
}

export function debug(message) {
    if (core.isDebug()) {
        core.debug(message);
    }
}

function isNestedKeyValuePair(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function logJson(obj, indent = '') {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
    
            if (Array.isArray(value)) {
                log(`${indent}${key}: [`);
                for (let i = 0; i < value.length; i++) {
                    logJson(value[i], `${indent}  `);
                }
                log(`${indent}]`);
            } else if (isNestedKeyValuePair(value)) {
                log(`${indent}${key}: {`);
                logJson(value, `${indent}  `);
                log(`${indent}}`);
            } else {
                log(`${indent}${key}: ${value}`);
            }
        }
    }
}

export function debugJson(obj, indent = '') {
    if (core.isDebug()) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
      
                if (isNestedKeyValuePair(value)) {
                    debugJson(value, `${indent}  `);
                } else {
                    debug(`${indent}${key}: ${value}`);
                }
            }
        }
    }
}
