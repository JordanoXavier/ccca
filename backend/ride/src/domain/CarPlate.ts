
export default class CarPlate {
    plate: string;
    
    constructor (plate: string) {
        if (!this.validateCarPlate(plate)) throw new Error("invalid car plate");
        this.plate = plate;
    }
    
    private validateCarPlate (str: string) {
        return str.match(/[A-Z]{3}[0-9]{4}/);
    }

  
}