import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import CarPlate from "./CarPlate";
import Name from "./Name";
import Cpf from "./Cpf";

export default class Account {
	accountId: string;
	name: Name;
	email: string;
	cpf: Cpf;
	carPlate: CarPlate | null;
	isPassenger: boolean;
	isDriver: boolean;

	constructor (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, accountId?: string) {
		if (!this.validateEmail(email)) throw new Error("invalid email");
		this.accountId = accountId || crypto.randomUUID();
		this.name = new Name(name);
		this.email = email;
		this.cpf = new Cpf(cpf);
		this.carPlate = isDriver ? new CarPlate(carPlate) : null;
		this.isPassenger = isPassenger;
		this.isDriver = isDriver;
	}
	
	private validateEmail (str: string) {
		return str.match(/^(.+)@(.+)$/);
	}

}