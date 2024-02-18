import AccountRepositoryDatabase from "../src/repositories/account/AccountRepositotyDatabase";
import RideRepositoryDatabase from "../src/repositories/ride/RideRepositoryDatabase";
import Signup from "../src/useCases/account/Signup";
import AcceptRide from "../src/useCases/ride/AcceptRide";
import GetRide from "../src/useCases/ride/GetRide";
import RequestRide from "../src/useCases/ride/RequestRide";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
const accountRepository = new AccountRepositoryDatabase();
const rideRepository = new RideRepositoryDatabase();
beforeEach(async () => {
	signup = new Signup(accountRepository);
    requestRide = new RequestRide(rideRepository, accountRepository);
    getRide = new GetRide(rideRepository);
});

// test("Deve criar uma corrida", async function () {
//     const passengerInput = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "88946105003",
// 		isPassenger: true,
// 		password: "admin123"
// 	};
// 	const passengerOutput = await signup.execute(passengerInput);

//     const rideInput = {
//         passenger_id: passengerOutput.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     const rideOutput = await requestRide.execute(rideInput);
//     const getRideOutput = await getRide.execute(rideOutput.ride_id);

//     expect(rideOutput.ride_id).toBeDefined();
//     expect(getRideOutput.passenger?.account_id).toBe(passengerOutput.accountId);
//     expect(getRideOutput.driver).toBe(null);
//     expect(getRideOutput.status).toBe("requested");
// });

// test("Não deve criar uma corrida se o account_id não for de um passageiro", async function () {
//     const passengerInput = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "88946105003",
//         isPassenger: false,
//         isDriver: true,
//         carPlate: "ABC1234",
//         password: "admin123"
//     };
//     const passengerOutput = await signup.execute(passengerInput);

//     const rideInput = {
//         passenger_id: passengerOutput.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("account is not a passenger"));
// });

// test("Não deve criar uma corrida se já houver uma corrida em andamento", async function () {
//     const passengerInput = {
//         name: "John Doe",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "88946105003",
//         isPassenger: true,
//         password: "admin123"
//     };
//     const passengerOutput = await signup.execute(passengerInput);

//     const rideInput = {
//         passenger_id: passengerOutput.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     await requestRide.execute(rideInput);

//     const secondRideInput = {
//         passenger_id: passengerOutput.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     await expect(() => requestRide.execute(secondRideInput)).rejects.toThrow(new Error("ride in progress found"));
// });  

test("Deve aceitar uma corrida", async function () {
    const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passenger_id: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    const rideOutput = await requestRide.execute(rideInput);

    const driverInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "55335504021",
		isDriver: true,
		password: "admin123",
		carPlate: "ABC1234",
	};
    const driverOutput = await signup.execute(driverInput);

    const acceptRide = new AcceptRide(rideRepository, accountRepository);
    await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});

    const getRideOutput = await getRide.execute(rideOutput.ride_id);
    console.log(getRideOutput)
    // expect(getRideOutput.driver?.account_id).toBe(driverOutput.accountId);
    // expect(getRideOutput.status).toBe("accepted");
}
);