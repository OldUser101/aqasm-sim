import type { Simulator } from "./simulator";

export class Opcode {
    name: string;
    code: number;
    private func: (sim: Simulator) => Error | null;

    constructor(name: string, code: number, func: (sim: Simulator) => Error | null) {
        this.name = name;
        this.code = code;
        this.func = func;
    }

    parse() {
        return this.code;
    }

    exec(sim: Simulator): Error | null {
        return this.func(sim);
    }
}

export type ArithmeticOperation = 'ADD' | 'SUB' | 'AND' | 'ORR' | 'EOR' | 'LSL' | 'LSR';
export type CompareResult = '' | 'EQ' | 'GT' | 'LT';

function OP_NOP(): null {
    return null;
}

function OP_LDR(sim: Simulator): null {
    const reg = sim.readByte();
    const addr = sim.readByte();

    sim.cpu.setRegister(reg, sim.memory[addr]);

    return null;
}

function OP_STR(sim: Simulator): null {
    const reg = sim.readByte();
    const addr = sim.readByte();

    sim.memory[addr] = sim.cpu.getRegister(reg);

    return null;
}

function OP_ARITH_R(sim: Simulator, op: ArithmeticOperation): null {
    const outReg = sim.readByte();
    const reg1 = sim.readByte();
    const reg2 = sim.readByte();

    let result: number = 0;

    switch (op) {
        case 'ADD':
            result = sim.cpu.getRegister(reg1) + sim.cpu.getRegister(reg2);
            break;
        case 'SUB':
            result = sim.cpu.getRegister(reg1) - sim.cpu.getRegister(reg2);
            break;
        case 'AND':
            result = sim.cpu.getRegister(reg1) & sim.cpu.getRegister(reg2);
            break;
        case 'ORR':
            result = sim.cpu.getRegister(reg1) | sim.cpu.getRegister(reg2);
            break;
        case 'EOR':
            result = sim.cpu.getRegister(reg1) ^ sim.cpu.getRegister(reg2);
            break;
        case 'LSL':
            result = sim.cpu.getRegister(reg1) << sim.cpu.getRegister(reg2);
            break;
        case 'LSR':
            result = sim.cpu.getRegister(reg1) >> sim.cpu.getRegister(reg2);
            break;
    }

    sim.cpu.setRegister(outReg, result);

    return null;
}

function OP_ARITH_I(sim: Simulator, op: ArithmeticOperation): null {
    const outReg = sim.readByte();
    const reg = sim.readByte();
    const val = sim.readByte();

    let result: number = 0;

    switch (op) {
        case 'ADD':
            result = sim.cpu.getRegister(reg) + val;
            break;
        case 'SUB':
            result = sim.cpu.getRegister(reg) - val;
            break;
        case 'AND':
            result = sim.cpu.getRegister(reg) & val;
            break;
        case 'ORR':
            result = sim.cpu.getRegister(reg) | val;
            break;
        case 'EOR':
            result = sim.cpu.getRegister(reg) ^ val;
            break;
        case 'LSL':
            result = sim.cpu.getRegister(reg) << val;
            break;
        case 'LSR':
            result = sim.cpu.getRegister(reg) >> val;
            break;
    }

    sim.cpu.setRegister(outReg, result);

    return null;
}

function OP_ADD_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'ADD');
}

function OP_ADD_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'ADD');
}

function OP_SUB_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'SUB');
}

function OP_SUB_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'SUB');
}

function OP_MOV_R(sim: Simulator): null {
    const outReg = sim.readByte();
    const reg = sim.readByte();

    sim.cpu.setRegister(outReg, sim.cpu.getRegister(reg));

    return null;
}

function OP_MOV_I(sim: Simulator): null {
    const outReg = sim.readByte();
    const val = sim.readByte();

    sim.cpu.setRegister(outReg, val);

    return null;
}

function OP_CMP_R(sim: Simulator): null {
    const reg1 = sim.readByte();
    const reg2 = sim.readByte();

    const val1 = sim.cpu.getRegister(reg1);
    const val2 = sim.cpu.getRegister(reg2);

    if (val1 === val2) {
        sim.cpu.cmp = 'EQ';
    } else if (val1 > val2) {
        sim.cpu.cmp = 'GT';
    } else {
        sim.cpu.cmp = 'LT';
    }

    return null;
}

