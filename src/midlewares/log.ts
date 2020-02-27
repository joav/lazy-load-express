import { Request, Response, NextFunction } from 'express';
export default function log(request:Request, response:Response, next:NextFunction){
    console.log('method', request.method);
	console.log('route', request.originalUrl);
	console.log('params', request.params);
	console.log('boby', request.body);
	next();
}