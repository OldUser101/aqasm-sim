import HexEditor from '@jixun/react-hex-editor-react-16';
import customTheme from './hex-editor/custom';
import type { Simulator } from './simulator/simulator';
import { useState, useCallback } from 'react';

interface Props {
    simulator: Simulator
}

export function MyHexEditor({ simulator }: Props) {
    const [nonce, setNonce] = useState(0);

    const handleSetValue = useCallback((offset: number, value: number) => {
        simulator.memory[offset] = value;
        setNonce(n => n + 1);
    }, [simulator]);

    return (
        <HexEditor
            columns={16}
            data={simulator.memory}
            nonce={nonce}
            onSetValue={handleSetValue}
            theme={{ hexEditor: customTheme }}
            showAscii
        />
    );
}