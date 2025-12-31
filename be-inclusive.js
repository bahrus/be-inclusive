// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-inclusive/types' */;
/** @import {IMountObserver} from './ts-refs/mount-observer/types' */

/**
 * @implements {Actions}
 */
class BeInclusive extends BE {
        /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement>}
     */
    static config = {
        propInfo:{
            includeRules: {},
            nodesToInclude: {},
        },
        compacts:{
            when_includeRules_changes_call_hydrate: 0,
        },
        actions:{
            include:{
                ifAllOf: ['nodesToInclude', 'includeRules'],
            }
        }
    }

        /**
     * @type {WeakSet<Element>}
     */
    #alreadyProcessed = new WeakSet();

    /**
     * @type {Array<MutationObserver>}
     */
    #mutationObservers = [];

    /**
     * @type {Array<IMountObserver>}
     */
    #kindredObservers = [];

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        const {enhancedElement, includeRules} = self;
        //const {find} = await import('trans-render/dss/find.js');
        /**
         * @type {Array<Element>}
         */
        let nodesToInclude = [];
        const rn = /** @type {Document | ShadowRoot} */ (enhancedElement.getRootNode());
        for(const includeRule of includeRules){
            const {idref} = includeRule;
            const target =  rn.getElementById(idref);
            if(target === undefined || !(target instanceof HTMLTemplateElement)) continue;
            const {content} = target;
            nodesToInclude = [...nodesToInclude, ...Array.from(content.children)];
            const config = { attributes: true, childList: true, subtree: true };
            const callback = (mutationList, observer) => {
                for (const mutation of mutationList) {
                    const {addedNodes} = mutation;
                    const addedElements = Array.from(addedNodes).filter(x => x instanceof Element);
                    const newNodesToInclude = [...self.nodesToInclude, ...addedElements];
                    self.nodesToInclude = newNodesToInclude;
                }
                
            };
            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(callback);

            // Start observing the target node for configured mutations
            observer.observe(content, config);
            this.#mutationObservers.push(observer);
        }
        
        return /* @type {PAP} */ ({
            nodesToInclude
        });
    }

    /**
     * 
     * @param {Element} enhancedElement 
     */
    async detachedCallback(enhancedElement){
        for(const mo of this.#mutationObservers){
            mo.disconnect();
        }

        for(const mo of this.#kindredObservers){
            mo.disconnect(enhancedElement);
        }
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async include(self){
        const { enhancedElement, nodesToInclude } = self;
        const {beKindred}  = await import('mount-observer/slotkin/beKindred.js');
        for(const node of nodesToInclude){
            if(this.#alreadyProcessed.has(node)) continue;
            this.#alreadyProcessed.add(node);
            this.#kindredObservers.push(beKindred(enhancedElement, node));
        }
        return /* @type {PAP} */ {
            nodesToInclude: []
        }
    }
}

await BeInclusive.bootUp();
export { BeInclusive };