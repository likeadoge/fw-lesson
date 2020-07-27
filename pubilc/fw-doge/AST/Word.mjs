export class Word {
    static type = {
        loop: Symbol('loop'),
        over: Symbol('over'),
        if: Symbol('if'),
        else: Symbol('else'),
        end: Symbol('end'),
        code: Symbol('{{}}'),
        text: Symbol('text'),
    }

    static keywords = [
        [Word.type.loop, /(<\!--loop(?:<\w+(?:,\w+)?>)?\([\w|\W]+?\)-->)/, (str) => {
            const input = str.match(/<\!--loop(?:<(\w+(?:,\w+))?>)?\([\w|\W]+?\)-->/)[1]
            const code = str.match(/<\!--loop(?:<\w+(?:,\w+)?>)?\(([\w|\W]+?)\)-->/)[1]
            return {
                input: input && input.trim() ? input.split(',').map(v => v.trim()) : [],
                code
            }
        }],
        [Word.type.if, /(<\!--if\([\w|\W]+?\)-->)/, (str) => {
            const code = str.match(/<\!--if\(([\w|\W]+?)\)-->/)[1]
            return { code }
        }],
        [Word.type.else, /(<\!--else(?:\([\w|\W]+?\))?-->)/, (str) => {
            const code = str.match(/<\!--else(?:\(([\w|\W]+?)\))?-->/)[1] || 'true'
            return { code }
        }],
        [Word.type.over, /(<\!--over-->)/],
        [Word.type.end, /(<\!--end-->)/],
        [Word.type.code, /(\{\{[\w|\W]+?\}\})/, (str) => {
            const code = str.match(/\{\{([\w|\W]+?)\}\}/)[1]
            return { code }
        }],
        [Word.type.text, /([\d|\D]*)/],
    ]

    static lexer = str => Word.keywords.reduce((r, [type, re, fn]) => {
        return r.flatMap(str => {
            if (typeof str !== 'string') {
                return [str]
            } else {
                return str.split(re).filter(v => !!v).map(content => re.test(content)
                    ? new Word(type, content, fn ? (fn(content)) : null)
                    : content)
            }
        })
    }, [str])

    type = null
    content = ''
    data = null
    constructor(type, content, data = null) {
        Object.assign(this, {
            type, content, data
        })
    }
}
