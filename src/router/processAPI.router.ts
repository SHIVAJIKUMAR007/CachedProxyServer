import Router from 'express'
import { processAPIController } from '../controller';
const router = Router();

router.post('/', processAPIController.processAPI);


export default router;