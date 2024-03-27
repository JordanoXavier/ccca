import assert from "assert";
import AccountRepositoryDatabase from "../src/infra/repositories/account/AccountRepositotyDatabase";
import RideRepositoryDatabase from "../src/infra/repositories/ride/RideRepositoryDatabase";
import Signup from "../src/useCases/account/signup";
import AcceptRide from "../src/useCases/ride/AcceptRide";
import GetRide from "../src/useCases/ride/getRide";
import RequestRide from "../src/useCases/ride/requestRide";
import StartRide from "../src/useCases/ride/StartRide";
import FinishRide from "../src/useCases/ride/FinishRide";
import PositionRepositoryDatabase from "../src/infra/repositories/position/PositionRepositoryDatabase";
import UpdatePosition from "../src/useCases/position/UpdatePosition";

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

test("Deve criar uma corrida", async function () {
    const passengerInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "88946105003",
		isPassenger: true,
		password: "admin123"
	};
	const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    const rideOutput = await requestRide.execute(rideInput);
    const getRideOutput = await getRide.execute(rideOutput.ride_id);

    expect(rideOutput.ride_id).toBeDefined();
    assert(getRideOutput);
    expect(getRideOutput.passenger?.accountId).toBe(passengerOutput.accountId);
    expect(getRideOutput.driver).toBe(undefined);
    expect(getRideOutput.status.value).toBe("requested");
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
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    await expect(() => requestRide.execute(rideInput)).rejects.toThrow(new Error("account is not a passenger"));
});

test("Não deve criar uma corrida se já houver uma corrida em andamento", async function () {
    const passengerInput = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    await requestRide.execute(rideInput);

    const secondRideInput = {
        passengerId: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    await expect(() => requestRide.execute(secondRideInput)).rejects.toThrow(new Error("ride in progress found"));
});  

test("Deve aceitar uma corrida", async function () {
    const passengerInput = {
        name: "John Doe Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
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
 
    const getRideOutput = await getRide.execute(rideOutput.ride_id);

    assert(getRideOutput);
    expect(getRideOutput.driver?.accountId).toBe(driverOutput.accountId);
    expect(getRideOutput.status.value).toBe("accepted");
}
);

test ("Não deve aceitar uma corrida que não esteja com status requested", async function () {
    const passengerInput = {
        name: "John Doe Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
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

    await expect(() => acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId})).rejects.toThrow(new Error("ride is not requested"));
});

test ("Não deve aceitar uma corrida se o motorista já tiver uma corrida", async function () {
    const passenger1Input = {
        name: "John Doe Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passenger1Input);

    const rideInput = {
        passengerId: passengerOutput.accountId,
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


    const passenger2Input = {
        name: "John Doe Passenger 2",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput2 = await signup.execute(passenger2Input);

    const secondRideInput = {
        passengerId: passengerOutput2.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    const secondRideOutput = await requestRide.execute(secondRideInput);

    await expect(() => acceptRide.execute({ride_id: secondRideOutput.ride_id, driver_id: driverOutput.accountId})).rejects.toThrow(new Error("driver already has a ride"));
});

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
        passengerId: passengerOutput.accountId,
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

    assert(getRideOutput);
    expect(getRideOutput.status.value).toBe("in_progress");
});

test("Não deve iniciar uma corrida que não esteja com status accepted", async function () {
    const passengerInput = {
        name: "John Doe Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
        position: { lat: 0, long: 0 },
        destination: { lat: 10, long: 10 }
    };
    const rideOutput = await requestRide.execute(rideInput);

    const startRide = new StartRide(rideRepository);
    await expect(() => startRide.execute({ride_id: rideOutput.ride_id})).rejects.toThrow(new Error("ride is not accepted"));
});

test("Deve finalizar uma corrida", async function () {
    const passengerInput = {
        name: "John Doe Passenger",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "88946105003",
        isPassenger: true,
        password: "admin123"
    };
    const passengerOutput = await signup.execute(passengerInput);

    const rideInput = {
        passengerId: passengerOutput.accountId,
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

    const positionRepository = new PositionRepositoryDatabase();
    const updatePosition = new UpdatePosition(positionRepository, rideRepository);
    await updatePosition.execute({ride_id: rideOutput.ride_id, lat: 1, long: 1});
    await updatePosition.execute({ride_id: rideOutput.ride_id, lat: 20, long: 20});

    const finishRide = new FinishRide(positionRepository, rideRepository);
    await finishRide.execute({ride_id: rideOutput.ride_id});

    const getRideOutput = await getRide.execute(rideOutput.ride_id);

    assert(getRideOutput);
    expect(getRideOutput.status.value).toBe("completed");
    expect(getRideOutput.fare).toBeDefined();
    expect(getRideOutput.distance).toBeDefined();
    expect(Number(getRideOutput.fare)).toBe(Number(getRideOutput.distance) * 2.1); 
});