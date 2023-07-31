import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import {RenderContext} from 'trans-render/lib/types';
import {DTR} from 'trans-render/lib/DTR.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {birtualize} from 'trans-render/lib/birtualize.js';

const birtualized = new Set<HTMLTemplateElement>();
export class BeInclusive extends BE<AP, Actions> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            primaryProp: 'of'
        } as BEConfig
    }

    #didInclude = false;
    #timoutHandler: number | undefined = undefined;
    async onOf(self: this){
        const {debouncePeriod} = self;
        const debouncePeriod2 = debouncePeriod || 16;
        if(this.#timoutHandler !== undefined){
            clearTimeout(this.#timoutHandler);
        }
        this.#timoutHandler = setTimeout(() => {
            this.onOfCommit(self);
        }, debouncePeriod2) as any as number;
    }

    async onOfCommit(self: this){
        if(this.#didInclude) return;
        const {enhancedElement} = self;
        if(self.ctx === undefined){
            self.ctx = {
                shadowPeer: enhancedElement,
            }
        }
        const {of, shadowRootMode, transform, model, bePrepended, ctx} = self;
        ctx.host = model || {};
        ctx.match = {...ctx.match, ...transform};
        if(of === undefined) return;
        if(typeof of === 'string'){
            await this.doOneOf(self, enhancedElement, of, shadowRootMode, transform, model, !!bePrepended, ctx);
        }else{
            const {length} = of;
            for(let i = 0; i < length; i++){
                const oneOf = of[i];
                if(typeof oneOf === 'string'){
                    await this.doOneOf(self, enhancedElement, oneOf, shadowRootMode, transform, model, !!bePrepended, ctx);
                }else{
                    await this.doOneOf(self, enhancedElement, oneOf.of as string, oneOf.shadowRootMode, oneOf.transform, model, !!bePrepended, ctx);
                }
            }
        }
        this.#didInclude = true;
    }

    #templateLookup: {[key: string]: HTMLTemplateElement} = {};
    #templSearcher(of: string, self: this){
        let templ = this.#templateLookup[of];
        const {enhancedElement, ctx} = self;
        if(templ === undefined){
            templ = upShadowSearch(enhancedElement, of) as HTMLTemplateElement;
            if(templ === null && ctx.shadowPeer !== undefined){
                templ = upShadowSearch(ctx.shadowPeer as Element, of) as HTMLTemplateElement;
            }
            if(templ === null || !(templ instanceof HTMLTemplateElement)){
                console.error({of, self, msg:"Could not locate template."});
                return undefined;
            }else{
                this.#templateLookup[of] = templ;
            }
        }
        return templ;       
    }
    
    async doOneOf(self: this, target: Element, of: string, shadowRootMode: 'open' | 'closed' | undefined, transform: any, model: any, prepend: boolean, ctx: RenderContext){
        const templ = this.#templSearcher(of, self);
        if(templ === undefined) return;
        if(!birtualized.has(templ)){
            birtualized.add(templ);
            birtualize(templ, this.#templateLookup, (of: string) => this.#templSearcher(of, self));
            
        }
        
        const clone = templ.content.cloneNode(true) as DocumentFragment;
        await DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'append';
        if(shadowRootMode !== undefined){
            if(target.shadowRoot === null){
                target.attachShadow({mode: shadowRootMode});
            }
            target.shadowRoot![verb](clone);
        }else{
            const slots =  target.querySelectorAll('[slot-bot]');
            for(const slot of slots){
                const slotName = slot.getAttribute('slot-bot')!;
                const slotDestiny = clone.querySelector(`slot-bot[name="${slotName}"]`);
                if(slotDestiny !== null){
                    slotDestiny.appendChild(slot);
                }else{
                    slot.remove();
                }
            }
            target[verb](clone);
        }
    }

    #lastModel: any;
    async onModel(self: this){
        const {enhancedElement, model, ctx} = self;
        if(model === this.#lastModel) return;
        ctx.host = model;
        await DTR.transform(enhancedElement.shadowRoot || enhancedElement, ctx);
    }
}

export interface BeInclusive extends AllProps{}

const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
            ...propDefaults,
        },
        propInfo:{
            ...propInfo
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
    superclass: BeInclusive
});

register(ifWantsToBe, upgrade, tagName);