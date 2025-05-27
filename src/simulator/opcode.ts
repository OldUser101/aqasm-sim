export class Opcode {
    name: string;
    code: number;

    constructor(name: string, code: number) {
        this.name = name;
        this.code = code;
    }

    parse() {
        return this.code;
    }
}

export const DEFAULT_OPCODES: Record<string, Opcode> = {
    NOP: new Opcode("NOP", 0x00),
    LDR: new Opcode("LDR", 0x01),
    STR: new Opcode("STR", 0x02),
    ADD_R: new Opcode("ADD", 0x03),
    ADD_I: new Opcode("ADD", 0x83),
    SUB_R: new Opcode("SUB", 0x04),
    SUB_I: new Opcode("SUB", 0x84),
    MOV_R: new Opcode("MOV", 0x05),
    MOV_I: new Opcode("MOV", 0x85),
    CMP_R: new Opcode("CMP", 0x06),
    CMP_I: new Opcode("CMP", 0x86),
    B: new Opcode("B", 0x07),
    BEQ: new Opcode("BEQ", 0x27),
    BNE: new Opcode("BNE", 0x47),
    BGT: new Opcode("BGT", 0x67),
    BLT: new Opcode("BLT", 0x87),
    AND_R: new Opcode("AND", 0x08),
    AND_I: new Opcode("AND", 0x88),
    ORR_R: new Opcode("ORR", 0x09),
    ORR_I: new Opcode("ORR", 0x89),
    EOR_R: new Opcode("EOR", 0x0A),
    EOR_I: new Opcode("EOR", 0x8A),
    MVN_R: new Opcode("MVN", 0x0B),
    MVN_I: new Opcode("MVN", 0x8B),
    LSL_R: new Opcode("LSL", 0x0C),
    LSL_I: new Opcode("LSL", 0x8C),
    LSR_R: new Opcode("LSR", 0x0D),
    LSR_I: new Opcode("LSR", 0x8D),
    HALT: new Opcode("HALT", 0xFF)
};