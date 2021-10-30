export interface BeInclusiveVirtualProps{
    of: string;
}
export interface BeInclusiveProps extends BeInclusiveVirtualProps{
    proxy: Element & BeInclusiveVirtualProps
}

export interface BeInclusiveActions{
    onOf(self: this): void;
}