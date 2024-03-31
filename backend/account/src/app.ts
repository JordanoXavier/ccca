import express, { Request, Response, NextFunction } from 'express';
import account from './infra/controllers/accountController';
import ExpressAdapter from './infra/http/ExpressAdapter';

const app = new ExpressAdapter();
 
app.register("/account", account);

export default app;