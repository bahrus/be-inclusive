import {BeDecoratedProps} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
import {RenderContext} from 'trans-render/lib/types';

export interface BeInclusiveVirtualProps{
    of: string | (string | BeInclusiveVirtualProps)[];
    shadow?: 'open' | 'closed' | undefined;
    transform?: any,
    model?: any,
    modelSrc?: string | IObserve,
    prepend?: boolean,
    transformPlugins?: {[key: string]: boolean},
}

export interface BeInclusiveWithStateVirtualProps extends BeInclusiveVirtualProps{
    ctx: RenderContext,
}

export interface BeInclusiveProps extends BeInclusiveWithStateVirtualProps{
    proxy: Element & BeInclusiveWithStateVirtualProps,
}

export interface BeInclusiveActions{
    onOf(self: this): void;
    onModel(self: this): void;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps): void;
    batonPass(proxy: Element & BeInclusiveVirtualProps, target: Element, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: Element & BeInclusiveVirtualProps, target: Element, beDecor: BeDecoratedProps): void;
}