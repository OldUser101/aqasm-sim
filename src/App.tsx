import { CodeEditor } from "./editor";
import { useEffect, useState } from "react";
import { loadTheme } from "./theme-toggle";
import { InfoCard } from "./info-card";
import { MyHexEditor } from "./hex-editor";
import { CPUState } from "./cpu";

import "./App.css";
import { SimulatorInterface } from "./simulator/interface";
import { SimulatorSettings } from "./settings";
import type { SimulatorRunMode } from "./settings";
import { getStorageItem } from "./storage";
import { Header } from "./header";

export default function App() {
    const [tooSmall, setTooSmall] = useState<boolean>(false);
    const [ignoreScreenSize, setIgnoreScreenSize] = useState<boolean>(false);
    const [runMode, setRunMode] = useState<SimulatorRunMode>("MAN");
    const [clockSpeed, setClockSpeed] = useState<number>(1);
    const [_, setReRender] = useState(0);
    const [simInterface, setSimInterface] = useState<SimulatorInterface | null>(
        null
    );

    const checkScreenSize = () => {
        setTooSmall(window.innerWidth < 1000 || window.innerHeight < 540);
    };

    const changeRunMode = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (simInterface) {
            localStorage.setItem("run-mode", event.target.value);
            setRunMode(event.target.value as SimulatorRunMode);
            simInterface.setRunMode(event.target.value as SimulatorRunMode);
        }
    };

    const changeClockSpeed = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (simInterface) {
            let speed: number = parseInt(event.target.value);

            if (speed < 1) {
                speed = 1;
            } else if (speed > 10) {
                speed = 10;
            }

            localStorage.setItem("clock-speed", speed.toString());
            setClockSpeed(speed);
            simInterface.setClockSpeed(isNaN(speed) ? 1 : speed);
        }
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    useEffect(() => {
        loadTheme();
    }, []);

    useEffect(() => {
        const savedRunMode = getStorageItem(
            "run-mode",
            "MAN",
            (value: string) => {
                return value === "MAN" || value === "AUTO";
            }
        ) as SimulatorRunMode;
        setRunMode(savedRunMode);

        let savedClockSpeed = parseInt(
            getStorageItem("clock-speed", "1", (value: string) => {
                return !isNaN(parseInt(value));
            })
        );
        setClockSpeed(savedClockSpeed);

        savedClockSpeed = isNaN(savedClockSpeed) ? 1 : savedClockSpeed;

        const sInstance = new SimulatorInterface(
            setReRender,
            savedRunMode,
            savedClockSpeed
        );
        setSimInterface(sInstance);
    }, []);

    if (tooSmall && !ignoreScreenSize) {
        return (
            <div className="loading-view">
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="128"
                        height="128"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-tablet-smartphone-icon lucide-tablet-smartphone"
                    >
                        <rect width="10" height="14" x="3" y="8" rx="2" />
                        <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" />
                        <path d="M8 18h.01" />
                    </svg>
                    <h2>Screen too small</h2>
                    <p>
                        It is recommended to view this page on a desktop
                        browser.
                    </p>
                    <button
                        className="button"
                        onClick={() => setIgnoreScreenSize(true)}
                    >
                        Continue Anyway
                    </button>
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
        <>
            <div className="layout">
                <Header sim={simInterface} />
                <div className="grid">
                    <div className="files-col">
                        <div>pane 1</div>
                        <InfoCard />
                    </div>
                    <CodeEditor
                        assembled={simInterface.assembled}
                        reset={simInterface.resetCpu}
                    />
                    <div className="status-col">
                        <CPUState sim={simInterface.simulator} />
                        <MyHexEditor simulator={simInterface.simulator} />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "right",
                                width: "100%",
                            }}
                        >
                            <SimulatorSettings
                                clockSpeed={clockSpeed}
                                clockSpeedHandler={changeClockSpeed}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
