import Position from "../../../domain/positionAggregate/Position";
import PgPromiseAdapter from "../../database/PgPromiseAdapter";
import PositionRepository from "./PositionRepository";

export default class PositionRepositoryDatabase implements PositionRepository {
    async addPosition(position: Position): Promise<void> {
        const connection = new PgPromiseAdapter();
        await connection.query(`
            INSERT INTO cccat14.position (position_id, ride_id, lat, long, date) 
            VALUES ($1, $2, $3, $4, $5)
        `, [position.positionId, position.rideId, position.lat, position.long, position.date]);
        await connection.close();
    }

    async getById(position_id: string): Promise<Position | null> {
        const connection = new PgPromiseAdapter();
        const [result] = await connection.query(`
            SELECT * FROM cccat14.position WHERE position_id = $1
        `, [position_id]);
        await connection.close();
        if (!result) return null;
        return new Position(result.ride_id, Number(result.lat), Number(result.long), result.date);
    }

    async listByRideId(ride_id: string): Promise<Position[]> {
        const connection = new PgPromiseAdapter();
        const result = await connection.query(`
            SELECT * FROM cccat14.position WHERE ride_id = $1
        `, [ride_id]);
        await connection.close();
        return result.map((row: any) => new Position(row.ride_id, Number(row.lat), Number(row.long), row.date));
    }
}