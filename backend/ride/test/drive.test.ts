import { signup } from "../src/account";
import { requestRide } from "../src/ride";

// * deve verificar se o account_id tem is_passenger true
// * deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro
// * deve gerar o ride_id (uuid)
// * deve definir o status como "requested"
// * deve definir date com a data atual
// * deve inserir a corrida no banco de dados
// * deve retornar o ride_id

test("Deve criar uma corrida", async function () {
    const passengerInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "88946105003",
		isPassenger: true,
		password: "admin123"
	};
	const outputSignup = await signup(passengerInput);

    const input = {
        passenger_id: outputSignup.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };

    const output = await requestRide(input);
    expect(output).toBeDefined();
});