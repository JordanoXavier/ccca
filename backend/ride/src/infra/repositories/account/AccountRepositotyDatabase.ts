import Account from "../../../domain/Account";
import PgPromiseAdapter from "../../database/PgPromiseAdapter";
import AccountRepository from "./AccountRepository";

export default class AccountRepositoryDatabase implements AccountRepository {

	async save (account: Account) {
		const connection = new PgPromiseAdapter();
		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.name.value, account.email.value, account.cpf.value, account.carPlate?.value, !!account.isPassenger, !!account.isDriver]);
		await connection.close();
	}

	async getById (accountId: string) {
        const connection = new PgPromiseAdapter();
        const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
        await connection.close();

		if(!account) return undefined;
        return new Account(account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver, account.account_id);
    }

    async getByEmail (email: string) {
		const connection = new PgPromiseAdapter();
		const [account] = await connection.query("select * from cccat14.account where email = $1", [email]);
		await connection.close();
		
		if(!account) return undefined;
		return new Account(account.name, account.email, account.cpf, account.car_plate, account.is_passenger, account.is_driver, account.account_id);
	}
}