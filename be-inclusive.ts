import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeInclusiveActions, BeInclusiveProps} from './types';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {register} from 'be-hive/register.js';

export class BeInclusiveController implements BeInclusiveActions{
    onOf({proxy, of, shadow}: this){
        const templ = upShadowSearch(proxy, of) as HTMLTemplateElement;
        if(templ === null || !(templ instanceof HTMLTemplateElement)){
            console.error({of, self, msg:"Could not locate template."});
            return;
        }
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        if(shadow !== undefined){
            if(proxy.shadowRoot === null){
                proxy.attachShadow({mode: shadow});
            }
            proxy.shadowRoot!.appendChild(clone);
        }else{
            proxy.appendChild(clone);
        }
        
    }
}

export interface BeInclusiveController extends BeInclusiveProps{}

const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';

define<BeInclusiveProps & BeDecoratedProps<BeInclusiveProps, BeInclusiveActions>, BeInclusiveActions>({
    config:{
        tagName,
        propDefaults:{
            virtualProps: ['of', 'shadow'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
        },
        actions:{
            onOf:{
                ifAllOf:['of']
            }
        }
    },
    complexPropDefaults:{
        controller: BeInclusiveController
    }
});

register(ifWantsToBe, upgrade, tagName);
