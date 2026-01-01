// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-inclusive/types' */;

const ofIDRef = String.raw `^(o|O)f (?<idref>.*)`;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-inclusive',
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                includeRules: [
                    {
                        regExp: ofIDRef,
                        defaultVals: {},
                    }

                ]
            }
        }
    },
    enhPropKey: 'beImbued',
    importEnh: async () => {
        const { BeInclusive } = await import('./be-inclusive.js');
        return BeInclusive;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);