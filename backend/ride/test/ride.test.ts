import AccountRepositoryDatabase from "../src/repositories/account/AccountRepositotyDatabase";
import RideRepositoryDatabase from "../src/repositories/ride/RideRepositoryDatabase";
import Signup from "../src/useCases/account/Signup";
import AcceptRide from "../src/useCases/ride/AcceptRide";
import GetRide from "../src/useCases/ride/GetRide";
import RequestRide from "../src/useCases/ride/RequestRide";
import StartRide from "../src/useCases/ride/StartRide";

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

// test("Deve aceitar uma corrida", async function () {
//     const passengerInput = {
//         name: "John Doe Passenger",
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
//     const rideOutput = await requestRide.execute(rideInput);

//     const driverInput = {
// 		name: "John Doe Driver",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "55335504021",
// 		isDriver: true,
// 		password: "admin123",
// 		carPlate: "ABC1234",
// 	};
//     const driverOutput = await signup.execute(driverInput);

//     const acceptRide = new AcceptRide(rideRepository, accountRepository);
//     await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});

//     const getRideOutput = await getRide.execute(rideOutput.ride_id);

//     expect(getRideOutput.driver?.account_id).toBe(driverOutput.accountId);
//     expect(getRideOutput.status).toBe("accepted");
// }
// );

// test ("Não deve aceitar uma corrida que não esteja com status requested", async function () {
//     const passengerInput = {
//         name: "John Doe Passenger",
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
//     const rideOutput = await requestRide.execute(rideInput);

//     const driverInput = {
//         name: "John Doe Driver",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "55335504021",
//         isDriver: true,
//         password: "admin123",
//         carPlate: "ABC1234",
//     };
//     const driverOutput = await signup.execute(driverInput);

//     const acceptRide = new AcceptRide(rideRepository, accountRepository);
//     await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});

//     await expect(() => acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId})).rejects.toThrow(new Error("ride is not requested"));
// });

// test ("Não deve aceitar uma corrida se o motorista já tiver uma corrida", async function () {
//     const passenger1Input = {
//         name: "John Doe Passenger",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "88946105003",
//         isPassenger: true,
//         password: "admin123"
//     };
//     const passengerOutput = await signup.execute(passenger1Input);

//     const rideInput = {
//         passenger_id: passengerOutput.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     const rideOutput = await requestRide.execute(rideInput);

//     const driverInput = {
//         name: "John Doe Driver",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "55335504021",
//         isDriver: true,
//         password: "admin123",
//         carPlate: "ABC1234",
//     };
//     const driverOutput = await signup.execute(driverInput);

//     const acceptRide = new AcceptRide(rideRepository, accountRepository);
//     await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});


//     const passenger2Input = {
//         name: "John Doe Passenger 2",
//         email: `john.doe${Math.random()}@gmail.com`,
//         cpf: "88946105003",
//         isPassenger: true,
//         password: "admin123"
//     };
//     const passengerOutput2 = await signup.execute(passenger2Input);

//     const secondRideInput = {
//         passenger_id: passengerOutput2.accountId,
//         position: { lat: 0, long: 0 },
//         destination: { lat: 10, long: 10 }
//     };
//     const secondRideOutput = await requestRide.execute(secondRideInput);

//     await expect(() => acceptRide.execute({ride_id: secondRideOutput.ride_id, driver_id: driverOutput.accountId})).rejects.toThrow(new Error("driver already has a ride"));
// });

test("Deve iniciar uma corrida", async function () {
    const passengerInput = {
        name: "John Doe Passenger",
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
        name: "John Doe Driver",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "55335504021",
        isDriver: true,
        password: "admin123",
        carPlate: "ABC1234",
    };
    const driverOutput = await signup.execute(driverInput);

    const acceptRide = new AcceptRide(rideRepository, accountRepository);
    await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});

    const startRide = new StartRide(rideRepository);
    await startRide.execute({ride_id: rideOutput.ride_id});

    const getRideOutput = await getRide.execute(rideOutput.ride_id);

    expect(getRideOutput.status).toBe("in_progress");
});