import { Express } from "express";
import processAPI from "./processAPI.router";


export default (app: Express)=> {
    app.use('/processapi',processAPI)
}