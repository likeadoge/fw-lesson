const tokens = fw.lexer(`
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
</template>`)


console.log(
    tokens
)


console.log(
    fw.parser(tokens)
)
