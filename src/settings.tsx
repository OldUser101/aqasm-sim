import "./settings.css";

export type SimulatorRunMode = "MAN" | "AUTO";

interface Props {
    runMode: SimulatorRunMode;
    clockSpeed: number;
    modeSwitchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    clockSpeedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SimulatorSettings({
    runMode,
    clockSpeed,
    modeSwitchHandler,
    clockSpeedHandler,
}: Props) {
    return (
        <div>
            <h3>Configuration</h3>
            <div className="indent">
                <p>
                    <strong>Clock:</strong>
                </p>
                <div className="indent">
                    <label>
                        <input
                            type="radio"
                            className="radio"
                            name="run-mode"
                            value="MAN"
                            checked={runMode === "MAN"}
                            onChange={modeSwitchHandler}
                        />
                        Manual
                    </label>
                    <label>
                        <input
                            type="radio"
                            className="radio"
                            name="run-mode"
                            value="AUTO"
                            checked={runMode === "AUTO"}
                            onChange={modeSwitchHandler}
                        />
                        Automatic
                    </label>
                </div>
                <div className="indent">
                    <label>
                        <span className="value-text">Speed:</span>
                        <input
                            type="number"
                            className="spinbox"
                            min="1"
                            max="10"
                            step="1"
                            value={clockSpeed}
                            onChange={clockSpeedHandler}
                        />
                        <span className="value-text">Hz</span>
                    </label>
                </div>
            </div>
        </div>
    );
}
