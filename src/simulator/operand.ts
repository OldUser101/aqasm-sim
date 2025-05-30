import { LabelReference } from "./label";

export abstract class Operand {
    abstract matches(token: string): boolean;
    abstract parse(token: string, line: number): number | LabelReference | null;
}

export class RegisterOperand extends Operand {
    matches(token: string): boolean {
        return /^R\d+$/.test(token);
    }

    parse(token: string, line: number): number | null {
        const n: number = parseInt(token.substring(1), 10);

        if (isNaN(n) || n < 0 || n > 12) return null;

        return n;
    }
}

export class ImmediateOperand extends Operand {
    matches(token: string): boolean {
        return /^#-?\d+$/.test(token);
    }

    parse(token: string, line: number): number | null {
        const n: number = parseInt(token.substring(1), 10);

        if (isNaN(n) || n < -128 || n > 127) return null;

        return n;
    }
}

export class ReferenceOperand extends Operand {
    matches(token: string): boolean {
        return /^-?\d+$/.test(token);
    }

    parse(token: string, line: number): number | null {
        const n: number = parseInt(token, 10);

        if (isNaN(n) || n < 0) return null;

        return n % 256;
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