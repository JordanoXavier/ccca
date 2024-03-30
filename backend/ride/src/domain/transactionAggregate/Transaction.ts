export default class Transaction {
	transactionId: string;
    rideId: string;
    amount: number;
    date: Date;
    status: string;

    constructor (transactionId: string, rideId: string, amount: number, date: Date) {
        this.transactionId = transactionId || crypto.randomUUID();
        this.rideId = rideId;
        this.amount = amount;
        this.date = date;
        this.status = "paid";
    }
}