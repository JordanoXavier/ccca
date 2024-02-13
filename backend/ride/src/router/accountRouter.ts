import express, { Request, Response } from 'express';
import { signup } from '../useCases/account/signup';
import { getAccount } from '../useCases/account/getAccount';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const result = await signup(req.body);
    res.send(result);
});

router.get('/:id', async (req: Request, res: Response) => {
    const account = await getAccount(req.params.id);
    res.send(account);
});

export default router;
