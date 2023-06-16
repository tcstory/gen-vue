import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {readFileSync} from 'node:fs'
import antlr4 from 'antlr4';
import {HTMLLexer} from './HTMLLexer.js';
import {HTMLParser} from './HTMLParser.js';
import {MyHTMLParserListener} from "./myHTMLParserListener.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const input = readFileSync(join(__dirname, '../public/test.vue'), 'utf-8')

const chars = new antlr4.InputStream(input);
const lexer = new HTMLLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new HTMLParser(tokens);

const tree = parser.htmlElement()
antlr4.tree.ParseTreeWalker.DEFAULT.walk(new MyHTMLParserListener(), tree);