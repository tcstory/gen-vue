import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
// import render from "dom-serializer";
import {read} from "./schema.mjs";
import {createStack} from "./template/libs.mjs";
import {isObject} from "radash";

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

function walk(key, value, end) {
    let _end = null

    if (isObject(value)) {
        const keys = Object.keys(value)
        if (keys.includes('x-component')) {
            const xComponent = value['x-component']

            if (xComponent === '@page/basic') {
                const xComponentSlots = value['x-component-slots']

                const slotContent = []
                for (const slot of xComponentSlots) {
                    walk('ARRAY_INDEX', slot, function (content) {
                        const slotName = slot['x-component-slot-name'] ?? ""
                        if (slotName) {
                            slotContent.push(`<template v-slot:${slotName}>${content}</template>`)
                        } else {
                            slotContent.push(content)
                        }
                    })
                }

                _end = function () {
                    end(
                        `<div class="pro-table" ${getKVString(value['x-component-props'] ?? {})}>${slotContent.join('')}</div>`
                    )
                }
            } else if (xComponent === '@page/components/tableSearch') {
                _end = function () {
                    end(`<el-form class="pro-table-search" ${getKVString(value['x-component-props'] ?? {})} inline></el-form>`)
                }
            } else {
                console.log('wich component', xComponent, key)

            }
        } else {
            _end = end
        }
    } else {
        console.log('key', key, value)
    }

    _end()
}

function visit(value) {
    if (value.version) {
        //
    }

    walk('properties', value.schema.properties, function (content) {
        console.log(content)
    })
}

visit(schema)

// const content = []
// traverse(schema, {
//     enterSchema() {
//
//     },
//     exitSchema() {
//
//     },
//     enterXComponent({key, value}) {
//         console.log('--->', key, value)
//     },
//     exitXComponent(){},
//     enterProperty({key, value}) {
//         // console.log('key is', key)
//         // console.log('value is', value)
//     }
// })

// function walk(dom) {
//     if (dom.children?.length > 0) {
//         for (let child of dom.children) {
//             walk(child)
//         }
//     }
// }

