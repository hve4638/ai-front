import { EditableText } from '@/components/EditableText';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { Flex } from '@/components/layout';
import { useNavigate } from 'react-router';

const ICON_STYLE = {
    fontSize: '22px',
    width: '22px',
    height: '22px',
};

type NodeProps = {
    name: string;
    value: string;
    onRename: (value: string) => void;
    onDelete: () => void;
    onExport: () => void;
    onEdit: () => void;
}

export function LeafNode({ name, value, onRename, onDelete, onExport, onEdit }: NodeProps) {
    return (
        <>
            <GIcon
                value='draft'
                style={ICON_STYLE}
            />
            <Flex style={{ paddingLeft: '0.25em' }}>
                <EditableText
                    value={name}
                    onChange={(renamed) => onRename(renamed)}
                />
            </Flex>
            <EditButton onClick={(e) => {
                onEdit();
                e.stopPropagation();
                e.preventDefault();
            }} />
            <ExportButton
                onClick={(e) => {
                    onExport();
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
            <DeleteButton
                onClick={(e) => {
                    onDelete();
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
        </>
    );
}

export function DirectoryNode({ name, value, onRename, onDelete, onExport, onEdit }: NodeProps) {
    return (
        <>
            <GIcon
                value='folder_open'
                style={ICON_STYLE}
            />
            <Flex style={{ paddingLeft: '0.25em' }}>
                <EditableText
                    value={name}
                    onChange={(renamed) => onRename(renamed)}
                />
            </Flex>
            <DeleteButton
                onClick={(e) => {
                    onDelete();
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
        </>
    )
}


function EditButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='edit'
            style={ICON_STYLE}
            hoverEffect='square'
            onClick={onClick}
        />
    );
}

function DeleteButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='delete'
            style={ICON_STYLE}
            hoverEffect='square'
            onClick={onClick}
        />
    );
}

function ExportButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='share'
            style={ICON_STYLE}
            hoverEffect='square'
            onClick={onClick}
        />
    );
}
