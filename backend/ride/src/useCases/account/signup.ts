import AccountRepository from "../../infra/repositories/account/AccountRepository";
import Account from "../../domain/accountAggregate/Account";


export default class Signup {
	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (input: any): Promise<any> {
		const account = await this.accountRepository.getByEmail(input.email);
		if (account) throw new Error("already exists");
		
		const newAccount = new Account(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver, input.creditCardToken);
		await this.accountRepository.save(newAccount);
	
		return { accountId: newAccount.accountId };
	}
}