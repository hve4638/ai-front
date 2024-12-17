export const ChatSessionStatus = {
    IDLE : 'IDLE',
    QUEUEED : 'QUEUEED',
    REQUESTED : 'REQUESTED',
    REQUEST_ACCEPTED : 'REQUEST_ACCEPTED',
    REQEUST_REJECTED : 'REQUEST_REJECTED',
}
export type ChatSessionStatus = typeof ChatSessionStatus[keyof typeof ChatSessionStatus];

export const ChatSessionColor = {
    DEFAULT : 'DEFAULT',
    RED : 'RED',
    ORANGE : 'ORANGE',
    YELLOW : 'YELLOW',
    GREEN : 'GREEN',
    BLUE : 'BLUE',
    INDIGO : 'INDIGO',
    PURPLE : 'PURPLE',
    PINK : 'PINK',
    BROWN : 'BROWN',
    GREY : 'GREY',
}
export type ChatSessionColor = typeof ChatSessionColor[keyof typeof ChatSessionColor];
