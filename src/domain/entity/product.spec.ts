import Product from "./product";

describe("Product unit tests", () => {

    it("Should throw error when id is empty", () => {

        expect(() => {
            let product = new Product("", "Product 1", 100);
        }).toThrowError("Id is required");
    });

    it("Should throw error when name is empty", () => {

        expect(() => {
            let product = new Product("1", "", 100);
        }).toThrowError("Name is required");
    });

    it("Should throw error when price is equals or less than zero", () => {

        expect(() => {
            let product = new Product("1", "Product 1", -1);
        }).toThrowError("Price must be greater than zero");

        expect(() => {
            let product = new Product("1", "Product 1", 0);
        }).toThrowError("Price must be greater than zero");
    });

    it("Should changeName when name is not empty", () => {

        let product = new Product("1", "Product 1", 20);
        product.changeName("Product 01");

        expect(product.name).toBe("Product 01");
    });

    it("Should changePrice when price is valid", () => {

        let product = new Product("1", "Product 1", 20);
        product.changePrice(25);

        expect(product.price).toBe(25);
    });

});