export default class Name {
    constructor (readonly value: string) {
        if (!this.validateName(value)) throw new Error("invalid name");
    }
    
    private validateName (str: string) {
        return str.match(/[a-zA-Z] [a-zA-Z]+/);
    }
}