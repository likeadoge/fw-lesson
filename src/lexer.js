
export const lexType = {
    loop: Symbol('loop'),
    over: Symbol('over'),
    if: Symbol('if'),
    else: Symbol('else'),
    end: Symbol('end'),
    code: Symbol('{{}}'),
    text: Symbol('text'),
}

export const lexer = (str) => {

    const lexerKeyWord = [
        [lexType.loop, /(<\!--loop(?:<\w+(?:,\w+)?>)?\([\w|\W]+?\)-->)/, (str) => {
            const input = str.match(/<\!--loop(?:<(\w+(?:,\w+))?>)?\([\w|\W]+?\)-->/)[1]
            const code = str.match(/<\!--loop(?:<\w+(?:,\w+)?>)?\(([\w|\W]+?)\)-->/)[1]
            return {
                input: input && input.trim() ? input.split(',').map(v => v.trim()) : [],
                code
            }
        }],
        [lexType.if, /(<\!--if\([\w|\W]+?\)-->)/, (str) => {
            const code = str.match(/<\!--if\(([\w|\W]+?)\)-->/)[1]
            return { code }
        }],
        [lexType.else, /(<\!--else(?:\([\w|\W]+?\))?-->)/, (str) => {
            const code = str.match(/(<\!--else(?:\(([\w|\W]+?)\))?-->)/)[1]
            return { code }
        }],
        [lexType.over, /(<\!--over-->)/],
        [lexType.end, /(<\!--end-->)/],
        [lexType.code, /(\{\{[\w|\W]+?\}\})/, (str) => {
            const code = str.match(/\{\{([\w|\W]+?)\}\}/)[1]
            return { code }
        }],
    ]

    const list = lexerKeyWord.reduce((r, [type, re, fn]) => {
        return r.flatMap(str => {
            if (typeof str !== 'string') return [str]
            else return str.split(re).map(v => re.test(v) ? {
                type,
                content: v,
                data: fn ? (fn(v)) : null
            } : v)
        })
    }, [str]).map(v => {
        return typeof v === 'string' ? {
            type: lexType.text,
            content: v,
            data: null
        } : v
    })
    return list
}
