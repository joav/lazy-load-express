import { Request, Response, NextFunction } from 'express';
export class MessageController {
    get(request:Request, response:Response){
        response.send('Hello');
    }
    post(request:Request, response:Response){
        console.log(request.body);
        response.send('Post!');
    }
    put(request:Request, response:Response){
        console.log(request.body);
        response.send('Put!');
    }
}