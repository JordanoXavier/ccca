import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repositories/ride/RideRepository";

export default class GetRide {
	constructor (private rideRepository: RideRepository) {
	}
	
	async execute (rideId: string): Promise<Ride> {
		const ride = await this.rideRepository.getById(rideId);
		return ride;
	}
}
