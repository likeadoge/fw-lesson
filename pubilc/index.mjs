import { AST } from './fw-doge/index.mjs'

document.body.innerHTML =
    AST.gen(`
    <div>
        <!--loop(new Array(times).fill(null))-->
        <ol>
            <!--loop<value,index>(list)-->
            <li>
                <!--if(value.type === 'text')-->
                <span>{{value.text}}</span>
                <!--else(value.type === 'input')-->
                <input type="text" value="{{value.value}}"/>
                <!--else-->
                <b style="color:red">Error Value</b>
                <!--end-->
            </li>
            <!--over-->
        </ol>
        <!--over-->
    </div>`, {
        times: 3,
        list: [{
            type: 'text',
            text: 'test'
        }, {
            type: 'input',
            value: 'test'
        }, {

        }]
    }).toHtml({
        times: 3,
        list: [{
            type: 'text',
            text: 'test'
        }, {
            type: 'input',
            value: 'test'
        }, {

        }]
    })

