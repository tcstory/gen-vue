import _ from 'lodash'
import util from "node:util";

function handleAomiComponent (componentName) {
  const result = {}

  return result
}

function handleElementUIComponent (componentName) {
  const result = {}

  result.imports = {
    'element-ui': {
      [componentName.replace(/element-ui\//, '')]: 1
    }
  }

  return result
}

function handleXComponent (key, value) {
  const componentName = value['x-component'] ?? ''
  const props = value['x-component-props'] ?? {}
  const result = {
    vue: {
      data: {}
    }
  }

  if (/^element-ui/.test(componentName)) {
    _.merge(result, handleElementUIComponent(componentName))
  } else if (/^@aomi/.test(componentName)) {
    _.merge(result, handleAomiComponent(componentName))
  }

  if (Object.keys(props).length > 0) {
    Object.entries(props).forEach(function ([k, v]) {
      if (_.isArray(v)) {
        //
      } else if (_.isObject(v)) {
        if (v.key) {
          if (v.type === 'computed') {
            _.set(result, `vue.computed.${v.key}`, 1)
          } else {
            _.set(result, `vue.data.${v.key}`, v.value)
          }
        } else if (/^@/.test(k)) {
          _.set(result, `vue.methods.${v.value}`, 1)
        }
      }
    })
    return function () {
      return result
    }
  } else {
    return function () {
      return {}
    }
  }
}

function toString (script) {
  const results = []

  if (script.imports) {
    Object.entries(script.imports).forEach(function ([k, v]) {
      if (k === 'element-ui') {
        results.push(
            `import {${
                Object.keys(v).map(function (item) {
                  return item
                }).join(',')
            }} from "element-ui"\n`
        )
      }
    })
  }

  if (script.vue) {
    let dataStr = ""
    let methodsStr = ""
    if (script.vue.data) {
      dataStr = `data() {
        return ${util.inspect(script.vue.data, {depth: null})}
      }`
    }

    if (script.vue.methods) {
      methodsStr = `methods: {${Object.keys(script.vue.methods).map(item => `${item}(){}`)}}`
    }

    results.push(`export default {${dataStr},${methodsStr}}`)
  }

  return `<script>${results.join('\n')}</script>`
}

function walk (key, value, end) {
  if (_.isObject(value)) {
    if (key === 'properties') {
      const result = {}
      Object.entries(value).forEach(function ([k, v]) {
        walk(k, v, function (data) {
          _.merge(result, data)

          if (v.type === 'void') {
            //
          } else {
            _.set(result, `vue.data.${k}`, '')
          }
        })
      })
      end(result)
    } else {
      if (value['x-component']) {
        const fn = handleXComponent(key, value)
        if (value.properties) {
          walk('properties', value.properties, function (data) {
            end(_.merge(data, fn()))
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

  const script = {}

  walk('properties', value.schema.properties, function (data) {
    _.merge(script, data)
  })

  return toString(script)
}
