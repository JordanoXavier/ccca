import express, { Request, Response, NextFunction } from 'express';
import accountRouter from './router/accountRouter';
import rideRouter from './router/rideRouter';

const app = express();
app.use(express.json());
 
app.use("/account", accountRouter);
app.use("/ride", rideRouter);
 
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
})
 
export default app;