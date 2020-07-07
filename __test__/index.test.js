import { lexer, lexerType } from '../src/lexer'

const str = `<template>
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
</template>`

test('lexer', () => {
    console.log(lexer(str))
    expect(lexer(str)).toBeInstanceOf(Array);
});
