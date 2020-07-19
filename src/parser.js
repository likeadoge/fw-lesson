/**
 *  progarm   => expr_list $$
 * 
 *  expr_list => expr 
 *            => expr expr_list
 * 
 *  expr      => <text>
 *            => <code> 
 *            => <loop> expr_list <over>
 *            => <if> expr_list if_tail
 * 
 *  if_tail   => <end>
 *  if_tail   => <else> expr if_tail
 */

import { lexerType } from './lexer'

const parseType = {
    progarm: Symbol('program'),
    exprList: Symbol('expr list'),
    expr: Symbol('expr'),
    ifTail: Symbol('if tail')
}

class Parser {
    static $$ = undefined
    tokens = []

    constructor(list) {
        this.tokens = list
    }

    token() { return this.tokens[0] }

    is(...args) {
        return !(args.findIndex(v => v === this.token()) < 0)
    }
    match(target) {
        if (this.token() === target) {
            return this.tokens.shift()
        } else {
            this.error()
        }
    }
    error() {
        throw new Error('parse error!')
    }


    program() {
        const target = {
            key: parseType.progarm,
            children: []
        }
        if (this.is(
            lexerType.text,
            lexerType.code,
            lexerType.loop,
            lexerType.if
        )) {
            target.children =[
                this.exprList(),
                this.match(Parser.$$)
            ]
        } else {
            this.error()
        }

        return target
    }
    exprList() {
        
        const target = {
            key: parseType.exprList,
            children: []
        }

        if (this.is(
            lexerType.text,
            lexerType.code,
            lexerType.loop,
            lexerType.if
        )) {
            target.children = [
                this.expr(),
                this.exprList()
            ]
        } else if (this.is(
            lexerType.over,
            lexerType.else,
            lexerType.end,
            Parser.$$
        )) {

        } else {
            this.error()
        }

        return target
    }
    expr() {
        
        const target = {
            key: parseType.expr,
            children: []
        }

        if (this.is(
            lexerType.text
        )) {
            
            target.children =[
                this.match(lexerType.text)
            ]
        } else if (this.is(
            lexerType.code
        )) {
            
            target.children =[
                this.match(lexerType.code)
            ]
        } else if (this.is(
            lexerType.loop
        )) {
            
            target.children =[
                this.match(lexerType.loop),
                this.exprList(),
                this.match(lexerType.over),
            ]
        } else if (this.is(
            lexerType.if
        )) {
            
            target.children =[
                this.match(lexerType.if),
                this.exprList(),
                this.ifTail(),
            ]
        } else {
            this.error()
        }
        
        return target
    }
    ifTail() {
        
        const target = {
            key: parseType.ifTail,
            children: []
        }
        if (this.is(
            lexerType.end
        )) {
            target.children =[
                this.match(lexerType.end)
            ]
        } else if (this.is(
            lexerType.else
        )) {
            
            target.children =[
                this.match(lexerType.else),
                this.exprList(),
                this.ifTail(),
            ]
        } else {
            this.error()
        }
        
        return target
    }
}

export const parser = (list) => {
   return  new Parser(list.map(v => v.key)).program()
}


