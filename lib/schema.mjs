import {readFileSync} from "node:fs";
import {pascal, isObject} from 'radash'

export function read(filePath) {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export function traverse(value, cb = {}) {
    const walk = function (key, value, parent) {
        if (key === 'schema') {
            cb.enterSchema && cb.enterSchema({key, value, parent})
            Object.entries(value).forEach(([k, v]) => {
                walk(k, v, {key, value});
            });
            cb.exitSchema && cb.exitSchema()
        } else if (key === 'properties') {
            cb.enterProperties && cb.enterProperties({key, value, parent})
            Object.entries(value).forEach(([k, v]) => {
                walk(k, v, {key, value});
            });
            cb.exitProperties && cb.exitProperties()
        } else if (key === 'x-component-slots') {
            cb.enterXComponentSlots && cb.enterXComponentSlots({key, value, parent})
            Object.entries(value).forEach(([k, v]) => {
                walk(k, v, {key, value});
            });
            cb.exitXComponentSlots && cb.exitXComponentSlots()
        } else {
            if (/x-/.test(key)) {
                const name = pascal(key)
                cb[`enter${name}`] && cb[`enter${name}`]({key, value, parent});
                cb[`exit${name}`] && cb[`exit${name}`]();
            } else {
                cb.enterProperty &&  cb.enterProperty({key, value, parent})
                isObject(value) && Object.entries(value).forEach(([k, v]) => {
                    walk(k, v, {key, value});
                });
                cb.exitProperty && cb.exitProperty()
            }
        }
    }

    cb.enterVersion && cb.enterVersion({key: 'version', version: value.version})
    cb.exitVersion && cb.exitVersion()
    walk('schema', value.schema, {key: 'ROOT', value})
}
