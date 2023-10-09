const { Order, Product, User } = require('../models');

class OrderService {
    constructor(Order) {
        this.Order = Order;
        this.statusEnum = {
            ITEM_READY: "상품준비중",
            DELIVER_READY: "배송준비중",
            DELIVERING: "배송중",
            DELIVERED: "배송완료"
        };
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
            status: ITEM_READY,
        });

        return order;
    }

    // 주문 검색
    async getOrder(orderId){
        if(orderId.length !== 24){
            throw new Error(JSON.stringify({
                status: 400,
                message: '잘못된 주문번호입니다'
            }));
        }
        const order = await Order.findOne({ _id : orderId });
        if(!order){
            throw new Error(JSON.stringify({
                status: 404,
                message: '해당하는 주문이 없습니다'
            }));
        }
        return order;
    }

    // 주문 삭제
    async deleteOrder(orderId){
        if(orderId.length !== 24){
            throw new Error(JSON.stringify({
                status: 400,
                message: '잘못된 주문번호입니다'
            }));
        }
        const order = await Order.findOne({ _id : orderId });
        if(!order){
            throw new Error(JSON.stringify({
                status: 404,
                message: '해당하는 주문이 없습니다'
            }));
        }else if(order.status !== "상품준비중"){
            throw new Error(JSON.stringify({
                status: 403,
                message: '배송이 완료된 경우 주문 취소가 불가능합니다. 관리자에게 문의해주세요'
            }));
        }
        await Order.deleteOne({ _id : orderId });
    }
}

const orderService = new OrderService(Order);

module.exports = { orderService };