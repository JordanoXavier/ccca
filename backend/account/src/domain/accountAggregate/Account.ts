import crypto from "crypto";
import CarPlate from "./CarPlate";
import Name from "./Name";
import Cpf from "./Cpf";
import Email from "./Email";

export default class Account {
	accountId: string;
	name: Name;
	email: Email;
	cpf: Cpf;
	carPlate: CarPlate | null;
	isPassenger: boolean;
	isDriver: boolean;
	creditCardToken: string;


	constructor (name: string, email: string, cpf: string, carPlate: string, isPassenger: boolean, isDriver: boolean, creditCardToken: string ,accountId?: string) {
		this.accountId = accountId || crypto.randomUUID();
		this.name = new Name(name);
		this.email = new Email(email);
		this.cpf = new Cpf(cpf);
		this.carPlate = isDriver ? new CarPlate(carPlate) : null;
		this.isPassenger = isPassenger;
		this.isDriver = isDriver;
		this.creditCardToken = creditCardToken;
	}
}