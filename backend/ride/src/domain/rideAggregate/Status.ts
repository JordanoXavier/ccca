import Ride from "./Ride";

export default class Status {
    value?: string;
    ride: Ride;


    constructor (ride: Ride, value?: string,) {
        this.value = value;
        this.ride = ride;

        if(!value) this.request();
    }

    start(){
        if (this.ride.status.value !== "accepted") throw new Error("ride is not accepted");
        this.value = "in_progress";
    }

    accept(){
        if (this.ride.status.value !== "requested") throw new Error("ride is not requested");
        this.value = "accepted";
    }

    request(){
        this.value = "requested";
    }    
}