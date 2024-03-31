import express, { Request, Response, NextFunction } from 'express';
import ride from './infra/controllers/rideController';
import ExpressAdapter from './infra/http/ExpressAdapter';

const app = new ExpressAdapter();

app.register("/ride", ride);
 
export default app;