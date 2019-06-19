function edit(regex, opt) {
    regex = regex.source || regex
    opt = opt || ""
    return {
        replace: function (name, val) {
            val = val.source || val
            val = val.replace(/(^|[^\[])\^/g, "$1")
            regex = regex.replace(name, val)
            return this
        },
        getRegex: function () {
            return new RegExp(regex, opt)
        }
    }
}

let block = {
    html:
        "^ {0,3}(?:" + // optional indentation
        "<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)" + // (1)
        "|comment[^\\n]*(\\n+|$)" + // (2)
        "|<\\?[\\s\\S]*?\\?>\\n*" + // (3)
        "|<![A-Z][\\s\\S]*?>\\n*" + // (4)
        "|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*" + // (5)
        "|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)" + // (6)
        "|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)" + // (7) open tag
        "|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)" + // (7) closing tag
        ")",
}

block._tag =
    "address|article|aside|base|basefont|blockquote|body|caption" +
    "|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption" +
    "|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe" +
    "|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option" +
    "|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr" +
    "|track|ul"
block._comment = /<!--(?!-?>)[\s\S]*?-->/

export const isHTML = edit(block.html, "i")
    .replace("comment", block._comment)
    .replace("tag", block._tag)
    .replace(
        "attribute",
        / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
    )
    .getRegex()


export const toCamelCase = str => {
    let s = str && str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join('')
    return s.slice(0, 1).toLowerCase() + s.slice(1)
}