import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
import AccountRepository from "../../repositories/account/AccountRepository";


export default class Signup {
	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (input: any): Promise<any> {
		const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		try {
			const id = crypto.randomUUID();
			const [existentAccount] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
			if (existentAccount) throw new Error("already exists");
			if (!this.validateName(input.name)) throw new Error("invalid name");
			if (!this.validateEmail(input.email)) throw new Error("invalid email");
			if (!validateCpf(input.cpf)) throw new Error("invalid cpf");
			if (input.isDriver && !this.validateCarPlate(input.carPlate)) throw new Error("invalid car plate");
	
			await this.accountRepository.save({ accountId: id, name: input.name, email: input.email, cpf: input.cpf, carPlate: input.carPlate, isPassenger: !!input.isPassenger, isDriver: !!input.isDriver });
	
			return { accountId: id };
		} finally {
			await connection.$pool.end();
		}
	}

	private validateName (str: string) {
		return str.match(/[a-zA-Z] [a-zA-Z]+/);
	}
	
	private validateEmail (str: string) {
		return str.match(/^(.+)@(.+)$/);
	}
	
	private validateCarPlate (str: string) {
		return str.match(/[A-Z]{3}[0-9]{4}/);
	}
}