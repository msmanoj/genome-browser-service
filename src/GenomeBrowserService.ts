import { OutgoingAction, OutgoingActionType, IncomingAction } from './action';
import init, { 
  GenomeBrowser
} from '../lib/peregrine/peregrine_ensembl.js';

const subscriptions = new Map<string, Set<Function>>();

// TODO: This is temporary
export enum BrowserMessagingType {
  BPANE_READY_QUERY = 'bpane-ready-query',
  BPANE_ACTIVATE = 'bpane-activate',
  BPANE = 'bpane',
  BPANE_READY = 'bpane-ready',
  BPANE_OUT = 'bpane-out'
}


type GenomeBrowserType = {
  go: () => void,
  set_stick: (stickId:  string) => void,
  set_bp_per_screen: (bpPerScreen: number) => void,
  set_x: (x: number) => void,
  set_y: (y: number) => void,
  set_switch: (path: string[]) => void
  set_message_reporter: ( callback: (x: any) => void) => void
}


type IncomingMessageEventData = {
  type: BrowserMessagingType.BPANE_OUT;
} & IncomingAction;

class GenomeBrowserService {

  private elementId: string = '';
  genomeBrowser: GenomeBrowserType | null = null;

   constructor (elementId: string) {
    this.elementId = elementId;
    this.subscribeToActions();
    this.ping();
  };

  private async ping() {
    if(!document.getElementById(this.elementId)?.innerHTML){
      await init();
      this.genomeBrowser = new GenomeBrowser();
      this.genomeBrowser.go();
      this.genomeBrowser.set_stick("homo_sapiens_GCA_000001405_27:1");
      this.genomeBrowser.set_switch(["track","gene-pc-fwd"]);
      this.genomeBrowser.set_message_reporter(function(x) {
        console.error("this is my message receiver: "+x);
      });
    }
    
  }

  private subscribeToActions() {
    window.addEventListener('message', this.handleAction);
  }

  private handleAction = (event: MessageEvent) => {

    if (event.data.type !== BrowserMessagingType.BPANE_OUT) {
      return;
    }
    const { action, payload } = event.data as IncomingMessageEventData;

    const type = action;
    const subscriptionsToAction = subscriptions.get(`${this.elementId}-${type}`);

    subscriptionsToAction?.forEach(fn => fn(payload));
  }

  private handleIncoming = (message: any) => {

    console.log(message);
  }
  
  public send = (action: OutgoingAction) => {
    if (!this.elementId) {
      return;
    }

    let type: any = action.type;

    if( type === OutgoingActionType.ACTIVATE_BROWSER ) {
      
      this.ping();
      return;
    }

    if (!this.genomeBrowser) {
      return;
    }


   if(action.type === OutgoingActionType.SET_FOCUS) {

      this.genomeBrowser.set_stick(action.payload?.focus as string)
    
    } else if(action.type === OutgoingActionType.TOGGLE_TRACKS){
      console.log(action.payload);
      this.genomeBrowser.set_switch(["Track"])

    } else {

      type = BrowserMessagingType.BPANE;

    }


  };
  
  public subscribe = (action: string, callback: Function) => {
    
    const subscriptionsToAction = subscriptions.get(`${this.elementId}-${action}`);
    if (subscriptionsToAction) {
      subscriptionsToAction.add(callback);
    } else {
      subscriptions.set(action, new Set([callback]));
    }
  
    return {
      unsubscribe() {
        subscriptionsToAction?.delete(callback)
      }
    }
  };

  public getElementId = () => this.elementId;

  
}

export default GenomeBrowserService;
