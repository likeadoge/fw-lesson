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





const str = `
<template>
    <ol>
        <!--loop<value,index>(list)-->
        <li>
            <!--if(value.type === 'text')-->
            <span>{{text}}</span>
            <!--else(value.type === 'input')-->
            <input type="text"/>
            <!--else-->
            <b>Error Value</b>
            <!--end-->
        </li>
        <!--over-->
    </ol>
</template>
`

const lexer = (str) => {


    const lexerKeyWord = [
        [lexerType.loop, /<(\!--loop(?:<\w+(,\w+)?>)?\()/],
        [lexerType.if, /<(\!--if\()/],
        [lexerType.elseIf, /(<\!--else\()/],
        [lexerType.over, /(<\!--over-->)/],
        [lexerType.end, /(<\!--end-->)/],
        [lexerType.else, /(<\!--else-->)/],
        [lexerType.codeBegin, /(\{\{)/],
        [lexerType.codeEnd, /(\}\})/],
    ]

    return str.split('\n').map((line, index) => {
        lexerKeyWord.reduce((r, [key, re], index) => {
            console.log(index, r)
            return r.flatMap(str => {
                if (typeof str !== 'string') return [str]
                else return str.split(re).map(v => re.test(v) ? {
                    key,
                    index,
                    content: v
                } : v)
            })
        }, [line])
    })
}

lexer(str)