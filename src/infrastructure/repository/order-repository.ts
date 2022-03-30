import Order from "../../domain/entity/order";
import order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order-item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item-model";
import OrderModel from "../db/sequelize/model/order-model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }
    async update(entity: order): Promise<void> {

        await OrderItemModel.destroy({ where: { order_id: entity.id } });

        await OrderModel.update(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total()
            },
            {
                where: {
                    id: entity.id,
                }
            }
        );

        entity.items.map((item) => {
            OrderItemModel.create({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id
            });
        });


    }
    async find(id: string): Promise<order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                rejectOnEmpty: true,
                include: ["items"]
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        let items: OrderItem[] = [];
        orderModel.items.map((orderModelItem) => {

            let orderItem = new OrderItem(orderModelItem.id, orderModelItem.name, orderModelItem.price / orderModelItem.quantity, orderModelItem.product_id, orderModelItem.quantity);
            items.push(orderItem);
        });

        let order = new Order(orderModel.id, orderModel.customer_id, items);
        return order;

    }
    async findAll(): Promise<order[]> {
        const orderModels = await OrderModel.findAll({ include: ["items"] });
        let orders: Order[] = [];

        orderModels.map((orderModel) => {
            let items: OrderItem[] = [];

            orderModel.items.map((orderModelItem) => {

                let orderItem = new OrderItem(orderModelItem.id, orderModelItem.name, orderModelItem.price / orderModelItem.quantity, orderModelItem.product_id, orderModelItem.quantity);
                items.push(orderItem);
            });

            let order = new Order(orderModel.id, orderModel.customer_id, items);

            orders.push(order);
        });

        return orders;
    }


}