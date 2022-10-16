import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, ProxyProps, PP, Proxy} from './types';

import {register} from 'be-hive/register.js';

import { unsubscribe } from 'trans-render/lib/subscribe.js';
import { Includer } from './Includer.js';

export class BeInclusiveController implements Actions{
    
    #includer!: Includer;
    

    batonPass(proxy: Proxy, target: Element, beDecorProps: BeDecoratedProps<any, any>, baton: any): void {
        this.#includer = baton;
    }
    ensure({proxy, self}: PP){
        if(this.#includer === undefined){
            this.#includer = new Includer(proxy, self, proxy, proxy);
        }
    }

    finale(proxy: Proxy, target: Element, bdp: BeDecoratedProps){
        if(this.#includer !== undefined){
            this.#includer.dispose();
        }
        unsubscribe(proxy);
    }
    async onOf(pp: PP){
        this.ensure(pp);
        await this.#includer.onOf(this.#includer);
    }


    async onModel(self: this){
        this.ensure(self);
        await self.#includer.onModel(self.#includer);
    }


}

export interface BeInclusiveController extends ProxyProps{}

const tagName = 'be-inclusive';
const ifWantsToBe = 'inclusive';
const upgrade = '*';

define<ProxyProps & BeDecoratedProps<ProxyProps, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            virtualProps: ['of', 'shadow', 'transform', 'model', 'modelSrc', 'ctx', 'prepend', 'transformPlugins'],
            upgrade,
            ifWantsToBe,
            primaryProp: 'of',
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
