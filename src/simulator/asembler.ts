import { Error } from "./error";
import { Instruction, type ParsedInstruction } from "./instruction";
import { LabelReference } from "./label";
import type { ParseContext } from "./parser";
import { Signature, SignatureTable } from "./signature";

export class Assembler {
    sigTable: SignatureTable;

    constructor() {
        this.sigTable = new SignatureTable();
    }

    private assembleInstruction(instr: ParsedInstruction, context: ParseContext): Instruction | Error {
        const sig = this.sigTable.lookup(instr);
        if (!sig) {
            return new Error(instr.line, "Expected valid instruction or data.");
        }

        const i = sig.parse(instr);
        if (!i) {
            return new Error(instr.line, "Expected valid instruction or data.");
        }

        for (let j = 0; j < i.operands.length; j++) {
            const op = i.operands[j];
            if (op instanceof LabelReference) {
                const r = context.resolveLabel(op);

                if (r instanceof Error) return r;

                i.operands[j] = r;
            }
        }

        return i;
    }

    loadSigTable(signatures: Signature[]) {
        for (let sig of signatures) {
            this.sigTable.addSignature(sig);
        }
    }

    assemble(parsed: ParsedInstruction[], context: ParseContext): Instruction[] | Error[] {
        const instructions: Instruction[] = [];
        const errors: Error[] = []

        for (let instruction of parsed) {
            const aI = this.assembleInstruction(instruction, context);

            if (aI instanceof Error) {
                errors.push(aI);
                continue;
            }

            instructions.push(aI);
        }

        if (errors.length > 0) return errors;

        return instructions;
    }
}