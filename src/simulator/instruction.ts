import type { CPU } from "./cpu";
import type { LabelReference } from "./label";
import type { Memory } from "./memory";

export class Instruction {
    opcode: number = 0;
    operands: (number | LabelReference)[] = [];
}

export class ParsedInstruction {
    opcode: string = "";
    operands: string[] = [];
    line: number = 0;
}