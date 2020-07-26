import { Word } from './Word.mjs'
import { WordGroup } from './WordGroup.mjs'
import { Scope } from './Scope.mjs'

export class AST {

    static dealExpr = (node, parent) => {
        const { children } = node
        if (children[0].type === Word.type.text) {
            return new Text(node, parent)
        }
        if (children[0].type === Word.type.code) {
            return new Code(node, parent)
        }
        if (children[0].type === Word.type.if) {
            return new IfElse(node, parent)
        }
        if (children[0].type === Word.type.loop) {
            return new Loop(node, parent)
        }
    }

    static gen(str, model) {
        const walk = array => array.flatMap(v => {
            if (v === undefined) {
                return []
            } else if (v.type === WordGroup.type.exprList) {
                return walk(v.children)
            } else if (v.children) {
                return {
                    type: v.type,
                    children: walk(v.children)
                }
            } else {
                return v
            }
        })


        const pre = (tree) => Object.assign({}, tree, {
            children: walk(tree.children)
        })
        return new Program(
            pre(WordGroup.parser(Word.lexer(str))),
            new Scope(Object.keys(model))
        )
    }

    scope = null
    constructor(scope) {
        this.scope = scope
    }

    toHtml(model) {
        return ''
    }
}

class Program extends AST {
    children = []
    constructor({ children }, parent) {
        super(parent.extends())
        this.children = children.map(v => AST.dealExpr(v, this.scope))
    }
    toHtml(model) {
        return this.children.map(v => v.toHtml(model)).join('')
    }
}

class IfElse extends AST {
    else = null
    body = []
    func
    code = ""
    constructor({ children }, parent) {
        super(parent.extends())
        const [head, ...body] = children
        const tail = body.pop()

        this.func = this.scope.genFunc(head.data.code || 'true')
        this.body = body.map(v => AST.dealExpr(v, this.scope))
        this.code = head.data.code

        if (tail.children[0].type === Word.type.else) {
            this.else = new IfElse(tail, this.scope)
        }
    }
    toHtml(model) {
        if (this.func.call(model)) {
            return this.body.map(v => v.toHtml(model)).join('')
        } else if (this.else) {
            return this.else.toHtml(model)
        } else {
            return ''
        }
    }
}

class Loop extends AST {
    body = []
    func
    code = ''
    indexFiled = null
    valueFiled = null
    constructor({ children }, parent) {
        const { code, input = [] } = children[0].data
        super(parent.extends(input.filter(v => !!v)))

        this.func = this.scope.genFunc(code)
        this.code = code
        this.valueFiled = input[0] || null
        this.indexFiled = input[1] || null
        this.body = children.filter((v, i, arr) => i !== 0 && i !== arr.length - 1).map(v => AST.dealExpr(v, this.scope))
    }

    toHtml(model) {
        const arr = this.func.call(model)
        if (!(arr instanceof Array)) throw new Error('loop error')
        return arr.flatMap((value, index) => this.body.map(v => v.toHtml(Object.assign(
            {},
            model,
            this.indexFiled ? { [this.indexFiled]: index } : {},
            this.valueFiled ? { [this.valueFiled]: value } : {},
        )))).join('')
    }

}

class Text extends AST {
    content = ''
    constructor({ children }, parent) {
        super(parent.extends())
        this.content = children[0].content
    }
    toHtml() {
        return this.content
    }

}

class Code extends AST {
    func
    code = ''
    constructor({ children }, parent) {
        super(parent.extends())
        this.code = children[0].data.code
        this.func = this.scope.genFunc(children[0].data.code)
    }

    toHtml(model) {
        return String(this.func.call(model))
    }
}