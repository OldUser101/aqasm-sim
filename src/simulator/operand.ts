import { Error } from "./error";

export class Operand {
    static parse(o: string, line: number): number | Error {
        if (o.startsWith("#") || o.startsWith("R")) {
            let n: number = parseInt(o.substring(1), 10);

            if (isNaN(n)) {
                return new Error(line, "Invalid base 10 integer.");
            }

            return n % 256;
        }

        return new Error(line, "Invalid operand.");
    }
}