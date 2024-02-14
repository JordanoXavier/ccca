import express, { Request, Response, NextFunction } from 'express';
import account from './controllers/accountController';
import ride from './controllers/rideController';

const app = express();
app.use(express.json());
 
app.use("/account", account);
app.use("/ride", ride);
 
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
})
 
export default app;