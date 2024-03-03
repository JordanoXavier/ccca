import Account from "../../../domain/Account";

export default interface RideRepository  {
    listByDriverId(driver_id: string): Promise<Ride[]>;
	getById (rideId: string): Promise<Ride>;
    getByPassengerId (accountId: string): Promise<Ride>;
    addRide (ride: Ride): Promise<void>;
    updateRide (ride: Ride): Promise<void>;
}

export interface Ride {
    ride_id: string;
    passenger_id: string;
    status: string;
    date: Date;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
    passenger?: Account;
    driver?: Account;
}
