import { Simulator } from "./simulator";
import { editorInstance, monacoInstance, decorations } from "../editor/instance";
import { Error } from "./error";

export class SimulatorInterface {
    simulator: Simulator = new Simulator();
    assembled: boolean = false;
    setReRender: React.Dispatch<React.SetStateAction<number>>;

    constructor(setReRender: React.Dispatch<React.SetStateAction<number>>) {
        this.setReRender = setReRender;
        this.runCycle = this.runCycle.bind(this);
        this.assembleSource = this.assembleSource.bind(this);
        this.resetCpu = this.resetCpu.bind(this);
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

        this.setReRender(n => n + 1);
    }

    setErrorMarkers(errors: Error[]) {
        if (editorInstance && monacoInstance) {
            const markers = errors.map(err => ({
                startLineNumber: (err.line ?? 0) + 1,
                startColumn: 1,
                endLineNumber: (err.line ?? 0) + 1,
                endColumn: 100,
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

        if (decorations) {
            decorations.clear();
        }

        this.setReRender(n => n + 1);
    }
}