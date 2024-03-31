import DistanceCalculator from "../../domain/positionAggregate/DistanceCalculator";
import PositionRepository from "../../infra/repositories/position/PositionRepository";
import RideRepository from "../../infra/repositories/ride/RideRepository";
import TransactionRepository from "../../infra/repositories/transaction/TransactionRepository";
import ProcessPayment from "../transaction/ProcessPayment";

export default class FinishRide {
    constructor (private positionRepository: PositionRepository, private rideRepository: RideRepository, private transactionRepository: TransactionRepository) {
    }
    
    async execute ({ride_id}: {ride_id: string}) {
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        if (ride.status.value !== "in_progress") throw new Error("ride not in progress");

        const positions = await this.positionRepository.listByRideId(ride_id);
        const distaceCalculator = new DistanceCalculator(positions);
        const totalDistance = distaceCalculator.calculateTotalDistance();

        ride.finish(totalDistance);
        await this.rideRepository.updateRide(ride);


        //SHOULD UPDATE TO QUEUE LATER
        const processPayment = new ProcessPayment(this.transactionRepository);
        await processPayment.execute(ride_id, "1234567890123456", ride.fare || 0);
    }
}