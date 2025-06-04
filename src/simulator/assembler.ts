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
            return new Error(instr.line, `Instruction '${instr.opcode}' does not exist.`);
        }

        const i = sig.parse(instr);

        if (i instanceof Error) {
            return i;
        }

        if (!i) {
            return new Error(instr.line, `An unknown error occurred.`);
        }

        for (let j = 0; j < (i as Instruction).operands.length; j++) {
            const op = (i as Instruction).operands[j];
            if (op instanceof LabelReference) {
                const r = context.resolveLabel(op);

                if (r instanceof Error) return r;

                (i as Instruction).operands[j] = r;
            }
        }

        return (i as Instruction);
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