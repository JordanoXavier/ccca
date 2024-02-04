import pgp from "pg-promise";
import crypto from "crypto";
import { account } from "./account";

interface position {
    lat: number;
    long: number;
}

export async function requestRide({passenger_id, position, destination}: {passenger_id: string, position: position, destination: position}) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
        const [account] = await connection.query("select * from cccat14.account where account_id = $1", [passenger_id])
        if (!account.is_passenger) throw new Error("account is not a passenger");
    
        const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1 and status != 'completed'", [passenger_id]);
        if (ride) throw new Error("ride in progress found");
    
        const id = crypto.randomUUID();
        await connection.query("insert into cccat14.ride (ride_id, passenger_id, status, date, from_lat, from_long, to_lat, to_long) values ($1, $2, $3, $4, $5, $6, $7, $8)", [id, passenger_id, "requested", new Date(), position.lat, position.long, destination.lat, destination.long]);

        return { ride_id: id };
    }
    finally {
        await connection.$pool.end();
    }
}

export interface ride {
    ride_id: string;
    passenger_id: string;
    status: string;
    date: Date;
    from_lat: number;
    from_long: number;
    to_lat: number;
    to_long: number;
    passenger?: account;
    driver?: account;
}

export async function getRide(rideId: string): Promise<ride>{
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [result] = await connection.query(`
        SELECT r.*, a.* 
        FROM cccat14.ride r
        JOIN cccat14.account a ON r.passenger_id = a.account_id
        WHERE r.ride_id = $1
    `, [rideId]);

    await connection.$pool.end();
    return {
        ...result,
        passenger: {
            account_id: result.account_id,
            name: result.name,
            email: result.email,
            cpf: result.cpf,
            car_plate: result.car_plate,
            is_passenger: result.is_passenger,
            is_driver: result.is_driver
        },
        driver: null
    };
}