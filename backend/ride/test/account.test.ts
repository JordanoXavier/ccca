import { getAccount } from "../src/useCases/account/getAccount";
import { signup } from "../src/useCases/account/signup";

test.each([
	"88946105003",
	"55335504021",
	"58170101000"
])("Deve criar conta de passageiro", async function (cpf: string) {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "admin123"
	};

	const outputSignup = await signup(inputSignup);
	const outputGetAccount = await getAccount(outputSignup.accountId);

	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Deve criar a conta de motorista", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "55335504021",
		isDriver: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	const outputSignup = await signup(inputSignup);
	const outputGetAccount = await getAccount(outputSignup.accountId);

	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.car_plate).toBe(inputSignup.carPlate)
});

test("Não deve criar a conta de motorista com placa de carro inválida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "55335504021",
		isDriver: true,
		password: "admin123",
		carPlate: "AB11234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid car plate"));
});

test("Não deve criar conta com CPF inválido", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "aaaaaa",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid cpf"));
});

test("Não deve criar conta sem CPF", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid cpf"));
});

test("Não deve criar conta com CPF com todos dígitos iguais", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "11111111111",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid cpf"));
});

test("Não deve criar conta com e-mail inválido", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "55335504021",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid email"));
});

test("Não deve criar conta com nome inválido", async function () {
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "55335504021",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("invalid name"));
});

test("Não deve criar conta com e-mail já existente", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "55335504021",
		isPassenger: true,
		password: "admin123",
		carPlate: "ABC1234",
	};

	await signup(inputSignup);
	await expect(() => signup(inputSignup)).rejects.toThrow(new Error("already exists"));
});

