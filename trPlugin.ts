import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import {BeInclusiveVirtualProps, BeInclusiveWithStateVirtualProps} from './types';
import {Includer} from './Includer.js';
import {passTheBaton} from 'be-decorated/relay.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beInclusiveAttribs',
    ready: true,
    processor: async({target, val, attrib, host, shadowPeer, ctx}: RenderContext) => {
        let vp: BeInclusiveWithStateVirtualProps | undefined;
        if(val?.startsWith('{')){
            vp = JSON.parse(val) as BeInclusiveWithStateVirtualProps;
            vp.ctx = ctx!; 
        }else if(val){
            vp = {
                of: val,
                ctx: ctx!
            };
        }
        if(vp !== undefined){
            const includer = new Includer(target!, vp, shadowPeer!);
            await includer.onOf(includer);
        }
    }
};

register(trPlugin);