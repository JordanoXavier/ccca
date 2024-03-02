import RideRepository from "../../infra/repositories/ride/RideRepository";
import AccountRepository from "../../infra/repositories/account/AccountRepository";

export default class AcceptRide {
	constructor (private rideRepository: RideRepository, private accountRepository: AccountRepository) {
	}
	
	async execute ({ride_id, driver_id}: {ride_id: string, driver_id: string}) {
        const account = await this.accountRepository.getById(driver_id);
        if (!account.is_driver) throw new Error("account is not a driver");
    
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        if (ride.status !== "requested") throw new Error("ride is not requested");

        const driverRides = await this.rideRepository.listByDriverId(driver_id);
        const driverRide = driverRides.find(r => r.status === "accepted" || r.status === "in_progress");
        if (driverRide) throw new Error("driver already has a ride");

        ride.driver = account;
        ride.status = "accepted";
        await this.rideRepository.updateRide(ride);
	}
}
