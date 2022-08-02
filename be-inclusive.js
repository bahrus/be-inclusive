import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
import { unsubscribe } from 'trans-render/lib/subscribe.js';
import { Includer } from './Includer.js';
export class BeInclusiveController {
    //#target!: Element;
    #includer;
    intro(proxy, target, bdp) {
        // this.#beString = `be-${bdp.ifWantsToBe}`;
        // this.#isString = `is-${bdp.ifWantsToBe}`;
        // this.#target = target;
    }
    batonPass(proxy, target, beDecorProps, baton) {
        this.#includer = baton;
    }
    ensure(self) {
        if (self.#includer === undefined) {
            self.#includer = new Includer(self.proxy, self.proxy, self.proxy);
        }
    }
    finale(proxy, target, bdp) {
        if (this.#includer !== undefined) {
            this.#includer.dispose();
        }
        unsubscribe(proxy);
    }
    async onOf(self) {
        self.ensure(self);
        await self.#includer.onOf(self.#includer);
    }
    onModel(self) {
        self.ensure(self);
        self.#includer.onModel(self.#includer);
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
            intro: 'intro',
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
