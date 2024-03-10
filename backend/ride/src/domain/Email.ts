export default class Email {
    constructor (readonly value: string) {
        if (!this.validateEmail(value)) throw new Error("invalid email");
    }

    private validateEmail (str: string) {
        return str.match(/^(.+)@(.+)$/);
    }
}