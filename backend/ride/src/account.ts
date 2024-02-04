import crypto from "crypto";
import pgp from "pg-promise";

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

export function validateCpf (cpf: string) {
	if (!cpf) return false;
	cpf = clean(cpf);
	if (isInvalidLength(cpf)) return false;
	if (allDigitsAreTheSame(cpf)) return false;
	const firstDigit = calculateDigit(cpf, 10);
	const secondDigit = calculateDigit(cpf, 11);
	return extractCheckDigit(cpf) === `${firstDigit}${secondDigit}`;
}

function clean (cpf: string) {
	return cpf.replace(/\D/g, "");
}

function isInvalidLength (cpf: string) {
	return cpf.length !== 11;
}

function allDigitsAreTheSame (cpf: string) {
	return cpf.split("").every(c => c === cpf[0]);
}

function calculateDigit (cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const rest = total%11;
	return (rest < 2) ? 0 : 11 - rest;
}

function extractCheckDigit (cpf: string) {
	return cpf.slice(9);
}

export async function getAccount (accountId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return account;
}