import Account from "../../domain/accountAggregate/Account";
import AccountRepository from "../../infra/repositories/account/AccountRepository";

export default class GetAccount {
	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (accountId: string): Promise<Account | undefined> {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
