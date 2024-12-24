export interface IIndexedDbError {
    name: string;
    message: string;
    inner: IInner;
}

interface IInner  {
    code: number;
    message: string;
    name: string;
}