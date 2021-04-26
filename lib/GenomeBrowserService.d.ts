import { OutgoingAction } from './action';
export declare enum BrowserMessagingType {
    BPANE_READY_QUERY = "bpane-ready-query",
    BPANE_ACTIVATE = "bpane-activate",
    BPANE = "bpane",
    BPANE_READY = "bpane-ready",
    BPANE_OUT = "bpane-out"
}
declare class GenomeBrowserService {
    private elementId;
    constructor(elementId: string);
    private ping;
    private subscribeToActions;
    private handleAction;
    send: (action: OutgoingAction) => void;
    subscribe: (action: string, callback: Function) => {
        unsubscribe(): void;
    };
    getElementId: () => string;
}
export default GenomeBrowserService;
