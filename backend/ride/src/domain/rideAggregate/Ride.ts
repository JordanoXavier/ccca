import Account from "../accountAggregate/Account";
import Status from "./Status";

export default class Ride {
    rideId: string;
    status: Status;
    date: Date;
    fromLat: number;
    fromLong: number;
    to_lat: number;
    to_long: number;
    passenger?: Account;
    driver?: Account;
    distance?: number;
    fare?: number;

    constructor (date: Date, fromLat: number, fromLong: number, to_lat: number, to_long: number, passenger?: Account, driver?: Account, rideId?: string, status?: string, distance?: number, fare?: number) {
        this.status = new Status(this, status);
        this.rideId = rideId || crypto.randomUUID();
        this.date = date;
        this.fromLat = fromLat;
        this.fromLong = fromLong;
        this.to_lat = to_lat;
        this.to_long = to_long;
        this.passenger = passenger;
        this.driver = driver;
        this.distance = distance;
        this.fare = fare;
    }

    request(){
        this.status.request();
    }

    start(){
        this.status.start();
    }

    accept(){
        this.status.accept();
    }

    finish(totalDistance: number){
        this.status.finish();
        this.distance = totalDistance;
        console.debug("totalDistance", totalDistance)
        this.fare = totalDistance * 2.1;
        console.debug("fare", this.fare)
    }
}
