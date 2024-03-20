import { Request, Response } from "express";
import { LRUCache } from "../Utils/LRUCache";
import { httpMethods } from "../Utils/constant";
import axios, { AxiosError } from "axios";

const lruCache:LRUCache<string,string> = new LRUCache(3);
interface BodyType{
    url : string;
    method: string;
    headers?: HeadersInit;
    body?: BodyInit;
    session?:any;
}


const processAPI=async (req: Request, res: Response)=>{
    const reqBody:BodyType = req.body;
    console.log("req body",reqBody)
    if(reqBody.method === httpMethods.GET && !reqBody.body && !reqBody.headers){
        try {
            //check url in cache
            let cacheValue:string|undefined |null = lruCache.get(reqBody.url);
            if(cacheValue){
                console.log("this was cached",cacheValue)
                let response = cacheValue;
                try{
                    response = JSON.parse(cacheValue);
                }catch(e){
                    console.log(e)
                    response = cacheValue;
                }
                res.status(200).send({res:response, cacheStatus:"this was cached"}); 
            }else{
                // if not present in cache
                let returnData = await axios.get(reqBody.url);
                returnData =await returnData.data;
                res.status(200).send({res:returnData,cacheStatus:"This was not cached"}); 
                // set in cache 

                let cachedString:any = returnData;
                try {
                    cachedString = JSON.stringify(cachedString)
                } catch (error) {
                    console.log(error);
                    cachedString = returnData.toString();
                }
                lruCache.put(reqBody.url,cachedString);
            }
            
        } catch (error:any) {
            console.log(error);
            if(error instanceof AxiosError){
                res.status(500).send({error:error.message})
            }else{
                res.status(500).send({error:error.message})
            }
        }
    }else {
        try {
            const options: RequestInit = {
                method: reqBody.method,
                headers: reqBody.headers,
                body: reqBody.body,
              };

            console.log(reqBody.url,options)
            let response = await fetch(reqBody.url,options);
            // console.log(response)
            if(!response.ok){
                res.status(response.status).send({error:'Network response was not ok'});
                return;
            }

            const responseData = await response.text(); 
            res.status(response.status).send(responseData);
        } catch (error:any) {
            console.log(error)
            res.status(500).send({error:error.message});
        }


    }
}

export  {
    processAPI
}