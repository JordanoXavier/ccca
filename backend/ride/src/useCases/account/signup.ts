import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function signup (input: any): Promise<any> {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const [existentAccount] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
		if (existentAccount) throw new Error("already exists");
		if (!validateName(input.name)) throw new Error("invalid name");
		if (!validateEmail(input.email)) throw new Error("invalid email");
		if (!validateCpf(input.cpf)) throw new Error("invalid cpf");
		if (input.isDriver && !validateCarPlate(input.carPlate)) throw new Error("invalid car plate");

		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);

		return { accountId: id };
	} finally {
		await connection.$pool.end();
	}
}

function validateName (str: string) {
	return str.match(/[a-zA-Z] [a-zA-Z]+/);
}

function validateEmail (str: string) {
	return str.match(/^(.+)@(.+)$/);
}

function validateCarPlate (str: string) {
	return str.match(/[A-Z]{3}[0-9]{4}/);
}