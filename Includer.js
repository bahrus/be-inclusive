import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { DTR } from 'trans-render/lib/DTR.js';
import './trPlugin.js';
export class Includer {
    proxy;
    props;
    peer;
    #lastModel;
    didInclude = false;
    constructor(proxy, props, peer) {
        this.proxy = proxy;
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
        const { proxy } = self;
        if (of === undefined)
            return;
        if (typeof of === 'string') {
            this.doOneOf(proxy, of, shadow, transform, model, model, !!prepend, ctx);
        }
        else {
            const { length } = of;
            for (let i = 0; i < length; i++) {
                const oneOf = of[i];
                if (typeof oneOf === 'string') {
                    await this.doOneOf(proxy, oneOf, shadow, transform, model, model, !!prepend, ctx);
                }
                else {
                    await this.doOneOf(proxy, oneOf.of, oneOf.shadow, oneOf.transform, model, model, !!prepend, ctx);
                }
            }
        }
    }
    async doOneOf(proxy, of, shadow, transform, model, modelSrc, prepend, ctx) {
        let templ = upShadowSearch(proxy, of);
        if (templ === null && ctx.shadowPeer !== undefined) {
            templ = upShadowSearch(ctx.shadowPeer, of);
        }
        if (templ === null || !(templ instanceof HTMLTemplateElement)) {
            console.error({ of, proxy, msg: "Could not locate template." });
            return;
        }
        const clone = templ.content.cloneNode(true);
        await DTR.transform(clone, ctx);
        const verb = prepend ? 'prepend' : 'appendChild';
        if (shadow !== undefined) {
            if (proxy.shadowRoot === null) {
                proxy.attachShadow({ mode: shadow });
            }
            proxy.shadowRoot[verb](clone);
        }
        else {
            proxy[verb](clone);
        }
    }
    onModel(self) {
        const { proxy } = this;
        const { model, ctx } = this.props;
        if (model === this.#lastModel)
            return;
        ctx.host = model;
        DTR.transform(proxy.shadowRoot || proxy, ctx);
    }
    dispose() { }
}
