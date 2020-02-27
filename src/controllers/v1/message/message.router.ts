import { Routes } from "../../../shared/route";

export const prefix = 'messages';
export const controller = 'message';
export const parent = 'v1';

export const routes:Routes = [
    {
        path: '/get-example',
        handle: 'get',
        method: 'get',
        midlewares: [
            'log'
        ]
    },
    {
        path: '/group-example',
        group: {
            post: 'post',
            put: 'put'
        }
    }
];