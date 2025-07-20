import { Align, Flex, Row } from '@/components/layout';
import { RCSlider, TooltipSlider } from '@/components/Slider';
import classNames from 'classnames';

interface SliderFormProps {
    className?: string;
    style?: React.CSSProperties;

    disabled?: boolean;
    flex?: [number, number];

    name: string;
    min: number;
    max: number;
    value: number;
    marks?: Record<number, string>;
    onChange: (value: number) => void;
}

function SliderForm({
    className = '',
    style = {},

    disabled = false,

    flex = [0, 1],

    name,
    min,
    max,
    value,
    onChange,
    marks = {}
}: SliderFormProps) {
    return (
        <Row
            className={classNames(className, {
                'dimmed-color': disabled,
            })}
            style={{
                width: '100%',
                height: '1.4em',
                margin: '0.5em 0',
                ...style,
            }}
            columnAlign={Align.Center}
        >
            <span
                className={classNames('undraggable')}
                style={{
                    flex: flex[0] === 0 ? 'none' : flex[0],
                }}
            >
                {name}
            </span>
            <div
                className={classNames('undraggable')}
                style={{
                    flex: flex[1] === 0 ? 'none' : flex[1],
                    boxSizing: 'border-box',
                    paddingLeft: '1em',
                    paddingRight: '0.5em',
                }}
            >
                <RCSlider
                    min={min}
                    max={max}
                    value={value}
                    onChange={(v) => {
                        if (!disabled) {
                            onChange(v as number);
                        }
                    }}
                    marks={marks}
                />
            </div>
        </Row>
    );
}

export default SliderForm;