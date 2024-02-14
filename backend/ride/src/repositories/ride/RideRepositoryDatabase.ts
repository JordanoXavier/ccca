import pgp from "pg-promise";
import RideRepository, { Ride } from "./RideRepository";

export default class RideRepositoryDatabase implements RideRepository {

	async getById (rideId: string): Promise<Ride>{
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

    async getByPassengerId (accountId: string): Promise<Ride>{
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [result] = await connection.query(`
            SELECT r.*, a.* 
            FROM cccat14.ride r
            JOIN cccat14.account a ON r.passenger_id = a.account_id
            WHERE r.passenger_id = $1
        `, [accountId]);
    
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

    async save (ride: Ride): Promise<void>{
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query(`
            INSERT INTO cccat14.ride (ride_id, passenger_id, status, date, from_lat, from_long, to_lat, to_long) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [ride.ride_id, ride.passenger_id, ride.status, ride.date, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long]);
        await connection.$pool.end();
    }
}