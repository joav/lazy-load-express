import { Express } from "express";
import { sync } from "glob";
import { Route, Routes } from "./route";
import { Request, Response } from 'express';

export class RoutesLoader {
    constructor(private app:Express){
        const structure = this.getStructure();
        this.setRoutes(structure);
    }
    private getStructure() {
        const files = sync(__dirname + './../controllers/**/*.router.js');
        const structure:RouteStructure = {};
        for (const file of files) {
            const {routes, prefix, parent, controller} = require(file) as {prefix?:string, parent?:string, controller?:string, routes:Routes};
            for (const route of routes) {
                if(route.withChilds && route.name){
                    structure[route.name] = {
                        ...route,
                        childs: []
                    }
                }else if(parent && prefix && controller){
                    structure[parent].childs.push({...route, prefix, parent, controller});
                }
            }
        }
        return structure;
    }

    private setRoutes(struct:RouteStructure){
        for (const key in struct) {
            if (struct.hasOwnProperty(key)) {
                for (const route of struct[key].childs) {
                    const midlewares = [];
                    if(route.midlewares){
                        midlewares.push(...(route.midlewares.map(m => require(__dirname + './../midlewares/' + m).default)))
                    }
                    const handle = this.handleRoute(route);
                    const path = `${struct[key].path}/${route.prefix}${route.path}`;
                    if(handle){
                        if(route.group){
                            const r = this.app.route(path);
                            if(route.group.get){
                                r.get(...midlewares, handle.get);
                            }
                            if(route.group.post){
                                r.post(...midlewares, handle.post);
                            }
                            if(route.group.put){
                                r.put(...midlewares, handle.put);
                            }
                            if(route.group.delete){
                                r.delete(...midlewares, handle.delete);
                            }
                        }else{
                            switch(route.method){
                                case "get":
                                    this.app.get(path, ...midlewares, handle);
                                    break;
                                case "post":
                                    this.app.post(path, ...midlewares, handle);
                                    break;
                                case "put":
                                    this.app.put(path, ...midlewares, handle);
                                    break;
                                case "delete":
                                    this.app.delete(path, ...midlewares, handle);
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    private handleRoute(route:RouteWithPrefix){
        if(route.handle !== undefined){
            return (request:Request, response:Response) => {
                const controller = new (require(`${__dirname}./../controllers/${route.parent}/${route.controller}/${route.controller}.controller`)[ucfirst(route.controller) + 'Controller'])();
                const handle = controller[(route.handle || 'index')](request, response);
                if(handle instanceof Promise){
                    handle.then(console.log).catch(console.warn);
                }
            }
        }
        if(route.group){
            const obj:any = {};
            if(route.group.get){
                obj.get = this.handleRoute({
                    ...route,
                    handle: route.group.get
                });
            }
            if(route.group.post){
                obj.post = this.handleRoute({
                    ...route,
                    handle: route.group.post
                });
            }
            if(route.group.put){
                obj.put = this.handleRoute({
                    ...route,
                    handle: route.group.put
                });
            }
            if(route.group.delete){
                obj.delete = this.handleRoute({
                    ...route,
                    handle: route.group.delete
                });
            }
            return obj;
        }
    }
}

interface RouteWithPrefix extends Route {
    prefix:string;
    parent:string;
    controller:string;
}

interface RouteWithChilds extends Route {
    childs:RouteWithPrefix[];
}

type RouteStructure = {[key:string]:RouteWithChilds};

function ucfirst(str:string) {
    return str[0].toUpperCase() + str.slice(1);
}
