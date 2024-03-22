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


}