"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserMessagingType = void 0;
var action_1 = require("./action");
var peregrine_ensembl_js_1 = __importStar(require("../lib/peregrine/peregrine_ensembl.js"));
var subscriptions = new Map();
// TODO: This is temporary
var BrowserMessagingType;
(function (BrowserMessagingType) {
    BrowserMessagingType["BPANE_READY_QUERY"] = "bpane-ready-query";
    BrowserMessagingType["BPANE_ACTIVATE"] = "bpane-activate";
    BrowserMessagingType["BPANE"] = "bpane";
    BrowserMessagingType["BPANE_READY"] = "bpane-ready";
    BrowserMessagingType["BPANE_OUT"] = "bpane-out";
})(BrowserMessagingType = exports.BrowserMessagingType || (exports.BrowserMessagingType = {}));
var GenomeBrowserService = /** @class */ (function () {
    function GenomeBrowserService(elementId) {
        var _this = this;
        this.elementId = '';
        this.genomeBrowser = null;
        this.bpPerScreen = 1000000;
        this.x = 2500000;
        this.handleAction = function (event) {
            if (event.data.type !== BrowserMessagingType.BPANE_OUT) {
                return;
            }
            var _a = event.data, action = _a.action, payload = _a.payload;
            var type = action;
            var subscriptionsToAction = subscriptions.get(_this.elementId + "-" + type);
            subscriptionsToAction === null || subscriptionsToAction === void 0 ? void 0 : subscriptionsToAction.forEach(function (fn) { return fn(payload); });
        };
        this.handleIncoming = function (message) {
            console.log(message);
        };
        this.send = function (action) { return __awaiter(_this, void 0, void 0, function () {
            var type;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                console.log(action);
                type = action.type;
                if (type === action_1.OutgoingActionType.ACTIVATE_BROWSER) {
                    this.ping();
                    return [2 /*return*/];
                }
                if (action.type === action_1.OutgoingActionType.SET_FOCUS) {
                    (_a = this.genomeBrowser) === null || _a === void 0 ? void 0 : _a.set_stick((_b = action.payload) === null || _b === void 0 ? void 0 : _b.focus);
                }
                else if (action.type === action_1.OutgoingActionType.TOGGLE_TRACKS) {
                    console.log(action.payload);
                    (_c = this.genomeBrowser) === null || _c === void 0 ? void 0 : _c.set_switch(["track"]);
                }
                else if (action.type === action_1.OutgoingActionType.TURN_ON_TRACKS) {
                    (_d = this.genomeBrowser) === null || _d === void 0 ? void 0 : _d.set_switch(__spreadArray(["track"], action.payload.track_ids));
                }
                else if (action.type === action_1.OutgoingActionType.TURN_OFF_TRACKS) {
                    (_e = this.genomeBrowser) === null || _e === void 0 ? void 0 : _e.clear_switch(__spreadArray(["track"], action.payload.track_ids));
                }
                else if (action.type === action_1.OutgoingActionType.ZOOM_IN) {
                    this.bpPerScreen = this.bpPerScreen - 10000;
                    this.x = this.x - 10000;
                    (_f = this.genomeBrowser) === null || _f === void 0 ? void 0 : _f.set_bp_per_screen(this.bpPerScreen);
                    (_g = this.genomeBrowser) === null || _g === void 0 ? void 0 : _g.set_x(this.x);
                }
                else if (action.type === action_1.OutgoingActionType.ZOOM_OUT) {
                    this.bpPerScreen = this.bpPerScreen + 10000;
                    this.x = this.x + 10000;
                    (_h = this.genomeBrowser) === null || _h === void 0 ? void 0 : _h.set_bp_per_screen(this.bpPerScreen);
                    (_j = this.genomeBrowser) === null || _j === void 0 ? void 0 : _j.set_x(this.x);
                }
                else {
                    type = BrowserMessagingType.BPANE;
                }
                return [2 /*return*/];
            });
        }); };
        this.subscribe = function (action, callback) {
            var subscriptionsToAction = subscriptions.get(_this.elementId + "-" + action);
            if (subscriptionsToAction) {
                subscriptionsToAction.add(callback);
            }
            else {
                subscriptions.set(action, new Set([callback]));
            }
            return {
                unsubscribe: function () {
                    subscriptionsToAction === null || subscriptionsToAction === void 0 ? void 0 : subscriptionsToAction.delete(callback);
                }
            };
        };
        this.getElementId = function () { return _this.elementId; };
        this.elementId = elementId;
        this.subscribeToActions();
    }
    ;
    GenomeBrowserService.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, peregrine_ensembl_js_1.default()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GenomeBrowserService.prototype.ping = function () {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_g) {
                this.genomeBrowser = new peregrine_ensembl_js_1.GenomeBrowser();
                (_a = this.genomeBrowser) === null || _a === void 0 ? void 0 : _a.go();
                (_b = this.genomeBrowser) === null || _b === void 0 ? void 0 : _b.set_stick("homo_sapiens_GCA_000001405_27:1");
                (_c = this.genomeBrowser) === null || _c === void 0 ? void 0 : _c.set_switch(["track"]);
                (_d = this.genomeBrowser) === null || _d === void 0 ? void 0 : _d.set_x(this.x);
                (_e = this.genomeBrowser) === null || _e === void 0 ? void 0 : _e.set_bp_per_screen(this.bpPerScreen);
                (_f = this.genomeBrowser) === null || _f === void 0 ? void 0 : _f.set_message_reporter(function (x) {
                    console.error("this is my message receiver: " + x);
                });
                return [2 /*return*/];
            });
        });
    };
    GenomeBrowserService.prototype.subscribeToActions = function () {
        window.addEventListener('message', this.handleAction);
    };
    return GenomeBrowserService;
}());
exports.default = GenomeBrowserService;
