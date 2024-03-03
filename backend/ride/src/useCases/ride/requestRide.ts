import pgp from "pg-promise";
import crypto from "crypto";
import RideRepository from "../../infra/repositories/ride/RideRepository";
import AccountRepository from "../../infra/repositories/account/AccountRepository";

interface position {
    lat: number;
    long: number;
}

export default class RequestRide {
	constructor (private rideRepository: RideRepository, private accountRepository: AccountRepository) {
	}
	
	async execute ({passenger_id, position, destination}: {passenger_id: string, position: position, destination: position}) {
        const account = await this.accountRepository.getById(passenger_id);
        if (!account) throw new Error("account not found");
        if (!account.isPassenger) throw new Error("account is not a passenger");
    
        const ride = await this.rideRepository.getByPassengerId(passenger_id);
        if (ride && ride.status !== "completed") throw new Error("ride in progress found");
    
        const id = crypto.randomUUID();
        await this.rideRepository.addRide({ ride_id: id, passenger_id, status: "requested", date: new Date(), from_lat: position.lat, from_long: position.long, to_lat: destination.lat, to_long: destination.long });
    
        return { ride_id: id };
	}
}
