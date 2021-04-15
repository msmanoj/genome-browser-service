import { Actions, ActionType, IncomingActions as IncomingMessage } from './action';

const subscriptions = new Map<string, Set<Function>>();

// TODO: This is temporary
export enum BrowserMessagingType {
  BPANE_READY_QUERY = 'bpane-ready-query',
  BPANE_ACTIVATE = 'bpane-activate',
  BPANE = 'bpane',
  BPANE_READY = 'bpane-ready',
  BPANE_OUT = 'bpane-out'
}

type IncomingMessageEventData = {
  type: BrowserMessagingType.BPANE_OUT;
} & IncomingMessage;

class GenomeBrowserService {

  element: HTMLElement | null= null;
  elementId: string = '';

   constructor (elementId: string) {
    this.elementId = elementId;
    this.subscribeToActions();
    this.ping();
  };

  private ping() {
    window.postMessage(
      {
        type: ActionType.PING
      },
      '*'
    );
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
  
  public send = (action: Actions) => {
    if (!this.element) {
      return;
    }
    let type: any = action.type;

    if( type === ActionType.ACTIVATE_BROWSER ){
      type = BrowserMessagingType.BPANE_ACTIVATE;
    } else if( type === ActionType.ACTIVATE_BROWSER ){
      type = BrowserMessagingType.BPANE_ACTIVATE;
    } else if( type === ActionType.PING ) {
      type = BrowserMessagingType.BPANE_READY_QUERY;
    }else {
      type = BrowserMessagingType.BPANE;
    }

    window.postMessage(
      { ...action.payload, type},
      '*'
    );

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
  
  public clearElement = () => this.element = null;
  
}

export default GenomeBrowserService;
