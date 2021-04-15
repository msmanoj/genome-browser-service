import { CogScrollPayload, CogTrackScrollPayload, ChrLocation, BrowserNavStates, AnchorCoordinates, ZmenuContentFeature } from "./types";
export declare enum ActionType {
    PING = "ping",
    ACTIVATE_BROWSER = "activate_browser",
    GENOME_BROWSER_READY = "genome_browser_ready",
    MOVE_DOWN = "move_down",
    MOVE_LEFT = "move_left",
    MOVE_RIGHT = "move_right",
    MOVE_UP = "move_up",
    SET_FOCUS = "set_focus",
    SET_FOCUS_LOCATION = "set_focus_location",
    TOGGLE_TRACKS = "toggle_tracks",
    UPDATE_LOCATION = "update_location",
    UPDATE_SCROLL_POSITION = "update_scroll_position",
    UPDATE_TRACK_POSITION = "upadte_track_position",
    ZMENU_ACTIVITY_OUTSIDE = "zmenu-activity-outside",
    ZMENU_CREATE = "create_zmenu",
    ZMENU_DESTROY = "destroy_zmenu",
    ZMENU_ENTER = "zmenu-enter",
    ZMENU_LEAVE = "zmenu-leave",
    ZMENU_REPOSITION = "update_zmenu_position",
    ZOOM_IN = "zoom_by",
    ZOOM_OUT = "zoom_by"
}
export declare type GenomeBrowserReadyAction = {
    type: ActionType.GENOME_BROWSER_READY;
    payload: never;
};
export declare type BrowserLocationUpdateAction = {
    type: ActionType.UPDATE_LOCATION;
    payload: {
        bumper?: BrowserNavStates;
        "intended-location"?: ChrLocation;
        "actual-location"?: ChrLocation;
        "is-focus-position"?: boolean;
    };
};
export declare type UpdateCogPositionAction = {
    type: ActionType.UPDATE_SCROLL_POSITION;
    payload: CogScrollPayload;
};
export declare type UpdateCogTrackPositionAction = {
    type: ActionType.UPDATE_TRACK_POSITION;
    payload: CogTrackScrollPayload;
};
export declare type ZmenuCreateAction = {
    type: ActionType.ZMENU_CREATE;
    payload: {
        id: string;
        anchor_coordinates: AnchorCoordinates;
        content: ZmenuContentFeature[];
    };
};
export declare type ZmenuDestroyAction = {
    type: ActionType.ZMENU_DESTROY;
    payload: {
        id: string;
    };
};
export declare type ZmenuRepositionAction = {
    type: ActionType.ZMENU_REPOSITION;
    payload: {
        id: string;
        anchor_coordinates: {
            x: number;
            y: number;
        };
    };
};
export declare type BrowserToggleTracksAction = {
    type: ActionType.TOGGLE_TRACKS;
    payload: {
        on?: string | string[];
        off?: string | string[];
    };
};
export declare type BrowserSetFocusAction = {
    type: ActionType.SET_FOCUS;
    payload: {
        focus?: string | undefined;
    };
};
export declare type BrowserSetFocusLocationAction = {
    type: ActionType.SET_FOCUS_LOCATION;
    payload: {
        stick: string;
        goto: string;
        focus?: string | undefined;
    };
};
export declare type ActivateBrowserAction = {
    type: ActionType.ACTIVATE_BROWSER;
    payload: {
        "config-url": string;
        key: string;
        selector: string;
    };
};
export declare type ZmenuEnterAction = {
    type: ActionType.ZMENU_ENTER;
    payload: {
        id: string;
    };
};
export declare type ZmenuOutsideActivityAction = {
    type: ActionType.ZMENU_ACTIVITY_OUTSIDE;
    payload: {
        id: string;
    };
};
export declare type ZmenuLeaveAction = {
    type: ActionType.ZMENU_LEAVE;
    payload: {
        id: string;
    };
};
export declare type MoveUpAction = {
    type: ActionType.MOVE_UP;
    payload: {
        move_up_px: number;
    };
};
export declare type MoveDownAction = {
    type: ActionType.MOVE_DOWN;
    payload: {
        move_down_px: number;
    };
};
export declare type MoveLeftAction = {
    type: ActionType.MOVE_LEFT;
    payload: {
        move_left_px: number;
    };
};
export declare type MoveRightAction = {
    type: ActionType.MOVE_RIGHT;
    payload: {
        move_right_px: number;
    };
};
export declare type ZoomInAction = {
    type: ActionType.ZOOM_IN;
    payload: {
        zoom_by: number;
    };
};
export declare type ZoomOutAction = {
    type: ActionType.ZOOM_OUT;
    payload: {
        zoom_by: number;
    };
};
export declare type Action = ActivateBrowserAction | GenomeBrowserReadyAction | BrowserLocationUpdateAction | UpdateCogPositionAction | UpdateCogTrackPositionAction | ZmenuCreateAction | ZmenuDestroyAction | ZmenuRepositionAction | BrowserToggleTracksAction | ZmenuEnterAction | ZmenuLeaveAction | ZmenuOutsideActivityAction | BrowserSetFocusLocationAction | BrowserSetFocusAction | MoveUpAction | MoveDownAction | MoveLeftAction | MoveRightAction | ZoomInAction | ZoomOutAction;
export declare const createAction: (action: Action) => {
    type: ActionType.GENOME_BROWSER_READY;
    payload: never;
} | {
    type: ActionType.UPDATE_LOCATION;
    payload: {
        bumper?: BrowserNavStates;
        "intended-location"?: ChrLocation;
        "actual-location"?: ChrLocation;
        "is-focus-position"?: boolean;
    };
} | {
    type: ActionType.UPDATE_SCROLL_POSITION;
    payload: CogScrollPayload;
} | {
    type: ActionType.UPDATE_TRACK_POSITION;
    payload: CogTrackScrollPayload;
} | {
    type: ActionType.ZMENU_CREATE;
    payload: {
        id: string;
        anchor_coordinates: AnchorCoordinates;
        content: ZmenuContentFeature[];
    };
} | {
    type: ActionType.ZMENU_DESTROY;
    payload: {
        id: string;
    };
} | {
    type: ActionType.ZMENU_REPOSITION;
    payload: {
        id: string;
        anchor_coordinates: {
            x: number;
            y: number;
        };
    };
} | {
    type: ActionType.TOGGLE_TRACKS;
    payload: {
        on?: string | string[];
        off?: string | string[];
    };
} | {
    type: ActionType.SET_FOCUS;
    payload: {
        focus?: string | undefined;
    };
} | {
    type: ActionType.SET_FOCUS_LOCATION;
    payload: {
        stick: string;
        goto: string;
        focus?: string | undefined;
    };
} | {
    type: ActionType.ACTIVATE_BROWSER;
    payload: {
        "config-url": string;
        key: string;
        selector: string;
    };
} | {
    type: ActionType.ZMENU_ENTER;
    payload: {
        id: string;
    };
} | {
    type: ActionType.ZMENU_ACTIVITY_OUTSIDE;
    payload: {
        id: string;
    };
} | {
    type: ActionType.ZMENU_LEAVE;
    payload: {
        id: string;
    };
} | {
    type: ActionType.MOVE_UP;
    payload: {
        move_up_px: number;
    };
} | {
    type: ActionType.MOVE_DOWN;
    payload: {
        move_down_px: number;
    };
} | {
    type: ActionType.MOVE_LEFT;
    payload: {
        move_left_px: number;
    };
} | {
    type: ActionType.MOVE_RIGHT;
    payload: {
        move_right_px: number;
    };
} | {
    type: ActionType.ZOOM_IN;
    payload: {
        zoom_by: number;
    };
} | {
    type: ActionType.ZOOM_OUT;
    payload: {
        zoom_by: number;
    };
};