import pgp from "pg-promise";

export interface account {
	account_id: string;
	name: string;
	email: string;
	cpf: string;
	car_plate: string;
	is_passenger: boolean;
	is_driver: boolean;
}

export async function getAccount (accountId: string): Promise<account> {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return account;
}