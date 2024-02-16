import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { birtualize } from 'trans-render/lib/birtualize.js';
const birtualized = new Set();
export class BeInclusive extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'of',
            primaryPropReq: true,
            isParsedProp: 'isC',
        };
    }
    #didInclude = false;
    #timeoutHandler = undefined;
    onOf(self) {
        if (this.#didInclude)
            return;
        const { enhancedElement } = self;
        const { of, shadowRootMode, model, bePrepended } = self;
        if (of === undefined)
            return;
        if (typeof of === 'string') {
            this.doOneOf(self, enhancedElement, of, shadowRootMode, model, !!bePrepended);
        }
        else {
            const { length } = of;
            for (let i = 0; i < length; i++) {
                const oneOf = of[i];
                if (typeof oneOf === 'string') {
                    this.doOneOf(self, enhancedElement, oneOf, shadowRootMode, model, !!bePrepended);
                }
                else {
                    this.doOneOf(self, enhancedElement, oneOf.of, oneOf.shadowRootMode, model, !!bePrepended);
                }
            }
        }
        this.#didInclude = true;
    }
    #templateLookup = {};
    #templSearcher(of, self, templContainer) {
        let templ = this.#templateLookup[of];
        const { enhancedElement } = self;
        if (templ === undefined) {
            if (templContainer instanceof HTMLTemplateElement) {
                templ = templContainer.content.querySelector(`#${of}`);
            }
            if (!templ) {
                templ = upShadowSearch(enhancedElement, of);
            }
            if (templ === null || !(templ instanceof HTMLTemplateElement)) {
                console.error({ of, self, msg: "Could not locate template." });
                return undefined;
            }
            else {
                this.#templateLookup[of] = templ;
            }
        }
        return templ;
    }
    templCloner(templ) {
        let clone;
        //TODO switch to blow-dry
        // const beMemedId = templ.getAttribute('be-memed-id');
        // if(beMemedId){
        //     clone = getContent(beMemedId).cloneNode(true) as DocumentFragment;
        // }else{
        clone = templ.content.cloneNode(true);
        //}
        return clone;
    }
    doOneOf(self, target, of, shadowRootMode, model, prepend) {
        const templ = this.#templSearcher(of, self);
        if (templ === undefined)
            return;
        if (!birtualized.has(templ)) {
            birtualized.add(templ);
            birtualize(templ, this.#templateLookup, (of) => this.#templSearcher(of, self, templ), this.templCloner);
        }
        const clone = this.templCloner(templ);
        //DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'append';
        if (shadowRootMode !== undefined) {
            if (target.shadowRoot === null) {
                target.attachShadow({ mode: shadowRootMode });
            }
            target.shadowRoot[verb](clone);
        }
        else {
            const slots = target.querySelectorAll('[slot]');
            for (const slot of slots) {
                const slotName = slot.getAttribute('slot');
                const slotDestiny = clone.querySelector(`slot[name="${slotName}"]`);
                if (slotDestiny !== null) {
                    slotDestiny.appendChild(slot);
                }
                else {
                    slot.remove();
                }
            }
            target[verb](clone);
        }
    }
    #lastModel;
    async onModel(self) {
        // const {enhancedElement, model, ctx} = self;
        // if(model === this.#lastModel) return;
        // ctx.host = model;
        // await DTR.transform(enhancedElement.shadowRoot || enhancedElement, ctx);
    }
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
            bePrepended: {
                type: 'Boolean'
            }
        },
        actions: {
            onOf: {
                ifAllOf: ['of', 'isC']
            },
            onModel: {
                ifAllOf: ['model',]
            }
        }
    },
    superclass: BeInclusive
});
register(ifWantsToBe, upgrade, tagName);
