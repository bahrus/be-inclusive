import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';
import { XForm } from "trans-render/types";

export interface EndUserProps<TProps, TMethods, TElement = {}> extends IBE<HTMLTemplateElement>{
    of: string,
    xform?: XForm<TProps, TMethods, TElement>,
    initModel?: TProps & TMethods,
    slotMap?: any,
}

export interface AllProps<TProps, TMethods, TElement = {}> extends EndUserProps<TProps, TMethods, TElement>{
    isParsed?: boolean,
    model?: TProps & TMethods,
}

export type AP = AllProps<any, any, any>;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>]

export interface Actions{
    onInitModel(self: this): ProPAP;
    startWeaving(self: this): ProPAP;
}