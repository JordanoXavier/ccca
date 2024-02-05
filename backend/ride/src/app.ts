import express, { Request, Response, NextFunction } from 'express';
import "reflect-metadata";
import accountRouter from './router/accountRouter';

const app = express();
app.use(express.json());
 
app.use("/account", accountRouter);
 
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
})
 
export default app;