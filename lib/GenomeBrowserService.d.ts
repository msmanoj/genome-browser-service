import { OutgoingAction } from './action';
export declare enum BrowserMessagingType {
    BPANE_READY_QUERY = "bpane-ready-query",
    BPANE_ACTIVATE = "bpane-activate",
    BPANE = "bpane",
    BPANE_READY = "bpane-ready",
    BPANE_OUT = "bpane-out"
}
declare type GenomeBrowserType = {
    go: () => void;
    set_stick: (stickId: string) => void;
    set_bp_per_screen: (bpPerScreen: number) => void;
    set_x: (x: number) => void;
    set_y: (y: number) => void;
    set_switch: (path: string[]) => void;
    clear_switch: (path: string[]) => void;
    set_message_reporter: (callback: (x: any) => void) => void;
};
declare class GenomeBrowserService {
    private elementId;
    genomeBrowser: GenomeBrowserType | null;
    bpPerScreen: number;
    x: number;
    inited: boolean;
    constructor(elementId: string);
    init(): Promise<void>;
    private subscribeToActions;
    private handleAction;
    handleIncoming: (message: any) => void;
    send: (action: OutgoingAction) => Promise<void>;
    subscribe: (action: string, callback: Function) => {
        unsubscribe(): void;
    };
    getElementId: () => string;
}
export default GenomeBrowserService;
