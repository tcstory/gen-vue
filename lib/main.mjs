import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
// import render from "dom-serializer";
import {read, traverse} from "./schema.mjs";
import {isObject} from "radash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = read(join(__dirname, '../public/schema/simple.json'))

function visit(key, value) {
    if (key === 'root') {
        Object.entries(value).forEach(([k, v]) => {
            visit(k, v);
        });
    } else if (key === 'version') {
        //
    } else if (key === 'schema') {
        const walk = function (key, value) {
            if (key === 'x-component') {
                console.log('x-component', key, value)
            } else if (key === 'x-component-slots') {
                console.log('enter x-component-slots')
                for (const item of value) {
                    walk('ARRAY_INDEX', item)
                }
                console.log('exit x-component-slots')
            } else if (key === 'x-component-props') {
                console.log('x-component-props', key)
            } else if (key === 'properties') {
                Object.entries(value).forEach(([k, v]) => {
                    walk(k, v);
                });
            } else {
                if (isObject(value)) {
                    console.log('complex field', key)
                    Object.entries(value).forEach(([k, v]) => {
                        walk(k, v);
                    });
                } else {
                    console.log('field', key, value)
                }
            }
        }
        walk('properties', value.properties)
    } else {
        //
    }
}

visit('root', schema)

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

