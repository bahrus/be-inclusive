import { define } from 'be-decorated/DE.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { register } from 'be-hive/register.js';
import { DTR } from 'trans-render/lib/DTR.js';
import { unsubscribe } from 'trans-render/lib/subscribe.js';
export class BeInclusiveController {
    didInclude = false;
    finale(proxy, target, bdp) {
        unsubscribe(proxy);
    }
    async onOf(pp) {
        if (this.didInclude)
            return;
        if (pp.ctx === undefined) {
            pp.ctx = {
                plugins: {
                    ...pp.transformPlugins,
                    beInclusive: true
                },
                shadowPeer: pp.self,
            };
        }
        const { of, shadow, transform, model, prepend, ctx } = pp;
        ctx.host = model || {};
        ctx.match = { ...ctx.match, ...transform };
        const { proxy, self } = pp;
        if (of === undefined)
            return;
        if (typeof of === 'string') {
            await this.doOneOf(pp, self, of, shadow, transform, model, !!prepend, ctx);
        }
        else {
            const { length } = of;
            for (let i = 0; i < length; i++) {
                const oneOf = of[i];
                if (typeof oneOf === 'string') {
                    await this.doOneOf(pp, self, oneOf, shadow, transform, model, !!prepend, ctx);
                }
                else {
                    await this.doOneOf(pp, self, oneOf.of, oneOf.shadow, oneOf.transform, model, !!prepend, ctx);
                }
            }
        }
    }
    #templateLookup = {};
    #templSearcher(of, pp) {
        let templ = this.#templateLookup[of];
        const { self, ctx } = pp;
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
    async doOneOf(pp, target, of, shadow, transform, model, prepend, ctx) {
        const templ = this.#templSearcher(of, pp);
        if (templ === undefined)
            return;
        const { birtualize } = await import('trans-render/lib/birtualize.js');
        await birtualize(templ, this.#templateLookup, (of) => this.#templSearcher(of, pp));
        const clone = templ.content.cloneNode(true);
        await DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'append';
        if (shadow !== undefined) {
            if (target.shadowRoot === null) {
                target.attachShadow({ mode: shadow });
            }
            target.shadowRoot[verb](clone);
        }
        else {
            target[verb](clone);
        }
    }
    #lastModel;
    async onModel(pp) {
        const { proxy } = this;
        const { model, ctx } = pp;
        if (model === this.#lastModel)
            return;
        ctx.host = model;
        await DTR.transform(proxy.shadowRoot || proxy, ctx);
    }
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx', 'prepend', 'transformPlugins'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
            finale: 'finale',
        },
        actions: {
            onOf: {
                ifAllOf: ['of']
            },
            onModel: {
                ifAllOf: ['model']
            }
        }
    },
    complexPropDefaults: {
        controller: BeInclusiveController
    }
});
register(ifWantsToBe, upgrade, tagName);
