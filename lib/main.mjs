import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
import {readFileSync} from "node:fs";

import * as htmlparser2 from "htmlparser2";
import render from "dom-serializer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(join(__dirname, '../public/test.vue'), 'utf-8')


const tree = htmlparser2.parseDocument(input);

function walk(dom) {
    if (dom.children?.length > 0) {
        for (let child of dom.children) {
            walk(child)
        }
    }
}

walk(tree)

console.log(render(tree))
