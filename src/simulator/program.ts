import type { Instruction, ParsedInstruction } from "./instruction"
import type { Label } from "./label"

export type Program = {
    parsedInstructions: ParsedInstruction[],
    instructions: Instruction[],
    labels: Label[]
}