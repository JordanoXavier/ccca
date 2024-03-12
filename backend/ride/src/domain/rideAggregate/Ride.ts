import Account from "../accountAggregate/Account";

export default class Ride {
    rideId: string;
    status: any;
    date: Date;
    fromLat: number;
    fromLong: number;
    to_lat: number;
    to_long: number;
    passenger?: Account;
    driver?: Account;

    constructor (date: Date, fromLat: number, fromLong: number, to_lat: number, to_long: number, passenger?: Account, driver?: Account, rideId?: string, status?: string,) {
        if(status) this.status = status;
        else this.request();

        this.rideId = rideId || crypto.randomUUID();
        this.date = date;
        this.fromLat = fromLat;
        this.fromLong = fromLong;
        this.to_lat = to_lat;
        this.to_long = to_long;
        this.passenger = passenger;
        this.driver = driver;
    }

    request(){
        this.status = "requested";
    }
}
