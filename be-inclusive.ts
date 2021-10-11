import {XtalDecor, XtalDecorCore} from 'xtal-decor/xtal-decor.js';
import { XtalDecorProps } from 'xtal-decor/types';
import {CE} from 'trans-render/lib/CE.js';
import { IObserve } from 'be-observant/types';
import {getElementToObserve, addListener} from 'be-observant/be-observant.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';

const ce = new CE<XtalDecorCore<Element>>({
    config:{
        tagName: 'be-inclusive',
        propDefaults:{
            upgrade: '*',
            ifWantsToBe: 'inclusive',
            forceVisible: true,
            virtualProps: ['eventHandlers', 'of']
        }
    },
    complexPropDefaults: {
        actions:[
            ({of, self}) => {
                //console.log({of});
                if(of !== undefined){
                    const templ = upShadowSearch(self, of) as HTMLTemplateElement;
                    if(templ === null || !(templ instanceof HTMLTemplateElement)){
                        console.error({of, self, msg:"Could not locate template."});
                        return;
                    }
                    if(self.shadowRoot === null){
                        self.attachShadow({mode: 'open'});
                    }
                    self.shadowRoot.appendChild(templ.content.cloneNode(true));
                }
            }
        ],
        on:{},
        init:() => {},
        finale: (self: Element, target: Element) => {
            const eventHandlers = (<any>self).eventHandlers;
            for(const eh of eventHandlers){
                eh.elementToObserve.removeEventListener(eh.onz, eh.fn);
            }
        }
    },
    superclass: XtalDecor
});
document.head.appendChild(document.createElement('be-inclusive'));