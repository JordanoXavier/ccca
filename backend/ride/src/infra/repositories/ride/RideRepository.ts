import Ride from "../../../domain/Ride";

export default interface RideRepository  {
    listByDriverId(driver_id: string): Promise<Ride[]>;
	getById (rideId: string): Promise<Ride>;
    getByPassengerId (accountId: string): Promise<Ride>;
    addRide (ride: Ride): Promise<void>;
    updateRide (ride: Ride): Promise<void>;
}
