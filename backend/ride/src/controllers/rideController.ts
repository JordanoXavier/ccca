import express, { Request, Response } from 'express';
import RideRepositoryDatabase from '../repositories/ride/RideRepositoryDatabase';
import RequestRide from '../useCases/ride/RequestRide';
import AccountRepositoryDatabase from '../repositories/account/AccountRepositotyDatabase';
import GetRide from '../useCases/ride/GetRide';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const rideRepository = new RideRepositoryDatabase();
    const accountRepository = new AccountRepositoryDatabase();
    const requestRide = new RequestRide(rideRepository, accountRepository);

    const result = await requestRide.execute(req.body);
    res.send(result);
});

router.get('/:id', async (req: Request, res: Response) => {
    const rideRepository = new RideRepositoryDatabase();
    const getRide = new GetRide(rideRepository);

    const ride = await getRide.execute(req.params.id);
    res.send(ride);
});

export default router;
