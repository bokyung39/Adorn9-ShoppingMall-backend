const { Order, Product ,User} = require('../models');

class OrderService {
    constructor(Order) {
        this.Order = Order;
        this.status = [ "상품준비중", "배송준비중", "배송중", "배송완료" ];
    }

    // 주문 저장 - 배송비 포함을 boolean으로 체크해야?
    async saveOrder(name, items, address, phoneNumber) {
        let totalPrice = 0;
        for(const obj of items){
            const objPrice = await Product.findOne({name:obj.item});
            const itemPrice = Number(obj.quantity) * Number(objPrice.get('price'));
            totalPrice = totalPrice + Number(itemPrice);
        }

        const orderedUser = await User.findOne({ phone_number: phoneNumber });

        const order = await Order.create({
            user_id: orderedUser? orderedUser._id : null,
            items,
            total_price: totalPrice,
            name,
            address,
            phone_number: phoneNumber,
            // status: ITEM_READY,
        });

        return order;
    }

}

const orderService = new OrderService(Product);

module.exports = { orderService };