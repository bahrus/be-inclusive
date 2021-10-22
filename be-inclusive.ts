import {XtalDecor, XtalDecorCore} from 'xtal-decor/xtal-decor.js';
import { XtalDecorProps } from 'xtal-decor/types';
import {CE} from 'trans-render/lib/CE.js';
import { IObserve } from 'be-observant/types';
import {getElementToObserve} from 'be-observant/getElementToObserve.js';
import {addListener} from 'be-observant/addListener.js';
import {upShadowSearch} from 'trans-render/lib/upShadowSearch.js';
import {register} from 'be-hive/register.js';

const tagName = 'be-inclusive';
const upgrade = '*';
const ifWantsToBe = 'inclusive';

const ce = new CE<XtalDecorCore<Element>>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
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
register(ifWantsToBe, upgrade, tagName);