import AccountRepositoryDatabase from "../src/infra/repositories/account/AccountRepositotyDatabase";
import PositionRepositoryDatabase from "../src/infra/repositories/position/PositionRepositoryDatabase";
import RideRepositoryDatabase from "../src/infra/repositories/ride/RideRepositoryDatabase";
import Signup from "../src/useCases/account/signup";
import UpdatePosition from "../src/useCases/position/UpdatePosition";
import AcceptRide from "../src/useCases/ride/AcceptRide";
import StartRide from "../src/useCases/ride/StartRide";
import RequestRide from "../src/useCases/ride/requestRide";


let updatePosition: UpdatePosition;
let signup: Signup;
let requestRide: RequestRide;
const positionRepository = new PositionRepositoryDatabase();
const rideRepository = new RideRepositoryDatabase();
const accountRepository = new AccountRepositoryDatabase();


beforeEach(async () => {
    updatePosition = new UpdatePosition(positionRepository, rideRepository);
    signup = new Signup(accountRepository);
    requestRide = new RequestRide(rideRepository, accountRepository);
});

test("Deve salvar uma posição", async function () {
    const rideId = await createAndStartRide();
    const positionId = await updatePosition.execute({ride_id: rideId, lat: 2, long: 2});
    const position = await positionRepository.getById(positionId);
    expect(position).toBeTruthy();
    expect(position?.lat).toBe(2);
    expect(position?.long).toBe(2);
});

async function createAndStartRide(): Promise<string>{
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

    return rideOutput.ride_id;
}

test("Deve verificar se a corrida está em status in_progress, se não estiver lançar um erro", async function () {    
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

    await expect(updatePosition.execute({ride_id: rideOutput.ride_id, lat: 2, long: 2})).rejects.toThrow("ride not in progress");
})