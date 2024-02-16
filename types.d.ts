import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import { XForm } from "trans-render/types";


export interface EndUserProps<TProps, TMethods, TElement = {}> extends IBE{
    of: string | (string | EndUserProps<TProps, TMethods, TElement>)[];
    shadowRootMode?: 'open' | 'closed' | undefined;
    xform?: XForm<any, any, any>;
    model?: any,
    bePrepended?: boolean,
    debouncePeriod?: number,
}

export interface AllProps<TProps, TMethods, TElement = {}> extends EndUserProps<TProps, TMethods, TElement>{
    isC?: boolean,
}

export type AP = AllProps<any, any, any>;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]

export interface Actions{
    onOf(self: this): void;
    onModel(self: this): Promise<void>;
    // finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}