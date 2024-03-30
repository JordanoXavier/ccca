import assert from "assert";
import AccountRepositoryDatabase from "../src/infra/repositories/account/AccountRepositotyDatabase";
import RideRepositoryDatabase from "../src/infra/repositories/ride/RideRepositoryDatabase";
import AcceptRide from "../src/useCases/ride/AcceptRide";
import GetRide from "../src/useCases/ride/getRide";
import RequestRide from "../src/useCases/ride/requestRide";
import StartRide from "../src/useCases/ride/StartRide";
import FinishRide from "../src/useCases/ride/FinishRide";
import PositionRepositoryDatabase from "../src/infra/repositories/position/PositionRepositoryDatabase";
import { getDriver, getPassenger, getRideCommon } from "./ride.test";
import TransactionRepositoryDatabase from "../src/infra/repositories/transaction/TransactionRepositoryDatabase";
import ProcessPayment from "../src/useCases/transaction/ProcessPayment";


let requestRide: RequestRide;
let getRide: GetRide;
let processPayment: ProcessPayment;
const accountRepository = new AccountRepositoryDatabase();
const rideRepository = new RideRepositoryDatabase();
const transactionRepository = new TransactionRepositoryDatabase();
beforeEach(async () => {
    requestRide = new RequestRide(rideRepository, accountRepository);
    getRide = new GetRide(rideRepository);
    processPayment = new ProcessPayment(transactionRepository);
});

test("Deve finalizar uma corrida transação após uma corrida", async function () {
    const rideOutput = await startRide();

    const positionRepository = new PositionRepositoryDatabase();
    const finishRide = new FinishRide(positionRepository, rideRepository);
    await finishRide.execute({ride_id: rideOutput.ride_id});

    const getRideOutput = await getRide.execute(rideOutput.ride_id);

    assert(getRideOutput);
    expect(getRideOutput.status.value).toBe("completed");
});

async function startRide(){
    const passengerOutput = await getPassenger();
    const rideInput = {
        passengerId: passengerOutput.accountId,
        ...getRideCommon()
    };
    const rideOutput = await requestRide.execute(rideInput);

    const driverOutput = await getDriver();
    const acceptRide = new AcceptRide(rideRepository, accountRepository);
    await acceptRide.execute({ride_id: rideOutput.ride_id, driver_id: driverOutput.accountId});

    const startRide = new StartRide(rideRepository);
    await startRide.execute({ride_id: rideOutput.ride_id});
    return rideOutput;
}