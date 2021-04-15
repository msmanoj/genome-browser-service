import {
  CogScrollPayload,
  CogTrackScrollPayload,
  ChrLocation,
  BrowserNavStates,
  AnchorCoordinates,
  ZmenuContentFeature,
} from "./types";

export enum ActionType {
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
  ZMENU_ACTIVITY_OUTSIDE = "zmenu-activity-outside", // TODO: sometime later, unify underscores vs hyphens (together with Genome Browser)
  ZMENU_CREATE = "create_zmenu",
  ZMENU_DESTROY = "destroy_zmenu",
  ZMENU_ENTER = "zmenu-enter",
  ZMENU_LEAVE = "zmenu-leave",
  ZMENU_REPOSITION = "update_zmenu_position",
  ZOOM_BY = "zoom_by",
}

export type GenomeBrowserReadyAction = {
  type: ActionType.GENOME_BROWSER_READY;
  payload: never;
};

export type BrowserLocationUpdateAction = {
  type: ActionType.UPDATE_LOCATION;
  payload: {
    bumper?: BrowserNavStates;
    "intended-location"?: ChrLocation;
    "actual-location"?: ChrLocation;
    "is-focus-position"?: boolean;
  };
};

export type UpdateCogPositionAction = {
  type: ActionType.UPDATE_SCROLL_POSITION;
  payload: CogScrollPayload;
};

export type UpdateCogTrackPositionAction = {
  type: ActionType.UPDATE_TRACK_POSITION;
  payload: CogTrackScrollPayload;
};

export type ZmenuCreateAction = {
  type: ActionType.ZMENU_CREATE;
  payload: {
    id: string;
    anchor_coordinates: AnchorCoordinates;
    content: ZmenuContentFeature[];
  };
};

export type ZmenuDestroyAction = {
  type: ActionType.ZMENU_DESTROY;
  payload: { id: string };
};

export type ZmenuRepositionAction = {
  type: ActionType.ZMENU_REPOSITION;
  payload: {
    id: string;
    anchor_coordinates: {
      x: number;
      y: number;
    };
  };
};

export type BrowserToggleTracksAction = {
  type: ActionType.TOGGLE_TRACKS;
  payload: {
    on?: string | string[];
    off?: string | string[];
  };
};

export type BrowserSetFocusAction = {
  type: ActionType.SET_FOCUS;
  payload: {
    focus?: string | undefined;
  };
};

export type BrowserSetFocusLocationAction = {
  type: ActionType.SET_FOCUS_LOCATION;
  payload: {
    stick: string;
    goto: string;
    focus?: string | undefined;
  };
};

export type ActivateBrowserAction = {
  type: ActionType.ACTIVATE_BROWSER;
  payload: {
    "config-url": string;
    key: string;
    selector: string;
  };
};

export type ZmenuEnterAction = {
  type: ActionType.ZMENU_ENTER;
  payload: {
    id: string;
  };
};

export type ZmenuOutsideActivityAction = {
  type: ActionType.ZMENU_ACTIVITY_OUTSIDE;
  payload: {
    id: string;
  };
};

export type ZmenuLeaveAction = {
  type: ActionType.ZMENU_LEAVE;
  payload: {
    id: string;
  };
};

export type MoveUpAction = {
  type: ActionType.MOVE_UP;
  payload: { move_up_px: number };
};

export type MoveDownAction = {
  type: ActionType.MOVE_DOWN;
  payload: { move_down_px: number };
};

export type MoveLeftAction = {
  type: ActionType.MOVE_LEFT;
  payload: { move_left_px: number };
};

export type MoveRightAction = {
  type: ActionType.MOVE_RIGHT;
  payload: { move_right_px: number };
};

export type ZoomByAction = {
  type: ActionType.ZOOM_BY;
  payload: { zoom_by: number };
};

export type IncomingActions =
  | GenomeBrowserReadyAction
  | BrowserLocationUpdateAction
  | UpdateCogPositionAction
  | UpdateCogTrackPositionAction
  | ZmenuCreateAction
  | ZmenuDestroyAction
  | ZmenuRepositionAction;

export type OutgoingActions =
  | BrowserToggleTracksAction
  | ZmenuEnterAction
  | ZmenuLeaveAction
  | ZmenuOutsideActivityAction
  | BrowserSetFocusLocationAction
  | BrowserSetFocusAction
  | MoveUpAction
  | MoveDownAction
  | MoveLeftAction
  | MoveRightAction
  | ZoomByAction;

export type Actions = IncomingActions | OutgoingActions;

export const createAction = (action: Actions) => {
  return { ...action };
};
