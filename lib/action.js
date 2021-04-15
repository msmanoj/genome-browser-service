"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = exports.ActionType = void 0;
var ActionType;
(function (ActionType) {
    ActionType["PING"] = "ping";
    ActionType["ACTIVATE_BROWSER"] = "activate_browser";
    ActionType["GENOME_BROWSER_READY"] = "genome_browser_ready";
    ActionType["MOVE_DOWN"] = "move_down";
    ActionType["MOVE_LEFT"] = "move_left";
    ActionType["MOVE_RIGHT"] = "move_right";
    ActionType["MOVE_UP"] = "move_up";
    ActionType["SET_FOCUS"] = "set_focus";
    ActionType["SET_FOCUS_LOCATION"] = "set_focus_location";
    ActionType["TOGGLE_TRACKS"] = "toggle_tracks";
    ActionType["UPDATE_LOCATION"] = "update_location";
    ActionType["UPDATE_SCROLL_POSITION"] = "update_scroll_position";
    ActionType["UPDATE_TRACK_POSITION"] = "upadte_track_position";
    ActionType["ZMENU_ACTIVITY_OUTSIDE"] = "zmenu-activity-outside";
    ActionType["ZMENU_CREATE"] = "create_zmenu";
    ActionType["ZMENU_DESTROY"] = "destroy_zmenu";
    ActionType["ZMENU_ENTER"] = "zmenu-enter";
    ActionType["ZMENU_LEAVE"] = "zmenu-leave";
    ActionType["ZMENU_REPOSITION"] = "update_zmenu_position";
    ActionType["ZOOM_IN"] = "zoom_by";
    ActionType["ZOOM_OUT"] = "zoom_by";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
var createAction = function (action) {
    return __assign({}, action);
};
exports.createAction = createAction;
