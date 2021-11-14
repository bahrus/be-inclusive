import {BeDecoratedProps} from 'be-decorated/types';

export interface BeInclusiveVirtualProps{
    of: string;
    shadow: 'open' | 'closed' | undefined;
}
export interface BeInclusiveProps extends BeInclusiveVirtualProps{
    proxy: Element & BeInclusiveVirtualProps
}

export interface BeInclusiveActions{
    onOf(self: this): void;
    intro(proxy: Element & BeInclusiveVirtualProps, target: Element, bdp: BeDecoratedProps): void;
}