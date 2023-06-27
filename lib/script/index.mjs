import template from "@babel/template";
import traverse from "@babel/traverse";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import {dash, isObject} from "radash";

function walk(key, value, end) {
    if (isObject(value)) {
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

export function visit(value) {
    if (value.version) {
        //
    }

    let template = ""
    walk('properties', value.schema.properties, function (data) {
        template = `<script >${data.map(item => item.text).join('')}</script>`
    })

    return template
}
