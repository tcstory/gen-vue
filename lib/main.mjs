import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
// import render from "dom-serializer";
import {read} from "./schema.mjs";
import {createStack} from "./template/libs.mjs";
import {isObject, dash} from "radash";

import {create as createBasic} from './template/page/basic.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = read(join(__dirname, '../public/schema/simple.json'))

function getKVList(xComponentProps) {
    let kvList = []
    Object.entries(xComponentProps).forEach(function ([k, v]) {
        kvList.push(`${k}="${v}"`)
    })

    return kvList
}

function getKVString(xComponentProps) {
    return getKVList(xComponentProps).join(' ')
}

function handleXComponent(key, value) {
    const xComponent = value['x-component']
    const kvString = getKVString(value['x-component-props'] ?? {})

    if (xComponent === '@page/proTable') {
        return function (content = "") {
            return `<div class="pro-table" ${kvString}>${content}</div>`
        }
    } else if (xComponent === '@page/components/tableSearch') {
        return function (content = "") {
            const text = `<el-form class="pro-table-search" ${kvString} inline>${content}</el-form>`
            const slotName = value['x-component-slot-name'] ?? ""
            if (slotName) {
                return `<template v-slot:${slotName}>${text}</template>`
            } else {
                return text
            }
        }
    } else if (/^element-ui\//.test(xComponent)) {
        const name = /^element-ui\/(.*)/.exec(xComponent)[1]
        return function (content = "") {
            const tagName = dash(name);
            return `<el-${tagName}>${content}</el-${tagName}>`
        }
    } else {
        return function () {
            return ""
        }
    }
}

function walk(key, value, end) {
    if (isObject(value)) {
        if (key === 'properties') {
            const slotContent = []
            Object.entries(value).forEach(function ([k, v]) {
                walk(k, v, function (content) {
                    slotContent.push(content)
                })
            })
            end(slotContent.join(''))
        } else {
            if (value['x-component']) {
                const fn = handleXComponent(key, value)
                value.properties && walk('properties', value.properties, function (content) {
                    end(fn(content))
                })
            } else {
                end()
            }
        }
    } else {
        end()
    }
}

function visit(value) {
    if (value.version) {
        //
    }

    walk('properties', value.schema.properties, function (content) {
        console.log('render', content)
    })
}

visit(schema)
