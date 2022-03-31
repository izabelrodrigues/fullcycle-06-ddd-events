import EventDispatcher from "../@shared/event-dispatcher";
import CustomerCreatedEvent from "./created/customer-created.event";
import EnviaConsoleLog1Handler from "./created/handler/envia-console-log01.handler";
import EnviaConsoleLog2Handler from "./created/handler/envia-console-log02.handler";

describe("Customer created dispatcher tests", () => {

    it("Should register two events handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler01 = new EnviaConsoleLog1Handler();
        const eventHandler02 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler01);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler02);


    });

    it("should unregister all handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLog1Handler();
        const eventHandler02 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler01);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler02);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should unregister only event handler 01", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLog1Handler();
        const eventHandler02 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler01);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler02);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler01);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler02);

    });

    it("should unregister only event handler 02", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLog1Handler();
        const eventHandler02 = new EnviaConsoleLog2Handler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler01);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler02);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);

    });

    it("should notify all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLog1Handler();
        const eventHandler02 = new EnviaConsoleLog2Handler();

        const spyEventHandler01 = jest.spyOn(eventHandler01, "handle");
        const spyEventHandler02 = jest.spyOn(eventHandler02, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler01);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler02);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler01);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler02);

        const customerCreatedEvent = new CustomerCreatedEvent({});

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler01).toHaveBeenCalled();
        expect(spyEventHandler02).toHaveBeenCalled();

    });


});