import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA} from './types';
import {register} from 'be-hive/register.js';

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
        const slots = content.querySelectorAll('[slot][init-val-from]');
    }
}

export interface BeInclusive<TProps, TMethods, TElement = {}> extends AllProps<TProps, TMethods, TElement>{}

const tagName = 'be-inclusive';

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
                ifAllOf:['isParsed', 'initModel', ]
            }
        }
    },
    superclass: BeInclusive
});