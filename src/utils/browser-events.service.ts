export type IEventHandlerMap = [string, EventListenerOrEventListenerObject[]][];

class BrowserEventsService {
  static registerEventListeners(eventHandlerPairs: IEventHandlerMap): Function {
    for(const [event, methods] of eventHandlerPairs) {
      methods.forEach(method => {
        window.addEventListener(event, method);
      });
    }

    return () => {
      for(const [event, methods] of eventHandlerPairs) {
        methods.forEach(method => {
          window.removeEventListener(event, method);
        });
      }
    };
  }  
}

export default BrowserEventsService;
