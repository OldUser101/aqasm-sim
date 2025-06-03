import { CodeEditor } from "./editor";
import { useEffect, useState } from "react";
import { loadTheme, ThemeToggle } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { MyHexEditor } from "./hex-editor";
import { CPUState } from "./cpu";

import './App.css';
import { SimulatorInterface } from "./simulator/interface";

export default function App() {
    const [tooSmall, setTooSmall] = useState<boolean>(false);
    const [ignoreScreenSize, setIgnoreScreenSize] = useState<boolean>(false);
    const [_, setReRender] = useState(0);
    const [simInterface, setSimInterface] = useState<SimulatorInterface | null>(null);

    const checkScreenSize = () => {
        setTooSmall(window.innerWidth < 1000 || window.innerHeight < 764);
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [])

    useEffect(() => {
        loadTheme();
    }, [])

    useEffect(() => {
        const sInstance = new SimulatorInterface(setReRender);
        setSimInterface(sInstance);
    }, [])

    if (tooSmall && !ignoreScreenSize) {
        return (
            <div className="loading-view">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tablet-smartphone-icon lucide-tablet-smartphone"><rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/><path d="M8 18h.01"/></svg>
                    <h2>Screen too small</h2>
                    <p>It is recommended to view this page on a desktop browser.</p>
                    <button onClick={() => setIgnoreScreenSize(true)}>Continue Anyway</button>
                </div>        
            </div>
        );
    }

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
