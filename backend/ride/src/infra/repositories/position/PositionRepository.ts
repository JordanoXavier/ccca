import Position from "../../../domain/positionAggregate/Position";

export default interface PositionRepository  {
    addPosition (position: Position): Promise<void>;
}
