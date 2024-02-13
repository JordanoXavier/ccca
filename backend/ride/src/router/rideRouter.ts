import express, { Request, Response } from 'express';
import { requestRide } from '../useCases/ride/requestRide';
import { getRide } from '../useCases/ride/getRide';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const result = await requestRide(req.body);
    res.send(result);
});

router.get('/:id', async (req: Request, res: Response) => {
    const account = await getRide(req.params.id);
    res.send(account);
});

export default router;
