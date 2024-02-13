import AccountRepository, { Account } from "../../repositories/account/AccountRepository";

export default class GetAccount {
	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (accountId: string): Promise<Account> {
		const account = await this.accountRepository.getById(accountId);
		return account;
	}
}
