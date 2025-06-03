import { CodeEditor } from "./editor";
import { useEffect, useState } from "react";
import { loadTheme, ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { MyHexEditor } from "./hex-editor";
import { CPUState } from "./cpu";

import './App.css';
import { SimulatorInterface } from "./simulator/interface";

export default function App() {
    const [_, setReRender] = useState(0);
    const [simInterface, setSimInterface] = useState<SimulatorInterface | null>(null);

    useEffect(() => {
        loadTheme();
    }, [])

    useEffect(() => {
        const sInstance = new SimulatorInterface(setReRender);
        setSimInterface(sInstance);
    }, [])

    if (!simInterface) {
        return (
            <div className="loading-view">
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div className="layout">
            <div className="header">
                <ThemeToggle/>
                <button onClick={simInterface.assembleSource}>Assemble</button>
                <button onClick={() => simInterface.runCycle(0)}>Run Cycle</button>
                <button onClick={simInterface.resetCpu}>Reset</button>
            </div>
            <div className="grid">
                <div className="files-col">
                    <div>
                        pane 1
                    </div>
                    <InfoCard />
                </div>
                <CodeEditor assembled={simInterface.assembled} reset={simInterface.resetCpu}/>
                <div className="status-col">
                    <CPUState sim={simInterface.simulator}/>
                    <MyHexEditor simulator={simInterface.simulator}/>
                </div>
            </div>
        </div>
    ); 
}
