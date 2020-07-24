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

import { lexType } from './lexer'

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

    token() { return this.tokens[0]?.type }

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
            type: parseType.progarm,
            children: []
        }
        if (this.is(
            lexType.text,
            lexType.code,
            lexType.loop,
            lexType.if
        )) {
            target.children = [
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
            type: parseType.exprList,
            children: []
        }

        if (this.is(
            lexType.text,
            lexType.code,
            lexType.loop,
            lexType.if
        )) {
            target.children = [
                this.expr(),
                this.exprList()
            ]
        } else if (this.is(
            lexType.over,
            lexType.else,
            lexType.end,
            Parser.$$
        )) {

        } else {
            this.error()
        }

        return target
    }
    expr() {

        const target = {
            type: parseType.expr,
            children: []
        }

        if (this.is(
            lexType.text
        )) {

            target.children = [
                this.match(lexType.text)
            ]
        } else if (this.is(
            lexType.code
        )) {

            target.children = [
                this.match(lexType.code)
            ]
        } else if (this.is(
            lexType.loop
        )) {

            target.children = [
                this.match(lexType.loop),
                this.exprList(),
                this.match(lexType.over),
            ]
        } else if (this.is(
            lexType.if
        )) {

            target.children = [
                this.match(lexType.if),
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
            type: parseType.ifTail,
            children: []
        }
        if (this.is(
            lexType.end
        )) {
            target.children = [
                this.match(lexType.end)
            ]
        } else if (this.is(
            lexType.else
        )) {

            target.children = [
                this.match(lexType.else),
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
    return new Parser(list).program()
}

export {
    parseType
}

