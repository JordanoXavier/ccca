import DistanceCalculator from "../../domain/positionAggregate/DistanceCalculator";
import Position from "../../domain/positionAggregate/Position";
import PositionRepository from "../../infra/repositories/position/PositionRepository";
import RideRepository from "../../infra/repositories/ride/RideRepository";

export default class FinishRide {
    constructor (private positionRepository: PositionRepository, private rideRepository: RideRepository) {
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
    }
}