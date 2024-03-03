import Account from "./Account";

export default class Ride {
    rideId: string;
    passengerId: string;
    status: string;
    date: Date;
    fromLat: number;
    fromLong: number;
    to_lat: number;
    to_long: number;
    passenger?: Account;
    driver?: Account;

    constructor (passengerId: string, status: string, date: Date, fromLat: number, fromLong: number, to_lat: number, to_long: number, passenger?: Account, driver?: Account, rideId?: string,) {
        this.rideId = rideId || crypto.randomUUID();
        this.passengerId = passengerId;
        this.status = status;
        this.date = date;
        this.fromLat = fromLat;
        this.fromLong = fromLong;
        this.to_lat = to_lat;
        this.to_long = to_long;
        this.passenger = passenger;
        this.driver = driver;
    }
}
