import Position from "../../domain/positionAggregate/Position";
import PositionRepository from "../../infra/repositories/position/PositionRepository";
import RideRepository from "../../infra/repositories/ride/RideRepository";

export default class UpdatePosition {
    constructor (private positionRepository: PositionRepository, private rideRepository: RideRepository) {
    }
    
    async execute ({ride_id, lat, long}: {ride_id: string, lat: number, long: number}) {
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        if (ride.status.value !== "in_progress") throw new Error("ride not in progress");

        const position = new Position(ride_id, lat, long);
        await this.positionRepository.addPosition(position);
    }
}