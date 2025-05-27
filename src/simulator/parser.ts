import { Error } from "./error";
import { ParsedInstruction } from "./instruction";
import { LabelReference } from "./label";

export class ParseContext {
    labelAddresses: Map<string, number> = new Map();

    resolveLabel(ref: LabelReference): number | Error {
        const address = this.labelAddresses.get(ref.labelName);
        if (address === undefined) { 
            return new Error(ref.line, `Unresolved label: ${ref.labelName}`);
        }

        return address;
    }

    defineLabel(name: string, address: number): void {
        this.labelAddresses.set(name, address);
    }
}

export class Parser {
    private static parseLine(sourceLine: string, context: ParseContext, addrRef: { addr: number} ): ParsedInstruction | undefined {
        const instruction: ParsedInstruction = new ParsedInstruction();

        // Strip comments and whitespaces
        let line = sourceLine.split(';')[0].trim().toUpperCase();

        if (!line) return undefined; // Blank line

        const label = line.match(/^\s*[a-zA-Z_]\w*:/);
        if (label) {
            const labelId = label[0].substring(0, label[0].length - 1);
            context.defineLabel(labelId, addrRef.addr);

            return undefined;
        }
        
        const match = line.match(/^(\S+)\s+(.+)$/);
        if (!match) {
            instruction.opcode = line;
            instruction.operands = [];
        } else {
            instruction.opcode = match[1];
            const rest = match[2];
            instruction.operands = rest.split(/\s*,\s*/).map(op => op.trim());
        }

        addrRef.addr += 1 + instruction.operands.length;

        return instruction;
    }

    static parse(source: string, context: ParseContext): ParsedInstruction[] {
        const lines = source.split('\n');
        const instructions: ParsedInstruction[] = [];
        const addrRef: { addr: number } = {
            addr: 0
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const parsedLine: ParsedInstruction | undefined = this.parseLine(line, context, addrRef);

            if (parsedLine) {
                parsedLine.line = i;
                instructions.push(parsedLine);
            }
        }

        return instructions;
    }
}