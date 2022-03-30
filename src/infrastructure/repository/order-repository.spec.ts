import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order-item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer-model";
import OrderItemModel from "../db/sequelize/model/order-item-model";
import OrderModel from "../db/sequelize/model/order-model";
import ProductModel from "../db/sequelize/model/product-model";
import CustomerRepository from "./customer-repository";
import OrderRepository from "./order-repository";
import ProductRepository from "./product-repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },

        });

        sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,]);
        await sequelize.sync();

    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    name: ordemItem.name,
                    price: ordemItem.price,
                    quantity: ordemItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should update an order", async () => {

        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2,
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        //update ( add more items )

        const product02 = new Product("124", "Product 2", 20);
        await productRepository.create(product02);

        const newOrderItem = new OrderItem(
            "2",
            product02.name,
            product02.price,
            product02.id,
            3,
        );

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        const itensEncontrados = orderModel.items;
        let itemsAtualizados: OrderItem[] = [];

        itensEncontrados.forEach((item) => {

            const orderDB: OrderItem = new OrderItem(item.id, item.name, item.price / item.quantity, item.product_id, item.quantity);
            itemsAtualizados.push(orderDB);

        });

        itemsAtualizados.push(newOrderItem);
        order.changeItems(itemsAtualizados);

        await orderRepository.update(order);

        const orderModelUpdated = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });


        expect(orderModelUpdated.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: ordemItem.id,
                    product_id: ordemItem.productId,
                    order_id: "123",
                    quantity: ordemItem.quantity,
                    name: ordemItem.name,
                    price: ordemItem.price,
                },
                {
                    id: newOrderItem.id,
                    product_id: newOrderItem.productId,
                    order_id: "123",
                    quantity: newOrderItem.quantity,
                    name: newOrderItem.name,
                    price: newOrderItem.price,

                },
            ],
        });

    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const address1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer1.address = address1;
        customer1.addRewardPoints(10);
        customer1.activate();

        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer2.address = address2;
        customer2.addRewardPoints(20);

        await customerRepository.create(customer1);
        await customerRepository.create(customer2);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const product2 = new Product("124", "Product 2", 20);
        await productRepository.create(product2);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2,
        );

        const order = new Order("123", customer1.id, [ordemItem]);

        const ordemItem2 = new OrderItem(
            "2",
            product2.name,
            product2.price,
            product2.id,
            3,
        );

        const order2 = new Order("124", customer2.id, [ordemItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order);
        expect(orders).toContainEqual(order2);
    });


    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.address = address;
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const ordemItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [ordemItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderResult);


    });
});