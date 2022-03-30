import EventInterface from "./event.interface";
//= valor padrão
export default interface EventHandlerInterface<T extends EventInterface = EventInterface> {

    handle(event: T): void;

}