import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeInclusiveActions, BeInclusiveProps, BeInclusiveVirtualProps} from './types';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {register} from 'be-hive/register.js';
import { hookUp } from 'be-observant/hookUp.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import {transform as xf, processTargets} from 'trans-render/lib/transform.js';
import { RenderContext } from 'trans-render/lib/types';
import { IObserve } from 'be-observant/types';
import { unsubscribe } from 'trans-render/lib/subscribe.js';

export class BeInclusiveController implements BeInclusiveActions{
    #beString!: string;
    #isString!: string;
    #lastModel: any;
    #target!: Element;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps){
        this.#beString = `be-${bdp.ifWantsToBe}`;
        this.#isString = `is-${bdp.ifWantsToBe}`;
        this.#target = target;
    }
    finale(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps){
        unsubscribe(proxy);
    }
    onOf({proxy, of, shadow, transform, model, ctx, prepend}: this){
        if(of === undefined) return;
        if(typeof of === 'string'){
            this.doOneOf(proxy, of, shadow, transform, model, model, prepend, ctx);
        }else{
            const {length} = of;
            for(let i = 0; i < length; i++){
                const oneOf = of[i];
                if(typeof oneOf === 'string'){
                    this.doOneOf(proxy, oneOf, shadow, transform, model, model, prepend, ctx);
                }else{
                    this.doOneOf(proxy, oneOf.of as string, oneOf.shadow, oneOf.transform, model, model, prepend, ctx);
                }
            }
        }
        
    }

    doOneOf(proxy: Element & BeInclusiveVirtualProps, of: string, shadow: 'open' | 'closed' | undefined, transform: any, model: any, modelSrc: string | IObserve, prepend: boolean, ctx: RenderContext){
        const templ = upShadowSearch(proxy, of) as HTMLTemplateElement;
        if(templ === null || !(templ instanceof HTMLTemplateElement)){
            console.error({of, proxy, msg:"Could not locate template."});
            return;
        }
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        this.beRecursivelyInclusive(this, clone);
        if(transform !== undefined){
            if(ctx === undefined){
                //firstTime = true;
                ctx ={
                    match: transform,
                    postMatch: [
                        {
                            rhsType: Array,
                            rhsHeadType: Object,
                            ctor: PE
                        },
                        {
                            rhsType: Array,
                            rhsHeadType: String,
                            ctor: SplitText
                        },
                        {
                            rhsType: String,
                            ctor: SplitText,
                        }
                    ],
                };
                ctx.host = model;
                proxy.ctx = ctx;
                this.#lastModel = model;
            }
            xf(clone, ctx);
        }
        const verb = prepend ? 'prepend' : 'appendChild';
        if(shadow !== undefined){
            if(proxy.shadowRoot === null){
                proxy.attachShadow({mode: shadow});
            }
            proxy.shadowRoot![verb](clone);
        }else{
            this.#target[verb](clone);
        }
    }

    onModel({proxy, model, ctx}: this){
        if(model === this.#lastModel) return;
        ctx.host = model;
        xf(proxy.shadowRoot || proxy, ctx);
    }

    //TODO:  make private when skypack supports private methods
    beRecursivelyInclusive({proxy}: this, clone: DocumentFragment){
        const inclusiveChildren = Array.from(clone.querySelectorAll(`[${this.#beString}]`));
        for(const inclusiveChild of inclusiveChildren){
            const attr = inclusiveChild.getAttribute(this.#beString)!.trim();
            inclusiveChild.removeAttribute(this.#beString);
            inclusiveChild.setAttribute(this.#isString, attr);
            const props: BeInclusiveProps = attr[0] === '{' ? JSON.parse(attr) : {of: attr};
            const {shadow, of} = props;
            const templ = upShadowSearch(proxy, of as string) as HTMLTemplateElement; //TODO:  support being an array of strings or virtual props
            if(templ === null || !(templ instanceof HTMLTemplateElement)){
                console.error({of, proxy, msg:"Could not locate template."});
                return;
            }
            const clone = templ.content.cloneNode(true) as DocumentFragment;
            this.beRecursivelyInclusive(this, clone);
            if(shadow !== undefined){
                if(inclusiveChild.shadowRoot === null){
                    inclusiveChild.attachShadow({mode: shadow});
                }
                inclusiveChild.shadowRoot!.appendChild(clone);
            }else{
                inclusiveChild.appendChild(clone);
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
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx', 'prepend'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
            intro: 'intro'
        },
        actions:{
            onOf:{
                ifAllOf:['of']
            },
            onModel:{
                ifAllOf:['model']
            }
        }
    },
    complexPropDefaults:{
        controller: BeInclusiveController
    }
});

register(ifWantsToBe, upgrade, tagName);
