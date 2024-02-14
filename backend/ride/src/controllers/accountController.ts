import express, { Request, Response } from 'express';
import AccountRepositoryDatabase from '../repositories/account/AccountRepositotyDatabase';
import GetAccount from '../useCases/account/GetAccount';
import Signup from '../useCases/account/Signup';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const accountRepository = new AccountRepositoryDatabase();
    const signup = new Signup(accountRepository);
    const result = await signup.execute(req.body);
    res.send(result);
    
});

router.get('/:id', async (req: Request, res: Response) => {
    const accountRepository = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountRepository);
    const account = await getAccount.execute(req.params.id);
    res.send(account);
});

export default router;
