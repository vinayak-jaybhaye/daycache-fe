type ViewType = "sidebar" | "content";

interface UserData {
    id: string;
}

export interface ListDaysProps {
    setSelectedDay: (date: string) => void;
    selectedDay: string;
    userData: UserData;
    setCurrentView?: (view: ViewType) => void;
}


// draggable dialogue
import type { MouseEventHandler, FC } from 'react';

export interface DraggableDialogProps<T = any> {
    visible: boolean;
    toggleDialog: MouseEventHandler;
    props: T;
    Component: FC<T>;
    title: string;
}
