import RideRepository from "../../infra/repositories/ride/RideRepository";
import AccountRepository from "../../../../account/src/infra/repositories/account/AccountRepository";

export default class AcceptRide {
	constructor (private rideRepository: RideRepository, private accountRepository: AccountRepository) {
	}
	
	async execute ({ride_id, driver_id}: {ride_id: string, driver_id: string}) {
        const account = await this.accountRepository.getById(driver_id);
        if (!account) throw new Error("account not found");
        if (!account.isDriver) throw new Error("account is not a driver");
    
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        ride.accept();

        const driverRides = await this.rideRepository.listByDriverId(driver_id);
        const driverRide = driverRides.find(r => r.status.value === "accepted" || r.status.value === "in_progress");
        if (driverRide) throw new Error("driver already has a ride");

        ride.driver = account;
        await this.rideRepository.updateRide(ride);
	}
}
