const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { orderService } = require('../services');

const router = Router();

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
    const { name, items, address, phoneNumber } = req.body;
    
    const newOrder = await orderService.saveOrder( name, items, address, phoneNumber );

    return res.status(201).json({
        status:201,
        msg: "주문 완료되었습니다",
        orderId: newOrder._id,
        newOrder,
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



module.exports = router;