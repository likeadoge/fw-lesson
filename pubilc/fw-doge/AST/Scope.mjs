const uniq = (arr) => {
    const set = new Set()
    return arr.filter(v => {
        if (set.has(v)) return false
        else {
            set.add(v)
            return true
        }
    })
}


export class Scope {
    vars = []
    constructor(vars) {
        this.vars = uniq(
            vars.filter(v => [
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
            ].find(s => s !== v))
        )
    }
    genFunc(code) {
        return new Func(this, code)
    }

    extends(current = []) {
        return new Scope(this.vars.concat(current))
    }

}

export class Func {
    #scope
    #fn // Function
    constructor(scope, code) {
        this.#scope = scope
        this.#fn = new Function(
            ...scope.vars,
            `return ${code || 'undefined'}`
        )
    }
    call(input) {
        return this.#fn.apply(
            input,
            this.#scope.vars.map(key => input[key])
        )
    }

}