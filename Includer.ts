import {BeInclusiveVirtualProps, BeInclusiveProps, BeInclusiveWithStateVirtualProps} from './types';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {DTR} from 'trans-render/lib/DTR.js';
import { hookUp } from 'be-observant/hookUp.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';

import { RenderContext } from 'trans-render/lib/types';
import { IObserve } from 'be-observant/types';
import './trPlugin.js';

export class Includer{
    #lastModel: any;
    constructor(public proxy: Element, public props: BeInclusiveWithStateVirtualProps, public peer: Element){
        if(props === undefined){
            this.props = proxy as any as BeInclusiveWithStateVirtualProps;
        }
    }

    onOf(self: this){
        if(self.props.ctx === undefined){
            self.props.ctx = {
                plugins: {
                    ...self.props.transformPlugins,
                    beInclusive: true
                },
                shadowPeer: this.peer,
            }
        }
        const {of, shadow, transform, model, prepend, ctx} = self.props;
        const {proxy} = self;
        if(of === undefined) return;
        if(typeof of === 'string'){
            this.doOneOf(proxy, of, shadow, transform, model, model, !!prepend, ctx);
        }else{
            const {length} = of;
            for(let i = 0; i < length; i++){
                const oneOf = of[i];
                if(typeof oneOf === 'string'){
                    this.doOneOf(proxy, oneOf, shadow, transform, model, model, !!prepend, ctx);
                }else{
                    this.doOneOf(proxy, oneOf.of as string, oneOf.shadow, oneOf.transform, model, model, !!prepend, ctx);
                }
            }
        }
    }

    doOneOf(proxy: Element, of: string, shadow: 'open' | 'closed' | undefined, transform: any, model: any, modelSrc: string | IObserve, prepend: boolean, ctx: RenderContext){
        const templ = upShadowSearch(proxy, of) as HTMLTemplateElement;
        if(templ === null || !(templ instanceof HTMLTemplateElement)){
            console.error({of, proxy, msg:"Could not locate template."});
            return;
        }
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'appendChild';
        if(shadow !== undefined){
            if(proxy.shadowRoot === null){
                proxy.attachShadow({mode: shadow});
            }
            proxy.shadowRoot![verb](clone);
        }else{
            proxy[verb](clone);
        }
    }



    onModel(self: this){
        const {proxy} = this;
        const {model, ctx} = this.props;
        if(model === this.#lastModel) return;
        ctx.host = model;
        DTR.transform(proxy.shadowRoot || proxy, ctx);
    }

    dispose(){}
}