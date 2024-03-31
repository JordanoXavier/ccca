import Transaction from "../../../domain/transactionAggregate/Transaction";
import PgPromiseAdapter from "../../database/PgPromiseAdapter";
import TransactionRepository from "./TransactionRepository";

export default class TransactionRepositoryDatabase implements TransactionRepository {
	async save (transaction: Transaction) {
        const connection = new PgPromiseAdapter();
        await connection.query("insert into cccat14.transaction (transaction_id, ride_id, amount, date, status) values ($1, $2, $3, $4, $5)", [transaction.transactionId, transaction.rideId, transaction.amount, transaction.date, transaction.status]);
        await connection.close();
	}

	async getByRideId (rideId: string) {
        const connection = new PgPromiseAdapter();
        const [transaction] = await connection.query("select * from cccat14.transaction where ride_id = $1", [rideId]);
        await connection.close();
        return new Transaction(transaction.transaction_id, transaction.ride_id, transaction.amount, transaction.date);
    }
}