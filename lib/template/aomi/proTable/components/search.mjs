export function build({propsString, content, value}) {
    const text = `<el-form class="pro-table-search" ${propsString} inline>${content}</el-form>`
    const slotName = value['x-component-slot-name'] ?? ""
    if (slotName) {
        return `<template v-slot:${slotName}>${text}</template>`
    } else {
        return text
    }
}