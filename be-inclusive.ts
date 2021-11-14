import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeInclusiveActions, BeInclusiveProps, BeInclusiveVirtualProps} from './types';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {register} from 'be-hive/register.js';

export class BeInclusiveController implements BeInclusiveActions{
    #beString!: string;
    #isString!: string;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps){
        this.#beString = `be-${bdp.ifWantsToBe}`;
        this.#isString = `is-${bdp.ifWantsToBe}`;
    }
    onOf({proxy, of, shadow}: this){
        const templ = upShadowSearch(proxy, of) as HTMLTemplateElement;
        if(templ === null || !(templ instanceof HTMLTemplateElement)){
            console.error({of, proxy, msg:"Could not locate template."});
            return;
        }
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        this.doInclRecursive(this, clone);
        if(shadow !== undefined){
            if(proxy.shadowRoot === null){
                proxy.attachShadow({mode: shadow});
            }
            proxy.shadowRoot!.appendChild(clone);
        }else{
            proxy.appendChild(clone);
        }
        
    }

    doInclRecursive({proxy}: this, clone: DocumentFragment){
        const inclusiveChildren = Array.from(clone.querySelectorAll(this.#beString));
        for(const inclusiveChild of inclusiveChildren){
            const attr = inclusiveChild.getAttribute(this.#beString)!.trim();
            inclusiveChild.removeAttribute(this.#beString);
            inclusiveChild.setAttribute(this.#isString, attr);
            const props: BeInclusiveProps = attr[0] === '{' ? JSON.parse(attr) : {of: attr};
            const {shadow, of} = props;
            const templ = upShadowSearch(proxy, of) as HTMLTemplateElement;
            if(templ === null || !(templ instanceof HTMLTemplateElement)){
                console.error({of, proxy, msg:"Could not locate template."});
                return;
            }
            const clone = templ.content.cloneNode(true) as DocumentFragment;
            this.doInclRecursive(this, clone);
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
