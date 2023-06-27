import {fileURLToPath} from "node:url";
import {dirname, join} from "node:path";
// import render from "dom-serializer";
import {visit as visitTemplate} from "./template/index.mjs";
import {read} from "./schema.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schema = read(join(__dirname, '../public/schema/simple.json'))



const template = visitTemplate(schema)
console.log('template=', template)
