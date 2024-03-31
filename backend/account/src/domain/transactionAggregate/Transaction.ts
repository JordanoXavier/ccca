import * as crypto from 'crypto';

export default class Transaction {
	transactionId: string;
    rideId: string;
    amount: number;
    date: Date;
    status: string;

    constructor (rideId: string, amount: number, date: Date, transactionId?: string, ) {
        this.transactionId = transactionId || crypto.randomUUID();
        this.rideId = rideId;
        this.amount = amount;
        this.date = date;
        this.status = "paid";
    }
}