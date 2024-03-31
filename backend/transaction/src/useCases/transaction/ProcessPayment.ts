import TransactionRepository from "../../infra/repositories/transaction/TransactionRepository";
import Transaction from "../../domain/transactionAggregate/Transaction";


export default class ProcessPayment {
	constructor (private transactionRepository: TransactionRepository) {
	}
	
	async execute (rideId: string, creditCardToken: string, amount: number): Promise<any> {
		const newTransaction = new Transaction(rideId, amount, new Date());	
		await this.transactionRepository.save(newTransaction);
	
		return { accountId: newTransaction.transactionId };
	}
}