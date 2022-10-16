import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
import { unsubscribe } from 'trans-render/lib/subscribe.js';
import { Includer } from './Includer.js';
export class BeInclusiveController {
    #includer;
    batonPass(proxy, target, beDecorProps, baton) {
        this.#includer = baton;
    }
    ensure({ proxy, self }) {
        if (this.#includer === undefined) {
            this.#includer = new Includer(proxy, self, proxy, proxy);
        }
    }
    finale(proxy, target, bdp) {
        if (this.#includer !== undefined) {
            this.#includer.dispose();
        }
        unsubscribe(proxy);
    }
    async onOf(pp) {
        this.ensure(pp);
        await this.#includer.onOf(this.#includer);
    }
    async onModel(self) {
        this.ensure(self);
        await self.#includer.onModel(self.#includer);
    }
}
const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx', 'prepend', 'transformPlugins'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
            finale: 'finale',
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
