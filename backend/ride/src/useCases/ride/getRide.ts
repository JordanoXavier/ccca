import pgp from "pg-promise";
import { Account } from "../../repositories/account/AccountRepository";

export interface ride {
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