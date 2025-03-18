// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
import {Transform} from 'trans-render/Transform.js';
import {LoadEvent} from 'mount-observer/compose.js';
/** @import { BEConfig, IEnhancement, BEAllProps } from './ts-refs/be-enhanced/types'; */
/** @import { AP, Actions, BAP, PAP} from './ts-refs/be-inclusive/types'; */


/**
 * @implements {Actions}
 */
class BeInclusive extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propDefaults: {
            
        }, 
        propInfo:{
            of: {},
            xform: {},
            initModel: {},
            slotMap: {},
            model: {},
        },
        actions: {
            onInitModel: {
                ifAllOf: ['initModel'],
            },
            startWeaving:{
                ifAllOf: ['of', 'xform', 'slotMap', 'model'],
            }
        }
    }

    de = de;

    /**
     * 
     * @param {BAP} self 
     */
    async onInitModel(self){
        const {enhancedElement, initModel} = self;
        const {content} = enhancedElement;
        const slots = Array.from(content.querySelectorAll('[slot]'));
        
        for(const slot of slots){
            const initValFrom = slot.getAttribute('init-val-from');
            const slotName = slot.slot;
            /**
             * @type {any}
             */
            let val;
            if(initValFrom === null){
                const {getSignalVal} = await import('be-linked/getSignalVal.js');
                val = getSignalVal(slot);
                console.log({val});
            }else{
                slot.removeAttribute('init-val-from');
                if(initValFrom[0] === '.'){
                    const {getVal} = await import('trans-render/lib/getVal.js');
                    val = getVal({host: slot}, initValFrom);
                }else{
                    val = (slot)[initValFrom];
                }
            }
            (initModel)[slotName] = val;

        }
        return /** @type {PAP} */({
            model: Object.assign({}, initModel),
        })
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async startWeaving(self){
        const {of, model, xform, enhancedElement, slotMap} = self;
        enhancedElement.addEventListener('load', async e => {
            /**
             * @type {LoadEvent}
             */
            const le = e;
            const {clone} = le;
            const {children} = clone;
            for(const child of children){
                Transform(child, model, xform);
            }
            
            console.log({le});
        }, {once: true});
        enhancedElement.setAttribute('slotmap', JSON.stringify(slotMap));
        enhancedElement.setAttribute('src', of);
        return /** @type {PAP} */({
            resolved: true,
        })
    }
}

await BeInclusive.bootUp();
export { BeInclusive };