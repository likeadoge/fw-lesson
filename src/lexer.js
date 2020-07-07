
export const lexerType = {
    loop: Symbol('loop'),
    over: Symbol('over'),
    if: Symbol('if'),
    else: Symbol('else'),
    end: Symbol('end'),
    code: Symbol('{{}}'),
}

export const lexer = (str) => {


    const lexerKeyWord = [
        [lexerType.loop, /(<\!--loop(?:<\w+(?:,\w+)?>)?\([\w|\W]+?\)-->)/],
        [lexerType.if, /(<\!--if\([\w|\W]+?\)-->)/],
        [lexerType.else, /(<\!--else(?:\([\w|\W]+?\))?-->)/],
        [lexerType.over, /(<\!--over-->)/],
        [lexerType.end, /(<\!--end-->)/],
        [lexerType.code, /(\{\{[\w|\W]+?\}\})/],
    ]

    return lexerKeyWord.reduce((r, [key, re], index) => {
        return r.flatMap(str => {
            if (typeof str !== 'string') return [str]
            else return str.split(re).map(v => re.test(v) ? {
                key,
                index,
                content: v
            } : v)
        })
    }, [str])

}
