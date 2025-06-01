import { CodeEditor } from "./editor";
import { useState, useCallback } from "react";
import { ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { editorInstance } from "./editor/monaco-instance";

import './App.css';
import { Simulator } from "./simulator/simulator";
import { MyHexEditor } from "./hex-editor";
import { Error } from "./simulator/error";

export default function App() {
    const [simulator] = useState<Simulator>(new Simulator());
    const [assembled, setAssembled] = useState<boolean>(false);
    const [nonce, setNonce] = useState(0);

    const runParser = () => {
        if (editorInstance) {
            const code = editorInstance.getValue();
            const result = simulator.assembleAndLoad(code);
            setNonce(n => n + 1);
            setAssembled((result && (result[0] instanceof Error)) ? false : true);
            if (result) console.log(result);
            else console.log(simulator.memory);
        }
    };

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

        setNonce(n => n + 1);

        console.log(simulator.cpu);
    }

    return (
        <div className="layout">
            <div className="header">
                <ThemeToggle/>
                <button onClick={runParser}>Assemble & Log</button>
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
                    <MyHexEditor simulator={simulator}/>
                </div>
            </div>
        </div>
    ); 
}
