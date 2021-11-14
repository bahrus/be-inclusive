import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
import {RenderContext} from 'trans-render/lib/types';

export interface BeInclusiveVirtualProps{
    of: string;
    shadow: 'open' | 'closed' | undefined;
    transform: any,
    model: any,
    modelSrc: string | IObserve,
    ctx: RenderContext,
}
export interface BeInclusiveProps extends BeInclusiveVirtualProps{
    proxy: Element & BeInclusiveVirtualProps
}

export interface BeInclusiveActions{
    onOf(self: this): void;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps): void;
}