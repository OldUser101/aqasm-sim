import type { CPU } from "./cpu";
import type { Memory } from "./memory";

export class Instruction {
    opcode: number = 0;
    operands?: number[] = [];

    execute(cpu: CPU, memory: Memory): void {

    }
}

export class ParsedInstruction {
    opcode: string = "";
    operands?: string[];
    line: number = 0;
}