export default interface AccountRepository  {
	save (account: any): Promise<void>;
	getById (accountId: string): Promise<Account>;
	getByEmail (email: string): Promise<Account>;
}

export interface Account {
	account_id: string;
	name: string;
	email: string;
	cpf: string;
	car_plate: string;
	is_passenger: boolean;
	is_driver: boolean;
}