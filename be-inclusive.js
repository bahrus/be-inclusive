import { define } from 'be-decorated/be-decorated.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { register } from 'be-hive/register.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { transform as xf } from 'trans-render/lib/transform.js';
export class BeInclusiveController {
    #beString;
    #isString;
    #lastModel;
    intro(proxy, target, bdp) {
        this.#beString = `be-${bdp.ifWantsToBe}`;
        this.#isString = `is-${bdp.ifWantsToBe}`;
    }
    onOf({ proxy, of, shadow, transform, model, ctx }) {
        const templ = upShadowSearch(proxy, of);
        if (templ === null || !(templ instanceof HTMLTemplateElement)) {
            console.error({ of, proxy, msg: "Could not locate template." });
            return;
        }
        const clone = templ.content.cloneNode(true);
        this.#beRecursivelyInclusive(this, clone);
        if (transform !== undefined) {
            if (ctx === undefined) {
                //firstTime = true;
                ctx = {
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
        if (shadow !== undefined) {
            if (proxy.shadowRoot === null) {
                proxy.attachShadow({ mode: shadow });
            }
            proxy.shadowRoot.appendChild(clone);
        }
        else {
            proxy.appendChild(clone);
        }
    }
    onModel({ proxy, model, ctx }) {
        if (model === this.#lastModel)
            return;
        ctx.host = model;
        xf(proxy.shadowRoot || proxy, ctx);
    }
    #beRecursivelyInclusive({ proxy }, clone) {
        const inclusiveChildren = Array.from(clone.querySelectorAll(`[${this.#beString}]`));
        for (const inclusiveChild of inclusiveChildren) {
            const attr = inclusiveChild.getAttribute(this.#beString).trim();
            inclusiveChild.removeAttribute(this.#beString);
            inclusiveChild.setAttribute(this.#isString, attr);
            const props = attr[0] === '{' ? JSON.parse(attr) : { of: attr };
            const { shadow, of } = props;
            const templ = upShadowSearch(proxy, of);
            if (templ === null || !(templ instanceof HTMLTemplateElement)) {
                console.error({ of, proxy, msg: "Could not locate template." });
                return;
            }
            const clone = templ.content.cloneNode(true);
            this.#beRecursivelyInclusive(this, clone);
            if (shadow !== undefined) {
                if (inclusiveChild.shadowRoot === null) {
                    inclusiveChild.attachShadow({ mode: shadow });
                }
                inclusiveChild.shadowRoot.appendChild(clone);
            }
            else {
                inclusiveChild.appendChild(clone);
            }
        }
    }
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
            intro: 'intro'
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
