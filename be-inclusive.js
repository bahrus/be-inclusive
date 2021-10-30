import { define } from 'be-decorated/be-decorated.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
import { register } from 'be-hive/register.js';
export class BeInclusiveController {
    onOf({ proxy, of }) {
        const templ = upShadowSearch(proxy, of);
        if (templ === null || !(templ instanceof HTMLTemplateElement)) {
            console.error({ of, self, msg: "Could not locate template." });
            return;
        }
        if (proxy.shadowRoot === null) {
            proxy.attachShadow({ mode: 'open' });
        }
        proxy.shadowRoot.appendChild(templ.content.cloneNode(true));
    }
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['of'],
            upgrade,
            ifWantsToBe
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
