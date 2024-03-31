import Position from "./Position";

export default class DistanceCalculator {
    private positions: Position[];

    constructor(positions: Position[]) {
        this.positions = positions;
    }

    public calculateTotalDistance(): number {
        let totalDistance = 0;
        for (let i = 0; i < this.positions.length - 1; i++) {
            const position1 = this.positions[i];
            const position2 = this.positions[i + 1];
            const distance = this.calculateDistance(position1.lat, position1.long, position2.lat, position2.long);
            totalDistance += distance;
        }
        return totalDistance;
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