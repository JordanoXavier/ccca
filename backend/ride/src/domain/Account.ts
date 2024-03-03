import crypto from "crypto";
import { validateCpf } from "./validateCpf";

export default class Account {
	accountId: string;
	name: string;
	email: string;
	cpf: string;
	carPlate: string;
	isPassenger: boolean;
	isDriver: boolean;

	constructor (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, accountId?: string) {
		if (!this.validateName(name)) throw new Error("invalid name");
		if (!this.validateEmail(email)) throw new Error("invalid email");
		if (!validateCpf(cpf)) throw new Error("invalid cpf");
		if (isDriver && !this.validateCarPlate(carPlate)) throw new Error("invalid car plate");
		this.accountId = accountId || crypto.randomUUID();
		this.name = name;
		this.email = email;
		this.cpf = cpf;
		this.carPlate = carPlate;
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