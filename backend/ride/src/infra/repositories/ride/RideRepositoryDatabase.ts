import pgp from "pg-promise";
import RideRepository, { Ride } from "./RideRepository";
import PgPromiseAdapter from "../../database/PgPromiseAdapter";

export default class RideRepositoryDatabase implements RideRepository {

    async listByDriverId (driver_id: string): Promise<Ride[]>{
        const connection = new PgPromiseAdapter();
        const rides = await connection.query(`
            SELECT r.* 
            FROM cccat14.ride r
            WHERE r.driver_id = $1
        `, [driver_id]);
        await connection.close();
        return rides;
    }

	async getById (rideId: string): Promise<Ride>{
        const connection = new PgPromiseAdapter();
        const [result] = await connection.query(`
            SELECT r.*, 
                   p.account_id as p_account_id, p.name as p_name, p.email as p_email, p.cpf as p_cpf, p.car_plate as p_car_plate, p.is_passenger as p_is_passenger, p.is_driver as p_is_driver,
                   d.account_id as d_account_id, d.name as d_name, d.email as d_email, d.cpf as d_cpf, d.car_plate as d_car_plate, d.is_passenger as d_is_passenger, d.is_driver as d_is_driver
            FROM cccat14.ride r
            JOIN cccat14.account p ON r.passenger_id = p.account_id
            LEFT JOIN cccat14.account d ON r.driver_id = d.account_id
            WHERE r.ride_id = $1
        `, [rideId]);
    
        await connection.close();
    
        return {
            ...result,
            passenger: {
                account_id: result.p_account_id,
                name: result.p_name,
                email: result.p_email,
                cpf: result.p_cpf,
                car_plate: result.p_car_plate,
                is_passenger: result.p_is_passenger,
                is_driver: result.p_is_driver
            },
            driver: result.d_account_id ? {
                account_id: result.d_account_id,
                name: result.d_name,
                email: result.d_email,
                cpf: result.d_cpf,
                car_plate: result.d_car_plate,
                is_passenger: result.d_is_passenger,
                is_driver: result.d_is_driver
            } : null
        };
    }

    async getByPassengerId (accountId: string): Promise<Ride>{
        const connection = new PgPromiseAdapter();
        const [ride] = await connection.query("select * from cccat14.ride where passenger_id = $1 and status != 'completed'", [accountId]);
        await connection.close();
        return ride;
    }

    async addRide (ride: Ride): Promise<void>{
        const connection = new PgPromiseAdapter();
        await connection.query(`
            INSERT INTO cccat14.ride (ride_id, passenger_id, status, date, from_lat, from_long, to_lat, to_long) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [ride.ride_id, ride.passenger_id, ride.status, ride.date, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long]);
        await connection.close();
    }

    async updateRide (ride: Ride): Promise<void>{
        const connection = new PgPromiseAdapter();
        await connection.query(`
            UPDATE cccat14.ride 
            SET driver_id = $1, status = $2 
            WHERE ride_id = $3
        `, [ride.driver?.account_id, ride.status, ride.ride_id]);
        await connection.close();
    }
}