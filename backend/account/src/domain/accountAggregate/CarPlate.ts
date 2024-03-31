
export default class CarPlate {
    constructor (readonly value: string) {
        if (!this.validateCarPlate(value)) throw new Error("invalid car plate");
    }
    
    private validateCarPlate (str: string) {
        return str.match(/[A-Z]{3}[0-9]{4}/);
    }
}