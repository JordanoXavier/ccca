import RideRepository, { Ride } from "../../repositories/ride/RideRepository";

export default class GetRide {
	constructor (private rideRepository: RideRepository) {
	}
	
	async execute (rideId: string): Promise<Ride> {
		const ride = await this.rideRepository.getById(rideId);
		return ride;
	}
}
