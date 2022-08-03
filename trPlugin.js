import { register } from 'trans-render/lib/pluginMgr.js';
import { Includer } from './Includer.js';
export const trPlugin = {
    selector: 'beInclusiveAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host, shadowPeer, ctx }) => {
        delete ctx?.queryCache;
        let vp;
        if (val?.startsWith('{')) {
            vp = JSON.parse(val);
            vp.ctx = ctx;
        }
        else if (val) {
            vp = {
                of: val,
                ctx: ctx,
                transform: ctx.transform,
                model: ctx.host,
            };
        }
        if (vp !== undefined) {
            const includer = new Includer(target, target, vp, shadowPeer);
            await includer.onOf(includer);
            target.removeAttribute('be-inclusive');
            //includer.didInclude = true;
            //passTheBaton('inclusive', target!, includer);
        }
    }
};
register(trPlugin);
