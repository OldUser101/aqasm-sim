import { Simulator } from "./simulator";
import { editorInstance, monacoInstance, decorations } from "../editor/instance";
import { Error } from "./error";
import type { SimulatorRunMode } from "../settings";

export class SimulatorInterface {
    simulator: Simulator = new Simulator();
    assembled: boolean = false;
    running: boolean = false;
    runMode: SimulatorRunMode;
    clock: number | null = null;
    clockSpeed: number;
    setReRender: React.Dispatch<React.SetStateAction<number>>;

    constructor(setReRender: React.Dispatch<React.SetStateAction<number>>, runMode: SimulatorRunMode, clockSpeed: number) {
        this.setReRender = setReRender;
        this.runMode = runMode;
        this.clockSpeed = clockSpeed;
        this.runCycle = this.runCycle.bind(this);
        this.assembleSource = this.assembleSource.bind(this);
        this.resetCpu = this.resetCpu.bind(this);
    }

    setRunMode(runMode: SimulatorRunMode) {
        this.runMode = runMode;

        if (this.runMode === 'MAN') {
            this.stopClock();
        } else if (this.running) {
            this.startClock();
        }
    }

    setClockSpeed(clockSpeed: number) {
        const lastClock: number | null = this.clock;
        if (this.clock) {
            this.stopClock();
        }

        this.clockSpeed = clockSpeed;

        if (lastClock) {
            this.startClock();
        }
    }

    startClock() {
        if (this.clock) return;

        this.clock = window.setInterval(() => {
            this.runCycle(0);
        }, (1 / this.clockSpeed) * 1000);
    }

    stopClock() {
        if (this.clock) {
            clearInterval(this.clock);
            this.clock = null;
        }
    }

    assembleSource() {
        if (editorInstance) {
            const code = editorInstance.getValue();
            const result = this.simulator.assembleAndLoad(code);
            const error = result && (result[0] instanceof Error);
            this.setReRender(n => n + 1);
            this.assembled = error ? false : true;

            if (error) {
                this.setErrorMarkers(result);
            } else if (monacoInstance && editorInstance) {
                const model = editorInstance.getModel();
                if (model) {
                    monacoInstance.editor.setModelMarkers(model, 'owner', []);
                }
            }
        }
    }

    run() {
        if (this.runMode === 'MAN') {
            this.runCycle(0);
            this.running = true;
        } else {
            this.startClock();
        }
    }

    runCycle(c: number) {
        if (c > 1) {
            return;
        }

        if (!this.assembled && c === 0) {
            this.assembleSource();
            this.runCycle(c + 1);
            return;
        }

        const r: Error | null = this.simulator.runCycle();
        if (r instanceof Error) {
            console.error(`${r.line ? r.line : ""}: ${r.message}`);
        }

        const line: number | null = this.simulator.lineFromPc();
        if (line) {
            this.setDebugMarker(line + 1);
        }

        if (this.simulator.cpu.halt && decorations) {
            decorations.clear();
            this.stopClock();
        }

        this.setReRender(n => n + 1);
    }

    setErrorMarkers(errors: Error[]) {
        if (editorInstance && monacoInstance) {
            const markers = errors.map(err => ({
                startLineNumber: (err.line ?? 0) + 1,
                startColumn: 1,
                endLineNumber: (err.line ?? 0) + 1,
                endColumn: this.simulator.source[err.line ?? 1].length + 1,
                message: err.message,
                severity: 8,
            }));

            const model = editorInstance.getModel();

            if (model) {
                monacoInstance.editor.setModelMarkers(model, 'owner', markers);
            }
        }
    }

    setDebugMarker(line: number) {
        if (editorInstance && monacoInstance && decorations) {
            decorations.clear()

            decorations.set([
                {
                    range: new monacoInstance.Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        className: 'debugLineHighlight'
                    },
                },
            ]);
        }   
    }

    resetCpu() {
        this.simulator.reset();
        this.assembled = false;
        this.running = false;
        this.stopClock();

        if (decorations) {
            decorations.clear();
        }

        this.setReRender(n => n + 1);
    }
}