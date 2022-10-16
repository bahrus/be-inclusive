import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {IObserve} from 'be-observant/types';
import {RenderContext} from 'trans-render/lib/types';


export interface EndUserProps {
    of: string | (string | BeInclusiveVirtualProps)[];
    shadow?: 'open' | 'closed' | undefined;
    transform?: any,
    model?: any,
    modelSrc?: string | IObserve,
    prepend?: boolean,
    transformPlugins?: {[key: string]: boolean},
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    ctx: RenderContext,
}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy,
}

export type PP = ProxyProps;

export interface Actions{
    onOf(self: this): void;
    onModel(self: this): void;
    batonPass(proxy: Proxy, self: Element, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}