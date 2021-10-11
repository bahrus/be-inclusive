import { XtalDecor } from 'xtal-decor/xtal-decor.js';
import { CE } from 'trans-render/lib/CE.js';
import { upShadowSearch } from 'trans-render/lib/upShadowSearch.js';
const ce = new CE({
    config: {
        tagName: 'be-inclusive',
        propDefaults: {
            upgrade: '*',
            ifWantsToBe: 'inclusive',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'of']
        }
    },
    complexPropDefaults: {
        actions: [
            ({ of, self }) => {
                //console.log({of});
                if (of !== undefined) {
                    const templ = upShadowSearch(self, of);
                    if (templ === null || !(templ instanceof HTMLTemplateElement)) {
                        console.error({ of, self, msg: "Could not locate template." });
                        return;
                    }
                    if (self.shadowRoot === null) {
                        self.attachShadow({ mode: 'open' });
                    }
                    self.shadowRoot.appendChild(templ.content.cloneNode(true));
                }
            }
        ],
        on: {},
        init: () => { },
        finale: (self, target) => {
            const eventHandlers = self.eventHandlers;
            for (const eh of eventHandlers) {
                eh.elementToObserve.removeEventListener(eh.onz, eh.fn);
            }
        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-inclusive'));
