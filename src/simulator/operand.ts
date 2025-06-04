import { LabelReference } from "./label";
import { Error } from "./error";

export abstract class Operand {
    abstract matches(token: string): boolean;
    abstract parse(token: string, line: number): number | LabelReference | Error;
}

export class RegisterOperand extends Operand {
    matches(token: string): boolean {
        return /^R\d+$/.test(token);
    }

    parse(token: string, line: number): number | Error {
        const n: number = parseInt(token.substring(1), 10);

        if (isNaN(n) || n < 0 || n > 12) {
            return new Error(line, `Register R${n} is out of bounds.`);
        }

        return n;
    }
}

export class ImmediateOperand extends Operand {
    matches(token: string): boolean {
        return /^#-?\d+$/.test(token);
    }

    parse(token: string, line: number): number | Error {
        const n: number = parseInt(token.substring(1), 10);

        if (isNaN(n) || n < -128 || n > 127) {
            return new Error(line, `Immediate values cannot be more that 127 or less than -128.`);
        }

        return n;
    }
}

export class ReferenceOperand extends Operand {
    matches(token: string): boolean {
        return /^-?\d+$/.test(token);
    }

    parse(token: string, line: number): number | Error {
        const n: number = parseInt(token, 10);

        if (isNaN(n) || n < 0 || n > 255) {
            return new Error(line, `Memory references cannot be less than 0 or more than 255.`);
        }

        return n;
    }
}

export class LabelOperand extends Operand {
    matches(token: string): boolean {
        return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
    }

    parse(token: string, line: number): LabelReference {
        return new LabelReference(token, line);
    }
}