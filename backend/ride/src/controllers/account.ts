import express, { Request, Response } from 'express';
import { signup } from '../useCases/account/signup';
import AccountRepositoryDatabase from '../repositories/account/AccountRepositotyDatabase';
import GetAccount from '../useCases/account/GetAccount';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const result = await signup(req.body);
    res.send(result);
});

router.get('/:id', async (req: Request, res: Response) => {
    const accountRepository = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountRepository);
    const account = await getAccount.execute(req.params.id);
    res.send(account);
});

export default router;
