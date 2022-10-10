import {BeInclusiveVirtualProps, BeInclusiveProps, BeInclusiveWithStateVirtualProps} from './types';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {DTR} from 'trans-render/lib/DTR.js';
import {birtualize} from 'trans-render/lib/birtualize.js';
// import { hookUp } from 'be-observant/hookUp.js';
// import { PE } from 'trans-render/lib/PE.js';
// import { SplitText } from 'trans-render/lib/SplitText.js';

import { RenderContext } from 'trans-render/lib/types';
import { IObserve } from 'be-observant/types';
import './trPlugin.js';

export class Includer{
    #lastModel: any;
    didInclude = false;
    #templateLookup: {[key: string]: HTMLTemplateElement};
    constructor(public proxy: Element, public target: Element, public props: BeInclusiveWithStateVirtualProps, public peer: Element){
        if(props === undefined){
            this.props = proxy as any as BeInclusiveWithStateVirtualProps;
        }
        this.#templateLookup = {};
    }

    async onOf(self: this){
        if(this.didInclude) return;
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
        ctx.host = model;
        ctx.match = {...ctx.match, ...transform};
        const {proxy, target} = self;
        if(of === undefined) return;
        if(typeof of === 'string'){
            await this.doOneOf(target, of, shadow, transform, model, model, !!prepend, ctx);
        }else{
            const {length} = of;
            for(let i = 0; i < length; i++){
                const oneOf = of[i];
                if(typeof oneOf === 'string'){
                    await this.doOneOf(target, oneOf, shadow, transform, model, model, !!prepend, ctx);
                }else{
                    await this.doOneOf(target, oneOf.of as string, oneOf.shadow, oneOf.transform, model, model, !!prepend, ctx);
                }
            }
        }
    }

    #templSearcher(of: string){
        let templ = this.#templateLookup[of];
        const {target} = this;
        const ctx = this.props.ctx;
        if(templ === undefined){
            templ = upShadowSearch(target, of) as HTMLTemplateElement;
            if(templ === null && ctx.shadowPeer !== undefined){
                templ = upShadowSearch(ctx.shadowPeer as Element, of) as HTMLTemplateElement;
            }
            if(templ === null || !(templ instanceof HTMLTemplateElement)){
                console.error({of, target, msg:"Could not locate template."});
                return undefined;
            }else{
                this.#templateLookup[of] = templ;
            }
        }
        return templ;       
    }

    async doOneOf(target: Element, of: string, shadow: 'open' | 'closed' | undefined, transform: any, model: any, modelSrc: string | IObserve, prepend: boolean, ctx: RenderContext){
        const templ = this.#templSearcher(of);
        if(templ === undefined) return;
        await birtualize(templ, this.#templateLookup, (of: string) => this.#templSearcher(of));
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        await DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'append';
        if(shadow !== undefined){
            if(target.shadowRoot === null){
                target.attachShadow({mode: shadow});
            }
            target.shadowRoot![verb](clone);
        }else{
            target[verb](clone);
        }
    }



    async onModel(self: this){
        const {proxy} = this;
        const {model, ctx} = this.props;
        if(model === this.#lastModel) return;
        ctx.host = model;
        await DTR.transform(proxy.shadowRoot || proxy, ctx);
    }

    dispose(){
        this.#templateLookup = {};

    }
}