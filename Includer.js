import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { DTR } from 'trans-render/lib/DTR.js';
import './trPlugin.js';
export class Includer {
    proxy;
    target;
    props;
    peer;
    #lastModel;
    didInclude = false;
    constructor(proxy, target, props, peer) {
        this.proxy = proxy;
        this.target = target;
        this.props = props;
        this.peer = peer;
        if (props === undefined) {
            this.props = proxy;
        }
    }
    async onOf(self) {
        if (this.didInclude)
            return;
        if (self.props.ctx === undefined) {
            self.props.ctx = {
                plugins: {
                    ...self.props.transformPlugins,
                    beInclusive: true
                },
                shadowPeer: this.peer,
            };
        }
        const { of, shadow, transform, model, prepend, ctx } = self.props;
        ctx.host = model;
        ctx.match = { ...ctx.match, ...transform };
        const { proxy, target } = self;
        if (of === undefined)
            return;
        if (typeof of === 'string') {
            await this.doOneOf(target, of, shadow, transform, model, model, !!prepend, ctx);
        }
        else {
            const { length } = of;
            for (let i = 0; i < length; i++) {
                const oneOf = of[i];
                if (typeof oneOf === 'string') {
                    await this.doOneOf(target, oneOf, shadow, transform, model, model, !!prepend, ctx);
                }
                else {
                    await this.doOneOf(target, oneOf.of, oneOf.shadow, oneOf.transform, model, model, !!prepend, ctx);
                }
            }
        }
    }
    async doOneOf(target, of, shadow, transform, model, modelSrc, prepend, ctx) {
        let templ = upShadowSearch(target, of);
        if (templ === null && ctx.shadowPeer !== undefined) {
            templ = upShadowSearch(ctx.shadowPeer, of);
        }
        if (templ === null || !(templ instanceof HTMLTemplateElement)) {
            console.error({ of, target, msg: "Could not locate template." });
            return;
        }
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
    async onModel(self) {
        const { proxy } = this;
        const { model, ctx } = this.props;
        if (model === this.#lastModel)
            return;
        ctx.host = model;
        await DTR.transform(proxy.shadowRoot || proxy, ctx);
    }
    dispose() { }
}
