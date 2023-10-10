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
    "items": [
        {
            "item":"엘리베이션 링",
            "quantity": 3
        }
    ],
    "address":"대한민국",
    "phoneNumber":"01012345678"
}
*/

// 주문 추가
router.post('/', asyncHandler(async (req, res) => {
    const { user_name, items, address, phone_number } = req.body;
    
    const newOrder = await orderService.saveOrder( name, items, address, phoneNumber );

    return res.status(201).json({
        status:201,
        msg: "주문 완료되었습니다",
        orderId: newOrder._id,
        newOrder,
        // ordered_user:memberOrder._id
    })
}));

// 주문번호로 검색
router.get('/:orderId', asyncHandler(async (req, res, next) => {
    const orderId = req.params.orderId;
    const order = await orderService.getOrder(orderId);
    res.status(200).json({
        status:200,
        msg:`주문번호 ${orderId} 검색결과 입니다`,
        order,
    })
}));

// 주문번호로 삭제
router.delete('/:orderId', asyncHandler(async (req, res, next) => {
    const orderId = req.params.orderId;
    await orderService.deleteOrder(orderId);
    res.status(200).json({
        status:200,
        msg:"주문이 취소되었습니다."
    })
}));


// 사용자 ID(고유번호)로 주문 목록 조회
router.get('/', authenticateToken, asyncHandler(async (req, res, next) => {
    const userId = req.user.userId; // 로그인한 사용자의 ID  
    const order = await orderService.getOrdersByUserId(userId);

    res.status(200).json({
        status: 200,
        msg: '주문 목록 조회 성공',
        order,
    });
}));

// 주문 수정 (회원)
router.put('/:orderId', authenticateToken, asyncHandler(async (req, res, next) => {
    const userId = req.user.userId; // 로그인한 사용자의 ID
    const orderId = req.params.orderId;
    const { name, items, address, phoneNumber } = req.body;

    try {
        const updatedOrder = await orderService.updateOrder(userId, orderId, name, items, address, phoneNumber);
        res.status(200).json({
            status: 200,
            msg: `주문번호 ${orderId} 수정 완료되었습니다`,
            updatedOrder,
        });
    } catch (error) {
        res.status(error.status).json(JSON.parse(error.message));
    }
}));


// 주문 삭제 (회원)
router.delete('/:orderId', authenticateToken, asyncHandler(async (req, res, next) => {
    const userId = req.user._id; // 로그인한 사용자의 ID
    const orderId = req.params.orderId;
  
    try {
        await orderService.deleteOrderUser(userId, orderId);
        res.status(200).json({
            status: 200,
            msg: '주문이 삭제되었습니다',
        });
    } catch (error) {
        res.status(error.status).json(JSON.parse(error.message));
    }
}));


module.exports = router;
