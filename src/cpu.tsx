import type { Simulator } from "./simulator/simulator";
import './cpu.css';

interface Props {
    sim: Simulator
}

function to8BitBinary(value: number): string {
    return (value & 0xFF).toString(2).padStart(8, '0');
}

function toSigned8Bit(value: number): number {
  return (value & 0x80) ? value - 0x100 : value;
}


export function CPUState({ sim }: Props) {
    return (
        <div className="cpu-view">
            {Array.from({ length: 13 }, (_, i) => (
                <p key={i}>R{i}: {to8BitBinary(sim.cpu.getRegister(i))} ({toSigned8Bit(sim.cpu.getRegister(i))})</p>
            ))}
            <p >PC: {to8BitBinary(sim.pc)} ({sim.pc})</p>
        </div>
    );
}