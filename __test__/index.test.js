import { lexer, lexerType } from '../src/lexer'




describe('lexer', () => {
    it('lexer', () => {
        const str = `
<template>
    <!--loop(times)-->
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
    <!--over-->
</template>`
        expect(lexer(str)).toBeInstanceOf(Array);
    })
})