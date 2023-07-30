import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { register } from 'be-hive/register.js';
import { DTR } from 'trans-render/lib/DTR.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
export class BeInclusive extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'of'
        };
    }
    #didInclude = false;
    async onOf(self) {
        if (this.#didInclude)
            return;
        const { enhancedElement } = self;
        if (self.ctx === undefined) {
            self.ctx = {
                shadowPeer: enhancedElement,
            };
        }
        const { of, shadowRootMode, transform, model, bePrepended, ctx } = self;
        ctx.host = model || {};
        ctx.match = { ...ctx.match, ...transform };
        if (of === undefined)
            return;
        if (typeof of === 'string') {
            await this.doOneOf(self, enhancedElement, of, shadowRootMode, transform, model, !!bePrepended, ctx);
        }
        else {
            const { length } = of;
            for (let i = 0; i < length; i++) {
                const oneOf = of[i];
                if (typeof oneOf === 'string') {
                    await this.doOneOf(self, enhancedElement, oneOf, shadowRootMode, transform, model, !!bePrepended, ctx);
                }
                else {
                    await this.doOneOf(self, enhancedElement, oneOf.of, oneOf.shadowRootMode, oneOf.transform, model, !!bePrepended, ctx);
                }
            }
        }
    }
    #templateLookup = {};
    #templSearcher(of, self) {
        let templ = this.#templateLookup[of];
        const { enhancedElement, ctx } = self;
        if (templ === undefined) {
            templ = upShadowSearch(self, of);
            if (templ === null && ctx.shadowPeer !== undefined) {
                templ = upShadowSearch(ctx.shadowPeer, of);
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
    async doOneOf(self, target, of, shadowRootMode, transform, model, prepend, ctx) {
        const templ = this.#templSearcher(of, self);
        if (templ === undefined)
            return;
        const { birtualize } = await import('trans-render/lib/birtualize.js');
        await birtualize(templ, this.#templateLookup, (of) => this.#templSearcher(of, pp));
        const clone = templ.content.cloneNode(true);
        await DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'append';
        if (shadowRootMode !== undefined) {
            if (target.shadowRoot === null) {
                target.attachShadow({ mode: shadowRootMode });
            }
            target.shadowRoot[verb](clone);
        }
        else {
            target[verb](clone);
        }
    }
    #lastModel;
    async onModel(self) {
        const { enhancedElement, model, ctx } = self;
        if (model === this.#lastModel)
            return;
        ctx.host = model;
        await DTR.transform(enhancedElement.shadowRoot || enhancedElement, ctx);
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
            ...propInfo
        },
        actions: {}
    },
    superclass: BeInclusive
});
register(ifWantsToBe, upgrade, tagName);
