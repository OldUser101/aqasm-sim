import { ParsedInstruction } from "./instruction";
import type { Program } from "./program";

export class Parser {
    private static parseLine(sourceLine: string): ParsedInstruction | undefined {
        const instruction: ParsedInstruction = new ParsedInstruction();

        // Strip comments and whitespaces
        let line = sourceLine.split(';')[0].trim().toUpperCase();

        if (!line) return undefined; // Blank line
        
        const [opcode, rest] = line.split(/\s+/, 2);
        const operands = rest ? rest.split(',').map(op => op.trim()) : [];

        instruction.opcode = opcode;
        instruction.operands = operands;

        return instruction;
    }

    static parse(source: string): Program {
        const lines = source.split('\n');
        const program: Program = {
            parsedInstructions: [],
            instructions: [],
            labels: []
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const parsedLine: ParsedInstruction | undefined = this.parseLine(line);

            if (parsedLine) {
                parsedLine.line = i;
                program.parsedInstructions.push(parsedLine);
            }
        }

        return program;
    }
}