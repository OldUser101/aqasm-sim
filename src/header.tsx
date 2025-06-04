import { ThemeToggle } from "./theme-toggle"
import './header.css';

interface Props {
    assemble: () => void,
    run: () => void,
    reset: () => void,
}

export function Header({ assemble, run, reset }: Props) {
    return (
        <div className="header">
            <ThemeToggle/>
            <button className="button" onClick={assemble}>Assemble</button>
            <button className="button" onClick={run}>Run Cycle</button>
            <button className="button" onClick={reset}>Reset</button>
        </div>
    );
}