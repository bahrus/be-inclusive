import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';


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
    finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}