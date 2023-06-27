import {dash, isObject} from "radash";

import {build as buildProTable} from "./aomi/proTable/index.mjs";
import {build as buildProTableSearch} from './aomi/proTable/components/search.mjs'
import {build as buildProTablePagination} from './aomi/proTable/components/pagination.mjs'

function getPropsList(xComponentProps) {
    let kvList = []
    Object.entries(xComponentProps).forEach(function ([k, v]) {
        if (isObject(v)) {
            let myK = ""
            if (/^@/.test(k)) {
                //
            } else {
                myK += ':'
            }

            myK += `${dash(k)}`
            if (v.modifiers) {
                myK += `.${v.modifiers}`
            }
            kvList.push(`${myK}="${v.bind}"`)
        } else {
            kvList.push(`${dash(k)}="${v}"`)
        }
    })

    return kvList
}

function getPropsString(xComponentProps) {
    return getPropsList(xComponentProps).join(' ')
}

function handleXComponent(key, value) {
    const xComponent = value['x-component']
    const propsString = getPropsString(value['x-component-props'] ?? {})

    if (xComponent === '@aomi/proTable') {
        return function (content = "") {
            return buildProTable({propsString, content})
        }
    } else if (xComponent === '@aomi/proTable/components/search') {
        return function (content = "") {
            return buildProTableSearch({propsString, content, value})
        }
    } else if (xComponent === '@aomi/proTable/components/pagination') {
        return function (content = "") {
            return buildProTablePagination({propsString, content, value})
        }
    } else if (/^element-ui\//.test(xComponent)) {
        const fn = handleElementUI(key, value)
        return function (content = "") {
            return fn(content)
        }
    } else {
        return function () {
            return ""
        }
    }
}

function handleElementUI(key, value) {
    const xComponent = value['x-component']
    const props = value['x-component-props'] ?? {}
    const name = /^element-ui\/(.*)/.exec(xComponent)[1]
    const tagName = dash(name);

    if (name === 'input') {
        return function () {
            return `
            <el-input data-gen-vue v-model="${key}" placeholder="${props.placeholder ?? ''}"></el-input>
            `
        }
    } else if (name === 'select') {
        return function () {
            return `
            <el-select data-gen-vue v-model="${key}" placeholder="${props.placeholder ?? ''}">
                <el-option
                data-gen-vue
                 v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
            `
        }
    } else {
        return function (content) {
            return `<el-${tagName} data-gen-vue>${content}</el-${tagName}>`
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
                if (value.properties) {
                    walk('properties', value.properties, function (content) {
                        end(fn(content))
                    })
                } else {
                    end(fn())
                }
            } else {
                end()
            }
        }
    } else {
        end()
    }
}

export function visit(value) {
    if (value.version) {
        //
    }

    let template = ""
    walk('properties', value.schema.properties, function (content) {
        template = `<template data-gen-vue>${content}</template>`
    })

    return template
}
