import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
import { Transform } from 'trans-render/Transform.js';
export class BeInclusive extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'of',
            primaryPropReq: true,
            isParsedProp: 'isParsed',
        };
    }
    async onInitModel(self) {
        const { enhancedElement, initModel } = self;
        const { content } = enhancedElement;
        const slots = Array.from(content.querySelectorAll('[slot]'));
        for (const slot of slots) {
            const initValFrom = slot.getAttribute('init-val-from');
            const slotName = slot.slot;
            let val;
            if (initValFrom === null) {
                const { getSignalVal } = await import('be-linked/getSignalVal.js');
                val = getSignalVal(slot);
                console.log({ val });
            }
            else {
                slot.removeAttribute('init-val-from');
                if (initValFrom[0] === '.') {
                    const { getVal } = await import('trans-render/lib/getVal.js');
                    val = getVal({ host: slot }, initValFrom);
                }
                else {
                    val = slot[initValFrom];
                }
            }
            initModel[slotName] = val;
        }
        return {
            model: Object.assign({}, initModel),
        };
    }
    async startWeaving(self) {
        const { of, model, xform, enhancedElement, slotMap } = self;
        enhancedElement.addEventListener('load', async (e) => {
            const le = e;
            const { clone } = le;
            const { children } = clone;
            for (const child of children) {
                Transform(child, model, xform);
            }
            console.log({ le });
        }, { once: true });
        enhancedElement.setAttribute('slotmap', JSON.stringify(slotMap));
        enhancedElement.setAttribute('href', of);
        return {
            resolved: true,
        };
    }
}
export const tagName = 'be-inclusive';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
        },
        propInfo: {
            ...propInfo,
        },
        actions: {
            // onOf:{
            //     ifAllOf:['of', 'isC']
            // },
            onInitModel: {
                ifAllOf: ['isParsed', 'initModel']
            },
            startWeaving: {
                ifAllOf: ['isParsed', 'model', 'slotMap', 'of', 'xform'],
            }
        }
    },
    superclass: BeInclusive
});
