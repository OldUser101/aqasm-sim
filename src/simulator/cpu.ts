import type { CompareResult } from "./opcode";

export class CPU {
    private registers: Record<number, number> = {};
    halt: boolean = false;
    cmp: CompareResult = '';

    constructor() {
        this.reset();
    }

    reset(): void {
        this.registers = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
        this.halt = false;
        this.cmp = '';
    }

    getRegister(n: number): number {
        return this.registers[n];
    }

    setRegister(n: number, v: number): void {
        this.registers[n] = v;
    }
}