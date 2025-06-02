import { CodeEditor } from "./editor";
import { useState, useCallback } from "react";
import { ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { editorInstance, monacoInstance } from "./editor/instance";

import './App.css';
import { Simulator } from "./simulator/simulator";
import { MyHexEditor } from "./hex-editor";
import { Error } from "./simulator/error";
import { CPUState } from "./cpu";

export default function App() {
    const [simulator] = useState<Simulator>(new Simulator());
    const [assembled, setAssembled] = useState<boolean>(false);
    const [_, setReRender] = useState(0);

    const runParser = () => {
        if (editorInstance) {
            const code = editorInstance.getValue();
            const result = simulator.assembleAndLoad(code);
            const error = result && (result[0] instanceof Error);
            setReRender(n => n + 1);
            setAssembled(error ? false : true);

            if (error) {
                setErrorMarkers(result);
            } else if (monacoInstance && editorInstance) {
                const model = editorInstance.getModel();
                if (model) {
                    monacoInstance.editor.setModelMarkers(model, 'owner', []);
                }
            }

            if (result) console.log(result);
            else console.log(simulator.memory);
        }
    };

    const setErrorMarkers = (errors: Error[]) => {
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

    const runCycle = (c: number) => {
        if (c > 1) {
            return;
        }

        if (!assembled && c === 0) {
            runParser();
            runCycle(c + 1);
            return;
        }

        const r: Error | null = simulator.runCycle();
        if (r instanceof Error) {
            console.error(`${r.line ? r.line : ""}: ${r.message}`);
        }

        setReRender(n => n + 1);

        console.log(simulator.cpu);
    }

    return (
        <div className="layout">
            <div className="header">
                <ThemeToggle/>
                <button onClick={runParser}>Assemble</button>
                <button onClick={() => runCycle(0)}>Run Cycle</button>
            </div>
            <div className="grid">
                <div className="files-col">
                    <div>
                        pane 1
                    </div>
                    <InfoCard />
                </div>
                <CodeEditor/>
                <div className="status-col">
                    <CPUState sim={simulator}/>
                    <MyHexEditor simulator={simulator}/>
                </div>
            </div>
        </div>
    ); 
}
