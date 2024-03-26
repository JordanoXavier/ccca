import crypto from 'crypto';

export default class Position {
    positionId: string;
    rideId: string;
    lat: number;
    long: number;
    date: Date;

    constructor (rideId: string, lat: number, long: number, date?: Date, positionId?: string, ) {
        this.rideId = rideId;
        this.lat = lat;
        this.long = long;
        if(positionId){
            this.positionId = positionId;
        } else {
            this.positionId = crypto.randomUUID();
        }
        if(date){
            this.date = date;
        } else {
            this.date = new Date();
        }
    }    
}