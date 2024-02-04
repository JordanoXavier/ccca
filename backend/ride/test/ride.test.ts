import { signup } from "../src/account";
import { getRide, requestRide } from "../src/ride";

// * deve verificar se o account_id tem is_passenger true
// * deve verificar se já não existe uma corrida do passageiro em status diferente de "completed", se existir lançar um erro

test("Deve criar uma corrida com o status requested", async function () {
    const passengerInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "88946105003",
		isPassenger: true,
		password: "admin123"
	};
	const passengerOutput = await signup(passengerInput);

    const rideInput = {
        passenger_id: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    const rideOutput = await requestRide(rideInput);
    const getRideOutput = await getRide(rideOutput.ride_id);

    expect(rideOutput.ride_id).toBeDefined();
    // expect(getRideOutput.passenger_id).toBe(passengerOutput.accountId);
    // expect(getRideOutput.status).toBe("requested");
});