import Order from "./order";
import OrderItem from "./order-item";

describe("Order unit tests", () => {
    it("Should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when items are empty", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    });

    it("should calculate total", () => {
        const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
        const item3 = new OrderItem("i3", "Item 3", 50, "p3", 2);

        const order = new Order("o1", "c1", [item, item2, item3]);
        let total = order.total();
        expect(total).toBe(700);
    });

    it("should throw error when any item hasn't quantity greater than zero", () => {

        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
            const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);
            const item3 = new OrderItem("i3", "Item 3", 50, "p3", 0);

            const order = new Order("o1", "c1", [item, item2, item3]);
            let total = order.total();
        }).toThrowError("Quantity must be greater than 0");

    });
});