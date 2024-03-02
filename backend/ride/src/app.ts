import express, { Request, Response, NextFunction } from 'express';
import account from './infra/controllers/accountController';
import ride from './infra/controllers/rideController';
import ExpressAdapter from './infra/http/ExpressAdapter';

const app = new ExpressAdapter();
 
app.register("/account", account);
app.register("/ride", ride);
 
export default app;