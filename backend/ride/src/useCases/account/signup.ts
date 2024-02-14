import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
import AccountRepository from "../../repositories/account/AccountRepository";


export default class Signup {
	constructor (private accountRepository: AccountRepository) {
	}
	
	async execute (input: any): Promise<any> {
		const account = await this.accountRepository.getByEmail(input.email);
		if (account) throw new Error("already exists");
		if (!this.validateName(input.name)) throw new Error("invalid name");
		if (!this.validateEmail(input.email)) throw new Error("invalid email");
		if (!validateCpf(input.cpf)) throw new Error("invalid cpf");
		if (input.isDriver && !this.validateCarPlate(input.carPlate)) throw new Error("invalid car plate");
			
		const id = crypto.randomUUID();
		await this.accountRepository.save({ accountId: id, name: input.name, email: input.email, cpf: input.cpf, carPlate: input.carPlate, isPassenger: !!input.isPassenger, isDriver: !!input.isDriver });
	
		return { accountId: id };
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