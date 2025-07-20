import SliderForm from '@/components/Forms/SliderForm';
import { useMemo } from 'react';
import { safetyFilterThresholdMap, safetyFilterThresholdMapReverse } from '../data';

interface SafetyFilterSliderProps {
    name: string;

    value: string;
    onChange: (value: string) => void;

    disabled?: boolean;
}

function SafetyFilterSlider({
    name,
    value,
    onChange,
    disabled = false
}: SafetyFilterSliderProps) {
    const current = useMemo(() => {
        return safetyFilterThresholdMap[value] ?? 0;
    }, [value]);
    return (
        <SliderForm
            name={name}
            style={{ margin: '0.22em 0' }}

            disabled={disabled}

            flex={[2, 3]}
            min={0}
            max={4}
            value={current}
            onChange={(next) => {
                const threshold = safetyFilterThresholdMapReverse[next] ?? 'OFF';
                onChange(threshold);
            }}
            marks={{
                '0': 'OFF',
                '1': 'NONE',
                '2': 'HIGH',
                '3': 'MEDIUM',
                '4': 'LOW',
            }}
        />
    )
}

export default SafetyFilterSlider;