import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import {RenderContext} from 'trans-render/lib/types';


export interface EndUserProps extends IBE{
    of: string | (string | EndUserProps)[];
    shadowRootMode?: 'open' | 'closed' | undefined;
    transform?: any,
    model?: any,
    bePrepended?: boolean,
    debouncePeriod?: number,
}

export interface AllProps extends EndUserProps{
    ctx: RenderContext,
    isC?: boolean,
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]

export interface Actions{
    onOf(self: this): void;
    onModel(self: this): Promise<void>;
    // finale(proxy: Proxy, self: Element, beDecor: BeDecoratedProps): void;
}