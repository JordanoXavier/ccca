import { getAccount, signup } from "../src/main";

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
		isPassenger: false,
		password: "admin123",
		carPlate: "ABC1234",
	};

	const outputSignup = await signup(inputSignup);
	const outputGetAccount = await getAccount(outputSignup.accountId);

	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.car_plate).toBe(inputSignup.carPlate)
});
