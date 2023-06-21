import * as htmlparser2 from "htmlparser2";

export function parse(input) {
    let template = []
    let style = []
    let script = []
    const tree = htmlparser2.parseDocument(input)
    return ;
}