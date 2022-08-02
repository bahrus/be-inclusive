import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeInclusiveActions, BeInclusiveProps, BeInclusiveVirtualProps} from './types';

import {register} from 'be-hive/register.js';

import { unsubscribe } from 'trans-render/lib/subscribe.js';
import { Includer } from './Includer.js';

export class BeInclusiveController implements BeInclusiveActions{
    
    //#target!: Element;
    #includer!: Includer;
    
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps){
        // this.#beString = `be-${bdp.ifWantsToBe}`;
        // this.#isString = `is-${bdp.ifWantsToBe}`;
        // this.#target = target;
    }
    batonPass(proxy: Element & BeInclusiveVirtualProps, target: Element, beDecorProps: BeDecoratedProps<any, any>, baton: any): void {
        this.#includer = baton;
    }
    ensure(self: this){
        if(self.#includer === undefined){
            self.#includer = new Includer(self.proxy, self.proxy, self.proxy);
        }
    }
    finale(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps){
        if(this.#includer !== undefined){
            this.#includer.dispose();
        }
        unsubscribe(proxy);
    }
    async onOf(self: this){
        self.ensure(self);
        await self.#includer.onOf(self.#includer);
    }


    onModel(self: this){
        self.ensure(self);
        self.#includer.onModel(self.#includer);
    }


}

export interface BeInclusiveController extends BeInclusiveProps{}

const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';

define<BeInclusiveProps & BeDecoratedProps<BeInclusiveProps, BeInclusiveActions>, BeInclusiveActions>({
    config:{
        tagName,
        propDefaults:{
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx', 'prepend', 'transformPlugins'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
            intro: 'intro',
            finale: 'finale',
        },
        actions:{
            onOf:{
                ifAllOf:['of']
            },
            onModel:{
                ifAllOf:['model']
            }
        }
    },
    complexPropDefaults:{
        controller: BeInclusiveController
    }
});

register(ifWantsToBe, upgrade, tagName);
