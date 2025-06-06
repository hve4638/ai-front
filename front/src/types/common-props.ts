export interface CommonProps {
    className?: string;
    style?: React.CSSProperties;
}

export interface MouseActionProps<TElement extends HTMLElement> {
    onClick?: (e: React.MouseEvent<TElement>) => void;
    onDoubleClick?: (e: React.MouseEvent<TElement>) => void;

    onMouseEnter?: (e: React.MouseEvent<TElement>) => void;
    onMouseDown?: (e: React.MouseEvent<TElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<TElement>) => void;
    onMouseMove?: (e: React.MouseEvent<TElement>) => void;
}

export interface DragActionProps<TElement extends HTMLElement> {
    onDragStart?: (e: React.DragEvent<TElement>) => void;
    onDragOver?: (e: React.DragEvent<TElement>) => void;
    onDragEnter?: (e: React.DragEvent<TElement>) => void;
    onDragLeave?: (e: React.DragEvent<TElement>) => void;
}

export interface KeyboardActionProps<TElement extends HTMLElement> {
    onKeyDown?: (e: React.KeyboardEvent<TElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<TElement>) => void;
}

export interface FocusActionProps<TElement extends HTMLElement> {
    onFocus?: (e: React.FocusEvent<TElement>) => void;
    onBlur?: (e: React.FocusEvent<TElement>) => void;
}

