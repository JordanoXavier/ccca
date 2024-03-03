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
	
	async execute ({passengerId, position, destination}: {passengerId: string, position: position, destination: position}) {
        const account = await this.accountRepository.getById(passengerId);
        if (!account) throw new Error("account not found");
        if (!account.isPassenger) throw new Error("account is not a passenger");
    
        const ride = await this.rideRepository.getByPassengerId(passengerId);
        if (ride && ride.status !== "completed") throw new Error("ride in progress found");
    
        const id = crypto.randomUUID();
        await this.rideRepository.addRide({ rideId: id, passengerId, status: "requested", date: new Date(), fromLat: position.lat, fromLong: position.long, to_lat: destination.lat, to_long: destination.long });
    
        return { ride_id: id };
	}
}
