import {HTMLParserListener} from "./HTMLParserListener.js";

class MyHTMLParserListener extends HTMLParserListener {
    enterHtmlElement(ctx) {
        console.log('enter', ctx.getText())
    }

    exitHtmlDocument() {
        console.log('88')
    }
}

export {MyHTMLParserListener}