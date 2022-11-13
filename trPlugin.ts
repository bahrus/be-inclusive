import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {DEMethods} from 'be-decorated/types';
import {register} from 'trans-render/lib/pluginMgr.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beInclusiveAttribs',
    ready: true,
    processor:  async ({target, val, attrib, host}: RenderContext) => {
        if(customElements.get('be-inclusive') === undefined) return;
        const {attach} = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-inclusive') as any as DEMethods;
        attach(target!, 'inclusive', instance.attach.bind(instance));
    }
}

register(trPlugin);