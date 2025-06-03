import type { LabelReference } from "./label";

export class Instruction {
    opcode: number = 0;
    operands: (number | LabelReference)[] = [];
    line: number = 0;
}

export class ParsedInstruction {
    opcode: string = "";
    operands: string[] = [];
    line: number = 0;
}