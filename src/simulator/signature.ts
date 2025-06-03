import { Instruction, type ParsedInstruction } from "./instruction";
import { type Opcode, DEFAULT_OPCODES } from "./opcode";
import { ImmediateOperand, LabelOperand, ReferenceOperand, RegisterOperand, type Operand } from "./operand";

export class Signature {
    readonly opcode: Opcode;
    readonly operands: Operand[];

    constructor(opcode: Opcode, operands: Operand[]) {
        this.opcode = opcode;
        this.operands = operands;
    }

    matches(instruction: ParsedInstruction): boolean {
        if (instruction.opcode !== this.opcode.name || instruction.operands.length !== this.operands.length) {
            return false;
        }

        return this.operands.every((op, i) => op.matches(instruction.operands[i]));
    }

    parse(instruction: ParsedInstruction): Instruction | null {
        if (instruction.opcode !== this.opcode.name || instruction.operands.length !== this.operands.length) {
            return null;
        }

        const i: Instruction = new Instruction();

        i.opcode = this.opcode.code;
        i.line = instruction.line;

        for (let j = 0; j < instruction.operands.length; j++) {
            const n = this.operands[j].parse(instruction.operands[j], instruction.line);

            // Don't use !n as an operand could evaluate to 0
            if (n === null) return null;

            i.operands.push(n);
        }

        return i;
    }
}

export class SignatureTable {
    signatures: Signature[] = [];

    addSignature(signature: Signature): void {
        this.signatures.push(signature);
    }

    lookup(opcode: number): Signature | null;
    lookup(instruction: ParsedInstruction): Signature | null;
    lookup(arg: number | ParsedInstruction): Signature | null {
        if (typeof arg === "number") {
            for (let sig of this.signatures) {
                if (sig.opcode.code === arg) {
                    return sig;
                }
            }            
        } else {
            for (let sig of this.signatures) {
                if (sig.matches(arg)) {
                    return sig;
                }
            }
        }

        return null;
    }
}

export const DEFAULT_SIGNATURES: Signature[] = [
    new Signature(DEFAULT_OPCODES["NOP"], []),
    new Signature(DEFAULT_OPCODES["LDR"], [ new RegisterOperand(), new ReferenceOperand() ]),
    new Signature(DEFAULT_OPCODES["STR"], [ new RegisterOperand(), new ReferenceOperand() ]),
    new Signature(DEFAULT_OPCODES["ADD_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["ADD_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["SUB_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["SUB_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["MOV_R"], [ new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["MOV_I"], [ new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["CMP_R"], [ new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["CMP_I"], [ new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["B"], [ new LabelOperand() ]),
    new Signature(DEFAULT_OPCODES["BEQ"], [ new LabelOperand() ]),
    new Signature(DEFAULT_OPCODES["BNE"], [ new LabelOperand() ]),
    new Signature(DEFAULT_OPCODES["BGT"], [ new LabelOperand() ]),
    new Signature(DEFAULT_OPCODES["BLT"], [ new LabelOperand() ]),
    new Signature(DEFAULT_OPCODES["AND_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["AND_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["ORR_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["ORR_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["EOR_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["EOR_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["MVN_R"], [ new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["MVN_I"], [ new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["LSL_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["LSL_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["LSR_R"], [ new RegisterOperand(), new RegisterOperand(), new RegisterOperand() ]),
    new Signature(DEFAULT_OPCODES["LSR_I"], [ new RegisterOperand(), new RegisterOperand(), new ImmediateOperand() ]),
    new Signature(DEFAULT_OPCODES["HALT"], [])
];