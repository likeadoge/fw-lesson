import { lexer, lexType } from './lexer'
import { parser, parseType } from './parser'

export class AST {

    static dealExpr = (node) => {
        const { children } = node
        if (children[0].type === lexType.text) {
            return new Text(node)
        }
        if (children[0].type === lexType.code) {
            return new Code(node)
        }
        if (children[0].type === lexType.if) {
            return new IfElse(node)
        }
        if (children[0].type === lexType.loop) {
            return new Loop(node)
        }
    }


    static gen(str) {
        const walk = array => array.flatMap(v => {
            if (v === undefined) {
                return []
            } else if (v.type === parseType.exprList) {
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

        return new Program(pre(parser(lexer(str))))
    }
}



class Scope {
    keys = []
    static extends(parent, current) {
        return new Scope(Array.from(new Set(parent.keys.concat(current))))
    }
    constructor(keys) {
        this.keys = keys.filter(v => [
            'abstract', 'arguments', 'boolean', 'break', 'byte',
            'case', 'catch', 'char', 'class', 'const',
            'continue', 'debugger', 'default', 'delete', 'do',
            'double', 'else', 'enum', 'eval', 'export',
            'extends', 'false', 'final', 'finally', 'float',
            'for', 'function', 'goto', 'if', 'implements',
            'import', 'in', 'instanceof', 'int', 'interface',
            'let', 'long', 'native', 'new', 'null',
            'package', 'private', 'protected', 'public', 'return',
            'short', 'static', 'super', 'switch', 'synchronized',
            'this', 'throw', 'throws', 'transient', 'true',
            'try', 'typeof', 'var', 'void', 'volatile',
            'while', 'with', 'yield'
        ].find(s => s === v))
    }
}


class Program extends AST {
    children = []
    constructor({ children }) {
        super()
        this.children = children.map(v => AST.dealExpr(v))
    }
}

class IfElse extends AST {
    else = null
    body = []
    code = ''
    constructor({ children }) {
        super()
        const [head,...body] = children
        const tail = body.pop()

        this.code = head.data.code || 'true'
        this.body = body.map(v => AST.dealExpr(v))

        if(tail.children[0].type === lexType.else){
            this.else = new IfElse(tail)
        }

    }

}

class Loop extends AST {
    body = []
    constructor({ children }) {
        super()
        const body = children.filter((v, i, arr) => i !== 0 && i !== arr.length - 1)

        this.body = body.map(v => AST.dealExpr(v))
    }

}

class Text extends AST {
    content = ''
    constructor({ children }) {
        super()
        this.content = children[0].content
    }

}

class Code extends AST {
    code = ''
    constructor({ children }) {
        super()
        this.code = children[0].data.code
    }
}