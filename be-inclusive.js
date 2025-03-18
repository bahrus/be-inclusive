// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import { BEConfig, IEnhancement, BEAllProps } from './ts-refs/be-enhanced/types'; */
/** @import { AP, Actions} from './ts-refs/be-inclusive/types'; */

class BeInclusive extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propDefaults: {
            
        }
    }
}

await BeInclusive.bootUp();
export { BeInclusive };