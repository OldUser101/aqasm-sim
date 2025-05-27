import { Error } from "./error";
import { Instruction, type ParsedInstruction } from "./instruction";
import { OPCODES } from "./opcode";
import { Operand } from "./operand";
import type { Program } from "./program";

export class Assembler {
    private static assembleInstruction(instr: ParsedInstruction): Instruction | Error | undefined {
        const i: Instruction = new Instruction();

        const opcode: number = OPCODES[instr.opcode];

        if (!opcode) {
            return new Error(instr.line, "Expected valid instruction or label.");
        }

        i.opcode = opcode;

        if (instr.operands)
        {
            for (let op of instr.operands) {
                const n = Operand.parse(op, instr.line);

                if (n instanceof Error) return n;

                i.operands?.push(n);
            }
        }

        return i;
    }

    static assemble(iProgram: Program): Program | Error | undefined {
        const program: Program = iProgram;

        for (let instruction of program.parsedInstructions) {
            const aI = this.assembleInstruction(instruction);

            if (!aI) return undefined;
            if (aI instanceof Error) return aI;

            program.instructions.push(aI);            
        }

        return program;
    }
}