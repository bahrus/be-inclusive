import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
import {RenderContext} from 'trans-render/lib/types';

export interface BeInclusiveVirtualProps{
    of: string | (string | BeInclusiveVirtualProps)[];
    shadow: 'open' | 'closed' | undefined;
    transform: any,
    model: any,
    modelSrc: string | IObserve,
    prepend: boolean,
    ctx: RenderContext,
}
export interface BeInclusiveProps extends BeInclusiveVirtualProps{
    proxy: Element & BeInclusiveVirtualProps
}

export interface BeInclusiveActions{
    onOf(self: this): void;
    onModel(self: this): void;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps): void;
    finale(proxy: Element & BeInclusiveVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
}