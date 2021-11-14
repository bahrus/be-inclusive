export interface BeInclusiveVirtualProps{
    of: string;
    shadow: 'open' | 'closed' | undefined;
}
export interface BeInclusiveProps extends BeInclusiveVirtualProps{
    proxy: Element & BeInclusiveVirtualProps
}

export interface BeInclusiveActions{
    onOf(self: this): void;
}