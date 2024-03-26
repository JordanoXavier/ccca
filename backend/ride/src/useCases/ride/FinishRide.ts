import Position from "../../domain/positionAggregate/Position";
import PositionRepository from "../../infra/repositories/position/PositionRepository";
import RideRepository from "../../infra/repositories/ride/RideRepository";

export default class FinishRide {
    constructor (private positionRepository: PositionRepository, private rideRepository: RideRepository) {
    }
    
    async execute ({ride_id}: {ride_id: string}) {
        // Deve verificar se a corrida está em status "in_progress", se não estiver lançar um erro
        const ride = await this.rideRepository.getById(ride_id);
        if (!ride) throw new Error("ride not found");
        if (ride.status.value !== "in_progress") throw new Error("ride not in progress");

        // Deve obter todas as positions e calcular a distância entre cada uma delas, para isso utilize um algoritmo que receba duas coordenadas (lat, long) e retorne a distância entre elas em km.
        const positions = await this.positionRepository.listByRideId(ride_id);
        let totalDistance = 0;
        for (let i = 0; i < positions.length - 1; i++) {
            const position1 = positions[i];
            const position2 = positions[i + 1];
            const distance = this.calculateDistance(position1.lat, position1.long, position2.lat, position2.long);
            totalDistance += distance;
        }

        // Com a distância total calculada, calcule o valor da corrida (fare) multiplicando a distância por 2,1
        const fare = totalDistance * 2.1;


        // Atualizar a corrida com o status "completed", a distância e o valor da corrida (fare)
        // ride.
        await this.rideRepository.updateRide(ride);
    }

    private calculateDistance (lat1: number, long1: number, lat2: number, long2: number): number {
        const R = 6371; // Radius of the earth in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(long2 - long1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c; // Distance in km
        return d;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI/180)
    }
}