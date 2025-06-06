import { useState } from "react";
import { createPortal } from "react-dom";

import "./settings.css";
import { CloseIcon, SliderIcon } from "./icons";

export type SimulatorRunMode = "MAN" | "AUTO";

interface Props {
    clockSpeed: number;
    clockSpeedHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SimulatorSettings({ clockSpeed, clockSpeedHandler }: Props) {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <div>
                <button
                    className="setting-button"
                    onClick={() => setVisible(true)}
                >
                    <SliderIcon />
                </button>
            </div>
            {/* Display the dialog at document root */}
            {createPortal(
                <div className={`config-dialog${visible ? " visible" : ""}`}>
                    <div className="dialog-box">
                        <div className="dialog-header">
                            <h3>Configuration</h3>
                            <button
                                className="setting-button"
                                onClick={() => setVisible(false)}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="dialog-content">
                            <div className="indent">
                                <p>
                                    <strong>Clock:</strong>
                                </p>
                                <div className="indent">
                                    <label>
                                        <span className="value-text">
                                            Speed:
                                        </span>
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
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
