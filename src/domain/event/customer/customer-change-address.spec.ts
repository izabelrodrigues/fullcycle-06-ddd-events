import Address from "../../entity/address";
import Customer from "../../entity/customer";
import EventDispatcher from "../@shared/event-dispatcher";
import CustomerAddressEvent from "./change-address/customer-change-address.event";
import EnviaConsoleLogHandler from "./change-address/handler/envia-console-log.handler";
import CustomerChangeAddressEvent from "./created/customer-created.event";


describe("Customer change address dispatcher tests", () => {

    it("Should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();

        const eventHandler01 = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler01);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler01);


    });

    it("should unregister all handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler01);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler01);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeUndefined();
    });

    it("should unregister event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler01 = new EnviaConsoleLogHandler();

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler01);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler01);

        eventDispatcher.unregister("CustomerChangeAddressEvent", eventHandler01);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length).toBe(0);


    });

    it("should notify event handlers", () => {

        const eventDispatcherAddress = new EventDispatcher();
        const eventHandlerAddress = new EnviaConsoleLogHandler();
        const spyEventHandlerAddress = jest.spyOn(eventHandlerAddress, "handle");

        eventDispatcherAddress.register("CustomerAddressEvent", eventHandlerAddress);
        expect(eventDispatcherAddress.getEventHandlers["CustomerAddressEvent"][0]).toMatchObject(eventHandlerAddress);

        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;

        const spyEventHandlerChange = jest.spyOn(customer, "changeAddress");
        expect(customer.address).toMatchObject(address);

        const newAddress = new Address("Street 2", 1, "Zipcode 2", "City 1");
        customer.changeAddress(newAddress);

        const callNumbers = spyEventHandlerChange.mockReturnValue().mock.calls.length;
        if (callNumbers === 1) {
            const customerAddressEvent = new CustomerAddressEvent({
                id: customer.id,
                name: customer.name,
                address: customer.address.toString()
            });

            eventDispatcherAddress.notify(customerAddressEvent);
            expect(spyEventHandlerAddress).toHaveBeenCalled();
        }

    });


});