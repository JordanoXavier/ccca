import Ride from "../../domain/rideAggregate/Ride";
import RideRepository from "../../infra/repositories/ride/RideRepository";

export default class GetRide {
	constructor (private rideRepository: RideRepository) {
	}
	
	async execute (rideId: string): Promise<Ride | undefined> {
		const ride = await this.rideRepository.getById(rideId);
		return ride;
	}
}
