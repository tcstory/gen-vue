import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
// import render from "dom-serializer";
import {read, traverse} from "./schema.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = read(join(__dirname, '../public/schema/simple.json'))

traverse(schema, {
    enterProperty({key, value}) {
        console.log('key is', key)
        console.log('value is', value)
    }
})

// function walk(dom) {
//     if (dom.children?.length > 0) {
//         for (let child of dom.children) {
//             walk(child)
//         }
//     }
// }