function OP_CMP_I(sim: Simulator): null {
    const reg = sim.readByte();

    const val1 = sim.cpu.getRegister(reg);
    const val2 = sim.readByte();

    if (val1 === val2) {
        sim.cpu.cmp = 'EQ';
    } else if (val1 > val2) {
        sim.cpu.cmp = 'GT';
    } else {
        sim.cpu.cmp = 'LT';
    }

    return null;
}

function OP_B(sim: Simulator): null {
    const addr = sim.readByte();
    sim.pc = addr;
    return null;
}

function OP_BEQ(sim: Simulator): null {
    const addr = sim.readByte();
    sim.pc = (sim.cpu.cmp === 'EQ') ? addr : sim.pc;
    return null;
}

function OP_BNE(sim: Simulator): null {
    const addr = sim.readByte();
    sim.pc = (sim.cpu.cmp !== 'EQ' && sim.cpu.cmp !== '') ? addr : sim.pc;
    return null;
}

function OP_BGT(sim: Simulator): null {
    const addr = sim.readByte();
    sim.pc = (sim.cpu.cmp === 'GT') ? addr : sim.pc;
    return null;
}

function OP_BLT(sim: Simulator): null {
    const addr = sim.readByte();
    sim.pc = (sim.cpu.cmp === 'LT') ? addr : sim.pc;
    return null;
}

function OP_AND_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'AND');
}

function OP_AND_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'AND');
}

function OP_ORR_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'ORR');
}

function OP_ORR_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'ORR');
}

function OP_EOR_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'EOR');
}

function OP_EOR_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'EOR');
}

function OP_MVN_R(sim: Simulator): null {
    const outReg = sim.readByte();
    const reg = sim.readByte();

    sim.cpu.setRegister(outReg, ~sim.cpu.getRegister(reg));

    return null;
}

function OP_MVN_I(sim: Simulator): null {
    const outReg = sim.readByte();
    const val = sim.readByte();

    sim.cpu.setRegister(outReg, ~val);

    return null;
}

function OP_LSL_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'LSL');
}

function OP_LSL_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'LSL');
}

function OP_LSR_R(sim: Simulator): null {
    return OP_ARITH_R(sim, 'LSR');
}

function OP_LSR_I(sim: Simulator): null {
    return OP_ARITH_I(sim, 'LSR');
}

function OP_HALT(sim: Simulator): null {
    sim.cpu.halt = true;
    return null;
}

export const DEFAULT_OPCODES: Record<string, Opcode> = {
    NOP: new Opcode("NOP", 0xFF, OP_NOP),
    LDR: new Opcode("LDR", 0x01, OP_LDR),
    STR: new Opcode("STR", 0x02, OP_STR),
    ADD_R: new Opcode("ADD", 0x03, OP_ADD_R),
    ADD_I: new Opcode("ADD", 0x83, OP_ADD_I),
    SUB_R: new Opcode("SUB", 0x04, OP_SUB_R),
    SUB_I: new Opcode("SUB", 0x84, OP_SUB_I),
    MOV_R: new Opcode("MOV", 0x05, OP_MOV_R),
    MOV_I: new Opcode("MOV", 0x85, OP_MOV_I),
    CMP_R: new Opcode("CMP", 0x06, OP_CMP_R),
    CMP_I: new Opcode("CMP", 0x86, OP_CMP_I),
    B: new Opcode("B", 0x07, OP_B),
    BEQ: new Opcode("BEQ", 0x27, OP_BEQ),
    BNE: new Opcode("BNE", 0x47, OP_BNE),
    BGT: new Opcode("BGT", 0x67, OP_BGT),
    BLT: new Opcode("BLT", 0x87, OP_BLT),
    AND_R: new Opcode("AND", 0x08, OP_AND_R),
    AND_I: new Opcode("AND", 0x88, OP_AND_I),
    ORR_R: new Opcode("ORR", 0x09, OP_ORR_R),
    ORR_I: new Opcode("ORR", 0x89, OP_ORR_I),
    EOR_R: new Opcode("EOR", 0x0A, OP_EOR_R),
    EOR_I: new Opcode("EOR", 0x8A, OP_EOR_I),
    MVN_R: new Opcode("MVN", 0x0B, OP_MVN_R),
    MVN_I: new Opcode("MVN", 0x8B, OP_MVN_I),
    LSL_R: new Opcode("LSL", 0x0C, OP_LSL_R),
    LSL_I: new Opcode("LSL", 0x8C, OP_LSL_I),
    LSR_R: new Opcode("LSR", 0x0D, OP_LSR_R),
    LSR_I: new Opcode("LSR", 0x8D, OP_LSR_I),
    HALT: new Opcode("HALT", 0x00, OP_HALT)
};