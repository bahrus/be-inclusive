import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';
import {LoadEvent} from 'mount-observer/MountObserver.js';
import {Transform} from 'trans-render/Transform.js';

export class BeInclusive<TProps, TMethods, TElement = {}> extends BE<AP, Actions, HTMLTemplateElement> implements Actions{
    static override get beConfig(){
        return {
            parse: true,
            primaryProp: 'of',
            primaryPropReq: true,
            isParsedProp: 'isParsed',
        } as BEConfig
    }

    async onInitModel(self: this){
        const {enhancedElement, initModel} = self;
        const {content} = enhancedElement;
        const slots = Array.from(content.querySelectorAll('[slot][init-val-from]'));
        
        for(const slot of slots){
            const initValFrom = slot.getAttribute('init-val-from')!;
            slot.removeAttribute('init-val-from');
            const slotName = slot.slot;
            let val: any;
            if(initValFrom[0] === '.'){
                const {getVal} = await import('trans-render/lib/getVal.js');
                val = getVal({host: slot}, initValFrom);
            }else{
                val = (<any>slot)[initValFrom];
            }
            (<any>initModel)[slotName] = val;
        }
        return {
            model: Object.assign({}, initModel),
        }
    }

    async startWeaving(self: this){
        const {of, model, xform, enhancedElement, slotMap} = self;
        enhancedElement.addEventListener<'load'>('load', async e => {
            const le = e as LoadEvent;
            const {clone} = le;
            Transform<any, any, any>(clone, model, xform!);
            console.log({le});
        }, {once: true});
        enhancedElement.setAttribute('slotmap', JSON.stringify(slotMap));
        enhancedElement.setAttribute('href', of);
        return {
            resolved: true,
        }
    }
}

export interface BeInclusive<TProps, TMethods, TElement = {}> extends AllProps<TProps, TMethods, TElement>{}

export const tagName = 'be-inclusive';

const xe = new XE<AP, Actions>({
    config:{
        tagName,
        propDefaults:{
            ...propDefaults,
        },
        propInfo:{
            ...propInfo,
            
        },
        actions:{
            // onOf:{
            //     ifAllOf:['of', 'isC']
            // },
            onInitModel:{
                ifAllOf: ['isParsed', 'initModel']
            },
            startWeaving:{
                ifAllOf: ['isParsed', 'model', 'slotMap', 'of', 'xform'],
            }
        }
    },
    superclass: BeInclusive
});