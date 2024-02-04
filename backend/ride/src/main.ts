import crypto from "crypto";
import pgp from "pg-promise";

export function validateCpf (str: string) {
	if (str !== null) {
		if (str !== undefined) {
			if (str.length >= 11 && str.length <= 14){
				// cleaning cpf
				str=str
					.replace('.','')
					.replace('.','')
					.replace('-','')
					.replace(" ","");  
				if (!str.split("").every(c => c === str[0])) {
					try{  
						let d1, d2;  
						let dg1, dg2, rest;  
						let digito;  
						let nDigResult;  
						d1 = d2 = 0;  
						dg1 = dg2 = rest = 0;  
							
						for (let nCount = 1; nCount < str.length -1; nCount++) {  
								digito = parseInt(str.substring(nCount -1, nCount));  							
								d1 = d1 + ( 11 - nCount ) * digito;  
								d2 = d2 + ( 12 - nCount ) * digito;  
						};  
						rest = (d1 % 11);  
						dg1 = (rest < 2) ? dg1 = 0 : 11 - rest;  
						d2 += 2 * dg1;  
						rest = (d2 % 11);  
						if (rest < 2)  
							dg2 = 0;  
						else  
							dg2 = 11 - rest;  
				
						let nDigVerific = str.substring(str.length-2, str.length);  
						nDigResult = "" + dg1 + "" + dg2;  

						return nDigVerific == nDigResult;
					}catch (e){  
						console.error("Erro !"+e);  
						return false;  
					}  
				} else return false
			}else return false;
		}
	} else return false;
}

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

export async function getAccount (accountId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return account;
}