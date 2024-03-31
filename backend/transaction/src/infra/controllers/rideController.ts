import express, { Request, Response } from 'express';
import RideRepositoryDatabase from '../repositories/ride/RideRepositoryDatabase';
import RequestRide from '../../useCases/ride/requestRide';
import AccountRepositoryDatabase from '../repositories/account/AccountRepositotyDatabase';
import GetRide from '../../useCases/ride/getRide';
import AcceptRide from '../../useCases/ride/AcceptRide';
import StartRide from '../../useCases/ride/StartRide';

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

router.post('/accept', async (req: Request, res: Response) => {
    const rideRepository = new RideRepositoryDatabase();
    const accountRepository = new AccountRepositoryDatabase();
    const acceptRide = new AcceptRide(rideRepository, accountRepository);

    const ride = await acceptRide.execute(req.body);
    res.send(ride);
});

router.post('/start', async (req: Request, res: Response) => {
    const rideRepository = new RideRepositoryDatabase();
    const startRide = new StartRide(rideRepository);

    const ride = await startRide.execute(req.body);
    res.send(ride);
});

export default router;
