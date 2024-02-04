import { get } from "http";
import { signup } from "../src/account";
import { getRide, requestRide } from "../src/ride";

test("Deve criar uma corrida", async function () {
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
    expect(getRideOutput.passenger?.account_id).toBe(passengerOutput.accountId);
    expect(getRideOutput.driver).toBe(null);
    expect(getRideOutput.status).toBe("requested");
});

test("Não deve criar uma corrida se o account_id não for de um passageiro", async function () {
    const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: false,
        isDriver: true,
        carPlate: "ABC1234",
        password: "admin123"
    };
    const passengerOutput = await signup(passengerInput);

    const rideInput = {
        passenger_id: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    await expect(() => requestRide(rideInput)).rejects.toThrow(new Error("account is not a passenger"));
});

test("Não deve criar uma corrida se já houver uma corrida em andamento", async function () {
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
    await requestRide(rideInput);

    const secondRideInput = {
        passenger_id: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    await expect(() => requestRide(secondRideInput)).rejects.toThrow(new Error("ride in progress found"));
});  