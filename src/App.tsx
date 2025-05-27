import { CodeEditor } from "./editor";
import { ParseContext, Parser } from './simulator/parser';
import { Assembler } from './simulator/asembler';
import { DEFAULT_SIGNATURES } from './simulator/signature';
import { ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { editorInstance } from "./editor/monaco-instance";

import './App.css';

export default function App() {
    const runParser = () => {
        if (editorInstance) {
            const code = editorInstance.getValue();
            const context = new ParseContext();
            const parsed = Parser.parse(code, context);
            const assembler = new Assembler();
            assembler.loadSigTable(DEFAULT_SIGNATURES);
            const assembled = assembler.assemble(parsed, context);
            console.log(parsed);
            console.log(context);
            console.log(assembled);
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
                    pane 2
                </div>
            </div>
        </div>
    ); 
}
