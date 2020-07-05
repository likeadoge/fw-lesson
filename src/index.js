export default function fw() {
    console.log(fw)
}


export const lexerType = {
    loop: Symbol('loop'),
    over: Symbol('over'),
    if: Symbol('if'),
    else: Symbol('else'),
    elseIf: Symbol('elseif'),
    end: Symbol('end'),
    codeBegin: Symbol('{{'),
    codeEnd: Symbol('}}'),
}
x





const lexer = (str) => {


    const lexerKeyWord = [
        [lexerType.loop, /<\!--loop<value,index>\(/],
        [lexerType.if, /<\!--if\(/],
        [lexerType.elseIf, /<\!--else\(/],
        [lexerType.over, /<\!--over-->/],
        [lexerType.end, /<\!--end-->/],
        [lexerType.else, /<\!--else-->/],
        [lexerType.codeBegin, /\{\{/],
        [lexerType.codeEnd, /\}\}/],
    ]

    str.split('\n').map((line, index) => {
        lexerKeyWord.reduce((r, [key, re]) => {
            r.flatMap(str => {
                if (typeof str !== 'string') return [str]
                return str.split(re).map(v => re.test(v) ? {
                    key,
                    index,
                    content: v
                } : v)
            })
        }, [line])
    })
}