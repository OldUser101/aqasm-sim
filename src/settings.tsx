export type SimulatorRunMode = 'MAN' | 'AUTO';

interface Props {
    runMode: SimulatorRunMode,
    modeSwitchHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export function SimulatorSettings({ runMode, modeSwitchHandler}: Props) {

    return (
        <div>
            <label>
                <input 
                    type="radio" 
                    name="run-mode"
                    value="MAN"
                    defaultChecked={runMode === "MAN"}
                    onChange={modeSwitchHandler}
                />
                Manual
            </label>
            <label>
                <input 
                    type="radio" 
                    name="run-mode" 
                    value="AUTO"
                    defaultChecked={runMode === "AUTO"}
                    onChange={modeSwitchHandler}
                />
                Automatic
            </label>        
        </div>
    );
}