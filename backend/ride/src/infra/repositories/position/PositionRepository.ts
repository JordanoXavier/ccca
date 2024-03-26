import Position from "../../../domain/positionAggregate/Position";

export default interface PositionRepository  {
    addPosition (position: Position): Promise<void>;
    getById (position_id: string): Promise<Position | null>;
}
