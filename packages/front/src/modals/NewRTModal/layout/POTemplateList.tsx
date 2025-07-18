import classNames from 'classnames';
import { Align, Column, Grid, Row } from '@/components/layout';

import styles from './styles.module.scss';
import { GIcon } from '@/components/GoogleFontIcon';

type POTemplateListProps = {
    value: string;
    onChange: (value: string) => void;
}

function POTemplateList({
    value,
    onChange,
}: POTemplateListProps) {
    const templates = [
        {
            title: '빈 템플릿',
            icon: 'draft',
            description: '미리 정의되지 않은 빈 템플릿 생성',
            value: 'empty',
        },
        {
            title: '단일 요청',
            icon: 'description',
            description: '기본 요청과 응답 템플릿',
            value: 'normal',
        },
        {
            title: '채팅 요청',
            icon: 'chat',
            description: '이전 대화를 기억하는 요청 템플릿',
            value: 'chat',
        },
        {
            title: '번역',
            icon: 'translate',
            description: '언어를 지정할 수 있는 번역 템플릿',
            value: 'translate',
        },
    ]

    return (
        <Grid
            rows='2em auto'
            columns='1fr'
        >
            <Row>
                <div>템플릿</div>
            </Row>
            <Column
                className={classNames(styles['rt-template-container'], 'undraggable')}
                style={{
                    width: '100%',
                    height: '12em',
                    overflowY: 'auto',
                }}
            >
                {
                    templates.map((template) => (
                        <TemplateDiv
                            key={template.value}
                            title={template.title}
                            icon={template.icon}
                            description={template.description}
                            selected={value === template.value}
                            onClick={() => onChange(template.value)}
                            value={template.value}
                        />
                    ))
                }
            </Column>
        </Grid>
    )
}

type TemplateDivProps = {
    title?: string;
    description: string;
    icon: string;
    selected?: boolean;
    onClick: (value:string) => void
    value: string;
}

function TemplateDiv({ title, description, icon, selected, onClick, value }:TemplateDivProps) {
    return (
        <Row
            className={classNames(styles['rt-template'], { [styles['selected']]: selected })}
            columnAlign={Align.Center}
            onClick={() => onClick(value)}
        >
            <GIcon
                value={icon}
                style={{
                    aspectRatio: '1 / 1',
                    height: '100%',
                    fontSize: '1.5em',
                }}
            />
            <Column>
                <span>{title}</span>
                <small className='secondary-color' style={{ paddingLeft: '0.25em' }}>{description}</small>
            </Column>

        </Row>
    )
}

export default POTemplateList;