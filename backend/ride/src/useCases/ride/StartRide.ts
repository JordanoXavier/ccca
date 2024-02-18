import RideRepository from "../../repositories/ride/RideRepository";

export default class StartRide {
	constructor (private rideRepository: RideRepository) {
	}
	
	async execute ({ride_id}: {ride_id: string}) {
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        if (ride.status !== "accepted") throw new Error("ride is not accepted");

        ride.status = "in_progress";
        await this.rideRepository.updateRide(ride);
	}
}
