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

import { Word } from './Word.mjs'

class Parser {
    static $$ = undefined

    load(list) {
        this.#tokenList = list
        return this
    }

    #tokenList = []

    #token() { return this.#tokenList[0]?.type }

    #is(...args) {
        return !(args.findIndex(v => v === this.#token()) < 0)
    }
    #match(target) {
        if (this.#token() === target) {
            return this.#tokenList.shift()
        } else {
            this.#error()
        }
    }
    #error() {
        throw new Error('parse error!')
    }

    program() {
        const target = new WordGroup(WordGroup.type.progarm)
        if (this.#is(
            Word.type.text,
            Word.type.code,
            Word.type.loop,
            Word.type.if
        )) {
            target.children = [
                this.exprList(),
                this.#match(Parser.$$)
            ]
        } else {
            this.#error()
        }

        return target
    }
    exprList() {

        const target = new WordGroup(WordGroup.type.exprList)

        if (this.#is(
            Word.type.text,
            Word.type.code,
            Word.type.loop,
            Word.type.if
        )) {
            target.children = [
                this.expr(),
                this.exprList()
            ]
        } else if (this.#is(
            Word.type.over,
            Word.type.else,
            Word.type.end,
            Parser.$$
        )) {

        } else {
            this.#error()
        }

        return target
    }
    expr() {

        const target = new WordGroup(WordGroup.type.expr)

        if (this.#is(
            Word.type.text
        )) {

            target.children = [
                this.#match(Word.type.text)
            ]
        } else if (this.#is(
            Word.type.code
        )) {

            target.children = [
                this.#match(Word.type.code)
            ]
        } else if (this.#is(
            Word.type.loop
        )) {

            target.children = [
                this.#match(Word.type.loop),
                this.exprList(),
                this.#match(Word.type.over),
            ]
        } else if (this.#is(
            Word.type.if
        )) {

            target.children = [
                this.#match(Word.type.if),
                this.exprList(),
                this.ifTail(),
            ]
        } else {
            this.#error()
        }

        return target
    }
    ifTail() {

        const target = new WordGroup(WordGroup.type.ifTail)

        if (this.#is(
            Word.type.end
        )) {
            target.children = [
                this.#match(Word.type.end)
            ]
        } else if (this.#is(
            Word.type.else
        )) {

            target.children = [
                this.#match(Word.type.else),
                this.exprList(),
                this.ifTail(),
            ]
        } else {
            this.#error()
        }

        return target
    }
}

export class WordGroup extends Word {
    static type = {
        progarm: Symbol('program'),
        exprList: Symbol('expr list'),
        expr: Symbol('expr'),
        ifTail: Symbol('if tail')
    }

    static parser = list => new Parser().load(list).program()


    children = []
    constructor(type, children = []) {
        super(type, '', null)
        this.children = children
    }
}


