const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { orderService } = require('../services');
const passport = require('passport'); 
const { setUserToken } = require('../utils/jwt'); 
const router = Router();
const authenticateToken = require('../middlewares/authenticateToken');
// ~~/api/v1/orders
/* 임시로 작성한 프론트쪽 주문요청( api 테스트시 body에 넣고 테스트)
{
    "name": "홍길동",
    "phoneNumber":"01012345678",
    "email":"aabb@gmaiii.com",
    "receiver_name": "김철수",
    "address":"대한민국",
    "items": [
        {
            "item":"엘리베이션 링",
            "quantity": 3
        }
    ]
}
*/

// 주문 추가
router.post('/', asyncHandler(async (req, res) => {
    const { name, phoneNumber, email, receiverName, receiverPhoneNumber, payment, address, items, totalPrice } = req.body;
    const newOrder = await orderService.saveOrder( name, phoneNumber, email, receiverName, receiverPhoneNumber, payment, address, items, totalPrice );

    return res.status(201).json({
        status:201,
        msg: "주문 완료되었습니다",
        orderId: newOrder._id,
        newOrder,
    })
}));

// 주문번호로 검색
router.get('/:orderId', asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    const order = await orderService.getOrder(orderId);
    res.status(200).json({
        status:200,
        msg:`주문번호 ${orderId} 검색결과 입니다`,
        order,
    })
}));

// 주문번호로 삭제
router.delete('/:orderId', asyncHandler(async (req, res) => {
    const orderId = req.params.orderId;
    await orderService.deleteOrder(orderId);
    res.status(200).json({
        status:200,
        msg:"주문이 취소되었습니다."
    })
}));

// 사용자 ID(고유번호)로 주문 목록 조회
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
    const isAdmin = req.user.isAdmin; // 로그인한 사용자의 관리자 여부
    console.log(isAdmin);
    if (isAdmin) {
        // 관리자인 경우 모든 주문 내역 조회
        const orders = await orderService.getAllOrders();
        res.status(200).json({
            status: 200,
            msg: '모든 주문 목록 조회 성공',
            orders,
        });
    } else {
        // 일반 사용자인 경우 자신의 주문 내역 조회
        const userId = req.user.userId; // 로그인한 사용자의 ID
        const orders = await orderService.getOrdersByUserId(userId);
        res.status(200).json({
            status: 200,
            msg: '주문 목록 조회 성공',
            orders,
        });
    }
}));

// 주문 수정 (회원)
router.put('/:orderId', authenticateToken, asyncHandler(async (req, res) => {
    const userId = req.user.userId; // 로그인한 사용자의 ID
    const orderId = req.params.orderId;
    const { name, items, address, phoneNumber, receiverName, receiverPhoneNumber } = req.body;
    const updatedOrder = await orderService.updateOrder(userId, orderId, name, items, address, phoneNumber, receiverName, receiverPhoneNumber);
    res.status(200).json({
        status: 200,
        msg: `주문번호 ${orderId} 수정 완료되었습니다`,
        updatedOrder,
    });
    
}));

// 주문 삭제 (회원)
router.delete('/:orderId', authenticateToken, asyncHandler(async (req, res) => {
    const userId = req.user._id; // 로그인한 사용자의 ID
    const orderId = req.params.orderId;
    await orderService.deleteOrderUser(userId, orderId);
    res.status(200).json({
        status: 200,
        msg: '주문이 삭제되었습니다',
    });
}));


module.exports = router;
