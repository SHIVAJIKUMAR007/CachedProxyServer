import express, {Express, Request, Response} from 'express';
import { httpMethods } from './src/Utils/constant';
import axios, { AxiosError } from 'axios';
import { LRUCache } from './src/Utils/LRUCache';
import router from './src/router'
require('dotenv').config()
const port = process.env.PORT;

const app: Express = express();
// Parse incoming request bodies with JSON payloads
app.use(express.json());
// Parse incoming request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

router(app)

app.get('/',  (req: Request, res: Response)=>{
    res.send('Hello, this is Express ❤️+ TypeScript');
})

//404 page
app.get("*", (req:Request, res:Response) => {
    res.status(404).send({error:"Invalid URL!!\nPlease check url again."});
});

app.listen(port, ()=> {
console.log(`[Server]: I am  running at http://localhost:${port}`);
});







// app.post('/processAPI', async (req: Request, res: Response)=>{
//     const reqBody:BodyType = req.body;
//     console.log("req body",reqBody)
//     if(reqBody.method === httpMethods.GET){
//         try {
//             //check url in cache
//             let cacheValue:string|undefined |null = lruCache.get(reqBody.url);
//             if(cacheValue){
//                 console.log("this was cached")
//                 res.status(200).send({res:cacheValue, cacheStatus:"this was cached"}); 
//             }else{
//                 // if not present in cache
//                 let returnData = await axios.get(reqBody.url);
//                 returnData =await returnData.data;
//                 res.status(200).send({res:returnData,cacheStatus:"This was not cached"}); 
//                 // set in cache 
//                 lruCache.put(reqBody.url,returnData.toString());
//             }
            
//         } catch (error:any) {
//             if(error instanceof AxiosError){
//                 res.status(500).send({error:error.message})
//             }else{
//                 res.status(500).send({error:error.message})
//             }
//         }
//     }else {
//         try {
//             const options: RequestInit = {
//                 method: reqBody.method,
//                 headers: reqBody.headers,
//                 body: reqBody.body,
//               };
//             let response = await fetch(req.url,options);

//             if(!response.ok){
//                 res.status(response.status).send({error:'Network response was not ok'});
//             }

//             const responseData = await response.json();
//             // console.log(`${method} Response:`, responseData);
//             res.status(response.status).send(responseData);
//         } catch (error:any) {
//             res.status(500).send({error:error.message});
//         }


//         res.send(404).send({error:"can handle GET request only for now."})
//     }
// });