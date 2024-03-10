import Ride from "../../../domain/rideAggregate/Ride";

export default interface RideRepository  {
    listByDriverId(driver_id: string): Promise<Ride[]>;
	getById (rideId: string): Promise<Ride | undefined>;
    getByPassengerId (accountId: string): Promise<Ride | undefined>;
    addRide (ride: Ride): Promise<void>;
    updateRide (ride: Ride): Promise<void>;
}
