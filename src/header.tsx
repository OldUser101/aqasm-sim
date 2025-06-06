import { ThemeToggle } from "./theme-toggle";
import "./header.css";
import {
    NextIcon,
    PauseIcon,
    PlayIcon,
    RefreshIcon,
    SkipIcon,
    StopIcon,
} from "./icons";
import { SimulatorInterface } from "./simulator/interface";

interface Props {
    sim: SimulatorInterface;
}

export function Header({ sim }: Props) {
    return (
        <div className="header">
            <div
                className={`header-group center header-slide ${
                    sim.debug ? "header-visible" : "header-hidden"
                }`}
            >
                <button
                    className="icon-button"
                    title="Restart simulator"
                    onClick={sim.debugRestart}
                    disabled={!sim.debug}
                >
                    <RefreshIcon />
                </button>
                <button
                    className="icon-button"
                    title="Next instruction"
                    onClick={sim.debugNext}
                    disabled={!sim.debug}
                >
                    <NextIcon />
                </button>
                <button
                    className="icon-button"
                    title="Skip instruction"
                    onClick={sim.debugSkip}
                    disabled={!sim.debug}
                >
                    <SkipIcon />
                </button>
            </div>
            <div className="header-group right">
                <button
                    className="icon-button"
                    title="Run code"
                    onClick={sim.run}
                >
                    {sim.running ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button
                    className="icon-button"
                    title="Reset simulator"
                    onClick={sim.resetCpu}
                    disabled={sim.reset}
                >
                    <StopIcon />
                </button>
                <ThemeToggle />
            </div>
        </div>
    );
}
