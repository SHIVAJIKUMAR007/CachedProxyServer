import express, {Express, Request, Response} from 'express'; 
import { rateLimit } from 'express-rate-limit'
import router from './src/router'

require('dotenv').config()
const port = process.env.PORT;

///////////////////////////////// encryptions ///////////////////////

const app: Express = express();
// Parse incoming request bodies with JSON payloads
app.use(express.json());
// Parse incoming request bodies with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

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
