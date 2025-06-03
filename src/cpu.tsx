import type { Simulator } from "./simulator/simulator";
import './cpu.css';
import { useEffect, useRef } from "react";

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
    const haltStateRef = useRef<HTMLParagraphElement>(null);
    const eqStateRef = useRef<HTMLParagraphElement>(null);
    const gtStateRef = useRef<HTMLParagraphElement>(null);
    const ltStateRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (haltStateRef.current) {
            if (sim.cpu.halt) {
                haltStateRef.current.classList.add("cpu-state-active");
            } else {
                haltStateRef.current.classList.remove("cpu-state-active");             
            }
        }
    }, [sim.cpu.halt])

    useEffect(() => {
        if (eqStateRef.current && gtStateRef.current && ltStateRef.current) {

            eqStateRef.current.classList.remove("cpu-state-active");
            gtStateRef.current.classList.remove("cpu-state-active");
            ltStateRef.current.classList.remove("cpu-state-active");

            switch (sim.cpu.cmp) {
                case 'EQ':
                    eqStateRef.current.classList.add("cpu-state-active");
                    break;
                case 'GT':
                    gtStateRef.current.classList.add("cpu-state-active");
                    break;
                case 'LT':
                    ltStateRef.current.classList.add("cpu-state-active");
                    break;
                default:
                    break;
            }
        }
    }, [sim.cpu.cmp])

    return (
        <div>
            <div className="cpu-reg-view">
                {Array.from({ length: 13 }, (_, i) => (
                    <p className="register-view" key={i}>R{i}: {to8BitBinary(sim.cpu.getRegister(i))} ({toSigned8Bit(sim.cpu.getRegister(i))})</p>
                ))}
                <p className="register-view">PC: {to8BitBinary(sim.pc)} ({sim.pc})</p>
            </div>
            <div className="cpu-state-view">
                <p className="cpu-state-object cpu-state-inactive" ref={haltStateRef}>HALT</p>
                <p className="cpu-state-object cpu-state-inactive" ref={eqStateRef}>EQ</p>
                <p className="cpu-state-object cpu-state-inactive" ref={gtStateRef}>GT</p>
                <p className="cpu-state-object cpu-state-inactive" ref={ltStateRef}>LT</p>
            </div>
        </div>
    );
}