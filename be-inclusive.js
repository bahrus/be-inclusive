// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
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
        },
        actions: {

        }
    }

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
}

await BeInclusive.bootUp();
export { BeInclusive };