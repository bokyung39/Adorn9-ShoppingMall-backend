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
    // name, phoneNumber, email, receiver_name, address, items
    async saveOrder(name, phoneNumber, email, receiverName, receiverPhoneNumber, payment, address, items, totalPrice) {
        totalPrice = 0;
        let updatedItems = [];

        for(const obj of items){
            const objInfo = await Product.findOne({name:obj.item});
            const itemPrice = Number(obj.quantity) * Number(objInfo.get('price'));
            updatedItems.push({
                item: obj.item,
                quantity: obj.quantity,
                price: objInfo.get('price')*Number(obj.quantity),
                item_img: objInfo.get('images'),
            });
            totalPrice = totalPrice + Number(itemPrice);
        }

        const orderedUser = await User.findOne({ phone_number: phoneNumber });

        const order = await Order.create({
            user_id: orderedUser? orderedUser._id : null,
            name: orderedUser? orderedUser.user_name : null,
            phone_number: orderedUser? orderedUser.phone_number : null,
            email: orderedUser? orderedUser.email : null,
            receiver_name: receiverName,
            receiver_phone_number: receiverPhoneNumber,
            payment,
            address,
            items: updatedItems,
            total_price: totalPrice,
            status: this.statusEnum.ITEM_READY,
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

    // 주문 삭제 (사용자)
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
        }else if(order.status !== this.statusEnum.ITEM_READY){
            throw new Error(JSON.stringify({
                status: 403,
                message: `${order.status}인 주문은 취소가 불가능합니다.`
            }));
        }
        await Order.deleteOne({ _id : orderId });
    }

    // 회원 ID(고유번호)로 주문 목록 조회
    async getOrdersByUserId(userId) {
        const orders = await this.Order.find({ user_id: userId });
        if (orders.length === 0) {
            throw new Error(JSON.stringify({
                status: 404,
                message: '주문 내역이 없습니다'
            }));
        }
        return orders;
    }

    // // 회원 이름으로 주문 목록 조회
    // async getOrdersByUserName(userName) {
    //     const orders = await this.Order.find({ user_name: userName });
    //     console.log(orders)
    //     return orders;
    // }

    // 모든 주문 내역
    async getAllOrders() {
        const orders = await this.Order.find();
        if (orders.length === 0) {
            throw new Error(JSON.stringify({
                status: 404,
                message: '주문 내역이 없습니다'
            }));
        }
        return orders;
    }

    // 주문 수정 (회원)
    async updateOrder(userId, orderId, name, items, address, phoneNumber, receiverName, receiverPhoneNumber) {
        const order = await this.Order.findOne({ _id: orderId, user_id: userId });

        if (!order) {
            throw new Error(JSON.stringify({
                status: 404,
                message: '잘못된 주문번호입니다'
            }));
        }

        if (order.status !== this.statusEnum.ITEM_READY) {
            throw new Error(JSON.stringify({
                status: 403,
                message: `${order.status}인 주문은 수정이 불가능합니다.`,
            }));
        }

        // 수정 내역 정보 업데이트
        order.name = name;
        order.items = items;
        order.address = address;
        order.phone_number = phoneNumber;
        order.receiver_name = receiverName;
        order.receiver_phone_number = receiverPhoneNumber;

        // 업데이트된 주문 정보 저장, 반환
        return order.save();
    }

    // 주문 삭제 (관리자)
    async deleteOrderUser(userId, orderId) {
        const order = await this.Order.findOne({ _id: orderId, user_id: userId });

        if (!order) {
            throw new Error(JSON.stringify({
                status: 404,
                message: '해당하는 주문이 없습니다',
            }));
        }

        // // 주문이 상품 준비중인 경우에만 삭제 가능
        // if (order.status !== "상품준비중") {
        //     throw new Error(JSON.stringify({
        //         status: 403,
        //         message: '이미 배송이 시작된 주문은 삭제할 수 없습니다',
        //     }));
        // }

        await this.Order.deleteOne({ _id: orderId });
    }
}

const orderService = new OrderService(Order);

module.exports = { orderService };
