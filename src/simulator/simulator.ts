import { Assembler } from "./assembler";
import { CPU } from "./cpu";
import type { Instruction, ParsedInstruction } from "./instruction";
import { ParseContext, Parser } from "./parser";
import { Error } from "./error";
import { DEFAULT_SIGNATURES, SignatureTable } from "./signature";
import { LabelReference } from "./label";

export class Simulator {
    cpu: CPU = new CPU()
    memory: number[];
    pc: number = 0;
    instructionsExecuted: number = 0;
    instructions: Instruction[] = [];
    sigTable: SignatureTable = new SignatureTable();

    constructor() {
        this.memory = new Array(256).fill(0);
        this.pc = 0;
        this.instructionsExecuted = 0;
        this.instructions = [];
        this.cpu.reset();
    }

    reset() {
        this.resetMemory();
        this.pc = 0;
        this.instructionsExecuted = 0;
        this.instructions = [];
        this.cpu.reset();
    }

    resetMemory() {
        this.memory = new Array(256).fill(0);
    }

    assembleAndLoad(source: string): Error[] | null {
        this.reset();
        
        const context: ParseContext = new ParseContext();
        const assembler: Assembler = new Assembler();

        assembler.loadSigTable(DEFAULT_SIGNATURES);

        const parsed: ParsedInstruction[] = Parser.parse(source, context);
        const assembled: Instruction[] | Error[] = assembler.assemble(parsed, context);

        if (assembled.length > 0 && assembled[0] instanceof Error) {
            return assembled as Error[];
        } else {
            this.instructions = assembled as Instruction[];

            let x = 0;
            for (let i of (assembled as Instruction[])) {
                this.memory[x] = i.opcode & 0xFF;
                x++;

                for (let j of i.operands) {
                    if (!(j instanceof LabelReference)) {
                        this.memory[x] = j & 0xFF;
                        x++;
                    }
                }
            }
        }

        this.sigTable = assembler.sigTable;

        return null;
    }

    readByte(): number {
        const n = this.memory[this.pc];
        this.pc++;

        if (this.pc >= this.memory.length) {
            this.pc = 0;
        }

        return n;
    }

    runCycle(): Error | null {
        if (this.cpu.halt) {
            return null;
        }

        const opcode = this.readByte();
        const origPc = this.pc;

        const sig = this.sigTable.lookup(opcode);

        if (sig === null) {
            return new Error(null, `Unknown opcode: ${opcode} at 0x${origPc}`);
        }

        if (sig.opcode.exec(this) !== null) {
            return new Error(null, `Error executing opcode: ${opcode} at 0x${origPc}`);            
        }

        return null;
    }
}