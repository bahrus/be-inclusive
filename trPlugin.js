import { register } from 'trans-render/lib/pluginMgr.js';
import { Includer } from './Includer.js';
export const trPlugin = {
    selector: 'beInclusiveAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host, shadowPeer, ctx }) => {
        let vp;
        if (val?.startsWith('{')) {
            vp = JSON.parse(val);
            vp.ctx = ctx;
        }
        else if (val) {
            vp = {
                of: val,
                ctx: ctx
            };
        }
        if (vp !== undefined) {
            const includer = new Includer(target, vp, shadowPeer);
            await includer.onOf(includer);
        }
    }
};
register(trPlugin);
