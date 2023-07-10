import _ from 'lodash'

import { build as buildProTable } from './aomi/proTable/index.mjs'
import { build as buildProTableSearch } from './aomi/proTable/components/search.mjs'
import { build as buildProTablePagination } from './aomi/proTable/components/pagination.mjs'

function getPropsList (xComponentProps) {
  const kvList = []
  Object.entries(xComponentProps).forEach(function ([k, v]) {
    if (_.isObject(v)) {
      let myK = ''
      if (/^@/.test(k)) {
        myK = '@' + _.kebabCase(k)
      } else if (_.isString(v.value)) {
        myK = _.kebabCase(k)
      } else {
        myK = ':' + _.kebabCase(k)
      }

      if (v.modifiers) {
        myK += `.${v.modifiers}`
      }
      if (v.key) {
        kvList.push(`${myK}="${v.key}"`)
      } else {
        if (_.isArray(v.value)) {
          kvList.push(`${myK}="[${v.value.join(',')}]"`)
        } else {
          kvList.push(`${myK}="${v.value}"`)
        }
      }
    } else {
      kvList.push(`${_.kebabCase(k)}="${v}"`)
    }
  })

  return kvList
}

function getPropsString (xComponentProps) {
  return getPropsList(xComponentProps).join(' ')
}

function handleXComponent (key, value) {
  const xComponent = value['x-component']
  const propsString = getPropsString(value['x-component-props'] ?? {})

  if (xComponent === '@aomi/proTable') {
    return function (data) {
      return {
        text: buildProTable({ propsString, content: data.map(item => item.text).join('') })
      }
    }
  } else if (xComponent === '@aomi/proTable/components/search') {
    return function (data) {
      return {
        text: buildProTableSearch({
          propsString,
          content: data.map(function (item) {
            const props = item.value['x-component-props'] ?? {}

            return `
                     <el-form-item label="${props.label}">
                     ${item.text}
                     </el-form-item>
                    `
          }).join(''),
          value
        })
      }
    }
  } else if (xComponent === '@aomi/proTable/components/pagination') {
    return function (data) {
      return {
        text: buildProTablePagination({ propsString, content: data?.text?.join(''), value })
      }
    }
  } else if (/^element-ui\//.test(xComponent)) {
    const fn = handleElementUI(key, value)
    return function (data) {
      return {
        key,
        value,
        text: fn(data)
      }
    }
  } else {
    return function () {
      return {
        text: ''
      }
    }
  }
}

function handleElementUI (key, value) {
  const xComponent = value['x-component']
  const props = value['x-component-props'] ?? {}
  const name = /^element-ui\/(.*)/.exec(xComponent)[1]
  const tagName = _.kebabCase(name)

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
                 v-for="item in ${props.options.key}"
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

function walk (key, value, end) {
  if (_.isObject(value)) {
    if (key === 'properties') {
      const slotContent = []
      Object.entries(value).forEach(function ([k, v]) {
        walk(k, v, function (data) {
          slotContent.push(data)
        })
      })
      end(slotContent)
    } else {
      if (value['x-component']) {
        const fn = handleXComponent(key, value)
        if (value.properties) {
          walk('properties', value.properties, function (data) {
            end(fn(data))
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

export function visit (value) {
  if (value.version) {
    //
  }

  let template = ''
  walk('properties', value.schema.properties, function (data) {
    template = `<template data-gen-vue>${data.map(item => item.text).join('')}</template>`
  })

  return template
}
