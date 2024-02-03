import { signup } from "../src/main";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("Deve criar uma conta para o passageiro", async function (cpf: string) {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup(inputSignup);
	// const outputGetAccount = await getAccount(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	// expect(outputGetAccount.name).toBe(inputSignup.name);
	// expect(outputGetAccount.email).toBe(inputSignup.email);
});

