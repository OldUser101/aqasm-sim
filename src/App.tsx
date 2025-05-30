import { CodeEditor } from "./editor";
import { useMemo, useState, useCallback } from "react";
import { ParseContext, Parser } from './simulator/parser';
import { Assembler } from './simulator/assembler';
import { DEFAULT_SIGNATURES } from './simulator/signature';
import { ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { editorInstance } from "./editor/monaco-instance";

import './App.css';
import { Simulator } from "./simulator/simulator";
import { MyHexEditor } from "./hex-editor";

export default function App() {
    const [simulator] = useState<Simulator>(new Simulator());
    const [nonce, setNonce] = useState(0);

    const runParser = () => {
        if (editorInstance) {
            const code = editorInstance.getValue();
            const result = simulator.assembleAndLoad(code);
            setNonce(n => n + 1); // Force update to reflect new memory state
            if (result) console.log(result);
            else console.log(simulator.memory);
        }
    };

    return (
        <div className="layout">
            <div className="header">
                <ThemeToggle/>
                <button onClick={runParser}>Assemble & Log</button>
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
