import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import CarPlate from "./CarPlate";

export default class Account {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	carPlate: CarPlate | null;
	isPassenger: boolean;
	isDriver: boolean;

	constructor (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, accountId?: string) {
		if (!this.validateName(name)) throw new Error("invalid name");
		if (!this.validateEmail(email)) throw new Error("invalid email");
		if (!validateCpf(cpf)) throw new Error("invalid cpf");
		this.accountId = accountId || crypto.randomUUID();
		this.name = name;
		this.email = email;
		this.cpf = cpf;
		this.carPlate = isDriver ? new CarPlate(carPlate) : null;
		this.isPassenger = isPassenger;
		this.isDriver = isDriver;
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