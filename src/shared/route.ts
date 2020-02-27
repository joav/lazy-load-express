export interface Route {
    path:string;
    handle?:string;
    name?:string;
    withChilds?:boolean;
    method?:Method;
    midlewares?:string[];
    group?:Group;
}

export type Group = {
    get?:string;
    post?:string;
    put?:string;
    delete?:string;
}

export type Method = 'get' | 'post' | 'delete' | 'put';

export type Routes = Route[];