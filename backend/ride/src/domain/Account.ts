import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import CarPlate from "./CarPlate";
import Name from "./Name";

export default class Account {
	accountId: string;
	name: Name;
	email: string;
	cpf: string;
	carPlate: CarPlate | null;
	isPassenger: boolean;
	isDriver: boolean;

	constructor (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, accountId?: string) {
		if (!this.validateEmail(email)) throw new Error("invalid email");
		if (!validateCpf(cpf)) throw new Error("invalid cpf");
		this.accountId = accountId || crypto.randomUUID();
		this.name = new Name(name);
		this.email = email;
		this.cpf = cpf;
		this.carPlate = isDriver ? new CarPlate(carPlate) : null;
		this.isPassenger = isPassenger;
		this.isDriver = isDriver;
	}
	
	private validateEmail (str: string) {
		return str.match(/^(.+)@(.+)$/);
	}

}