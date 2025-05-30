import { Assembler } from "./assembler";
import { CPU } from "./cpu";
import type { Instruction, ParsedInstruction } from "./instruction";
import { ParseContext, Parser } from "./parser";
import { Error } from "./error";
import { DEFAULT_SIGNATURES } from "./signature";
import { LabelReference } from "./label";

export class Simulator {
    cpu: CPU = new CPU()
    memory: number[];
    pc: number = 0;

    constructor() {
        this.memory = new Array(256).fill(0);
    }

    resetMemory() {
        this.memory = new Array(256).fill(0);
    }

    assembleAndLoad(source: string): Error[] | null {
        this.resetMemory();
        
        const context: ParseContext = new ParseContext();
        const assembler: Assembler = new Assembler();

        assembler.loadSigTable(DEFAULT_SIGNATURES);

        const parsed: ParsedInstruction[] = Parser.parse(source, context);
        const assembled: Instruction[] | Error[] = assembler.assemble(parsed, context);

        if (assembled.length > 0 && assembled[0] instanceof Error) {
            return assembled as Error[];
        } else {
            let x = 0;
            for (let i of (assembled as Instruction[])) {
                this.memory[x] = i.opcode;
                x++;

                for (let j of i.operands) {
                    if (!(j instanceof LabelReference)) {
                        this.memory[x] = j;
                        x++;
                    }
                }
            }
        }

        return null;
    }
}