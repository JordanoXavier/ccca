export default class Cpf {
    constructor (readonly value: string) {
        if (!this.validateCpf(value)) throw new Error("invalid cpf");
    }

    private validateCpf (cpf: string) {
        if (!cpf) return false;
        cpf = this.clean(cpf);
        if (this.isInvalidLength(cpf)) return false;
        if (this.allDigitsAreTheSame(cpf)) return false;
        const firstDigit = this.calculateDigit(cpf, 10);
        const secondDigit = this.calculateDigit(cpf, 11);
        return this.extractCheckDigit(cpf) === `${firstDigit}${secondDigit}`;
    }
    
    private clean (cpf: string) {
        return cpf.replace(/\D/g, "");
    }
    
    private isInvalidLength (cpf: string) {
        return cpf.length !== 11;
    }
    
    private allDigitsAreTheSame (cpf: string) {
        return cpf.split("").every(c => c === cpf[0]);
    }
    
    private calculateDigit (cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total%11;
        return (rest < 2) ? 0 : 11 - rest;
    }
    
    private extractCheckDigit (cpf: string) {
        return cpf.slice(9);
    }
    
  
}