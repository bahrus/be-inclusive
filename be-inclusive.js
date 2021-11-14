import { define } from 'be-decorated/be-decorated.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { register } from 'be-hive/register.js';
export class BeInclusiveController {
    onOf({ proxy, of, shadow }) {
        const templ = upShadowSearch(proxy, of);
        if (templ === null || !(templ instanceof HTMLTemplateElement)) {
            console.error({ of, self, msg: "Could not locate template." });
            return;
        }
        const clone = templ.content.cloneNode(true);
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
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['of', 'shadow'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
        },
        actions: {
            onOf: {
                ifAllOf: ['of']
            }
        }
    },
    complexPropDefaults: {
        controller: BeInclusiveController
    }
});
register(ifWantsToBe, upgrade, tagName);
