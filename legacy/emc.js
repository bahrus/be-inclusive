// @ts-check
import { BeHive, seed, MountObserver} from 'be-hive/be-hive.js';
/** @import {EMC} from '../ts-refs/trans-render/be/types.js' */

/**
 * @type {EMC}
 */
export const emc = {
    base: 'be-inclusive',
    map:{
        '0.0': {
            instanceOf: 'Object',
            mapsTo: '.',
        }
    },
    enhPropKey: 'beInclusive',
    importEnh: async () => {
        const { BeInclusive } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-inclusive.js'));
        return BeInclusive;
    }
};

const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);