import { register } from 'trans-render/lib/pluginMgr.js';
export const trPlugin = {
    selector: 'beInclusiveAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host }) => {
        if (customElements.get('be-inclusive') === undefined)
            return;
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-inclusive');
        attach(target, 'inclusive', instance.attach.bind(instance));
    }
};
register(trPlugin);
