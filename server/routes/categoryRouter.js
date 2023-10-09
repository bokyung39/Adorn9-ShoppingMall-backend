const { Router } = require('express');
const asyncHandler = require('../utils/async-handler');
const { categoryService } = require('../services');

const router = Router();

// ~~/api/v1/categories

// 카테고리 삭제

// 카테고리 목록 확인
router.get('/', asyncHandler(async (req, res) => {
    const categories = await categoryService.getCategories();
    return res.status(200).json({
        status:200,
        msg: "카테고리 목록",
        categories
    })
}));

// 카테고리 추가
/* 
    입력값 예시 : { name: ring }
*/
router.post('/', asyncHandler(async (req, res) => {
    const { name } = req.body;
    const categories = await categoryService.addCategories(name);
    return res.status(200).json({
        status:200,
        msg: "카테고리 추가",
        categories
    })
}));

// 카테고리 수정
/*
    body 입력값 예시 : { 
        "id": "651cceae8d266efc5c971fca"        *ring카테고리의 ObjectId
        "name": "ring2"
    }
*/
router.patch('/', asyncHandler(async (req, res) => {
    const { id, name } = req.body;
    const categories = await categoryService.setCategories(id, name);
    return res.status(200).json({
        status:200,
        msg: "카테고리 업데이트",
        categories
    })
}));

// 카테고리 삭제
/*
    body 입력값 예시 : { "id": "651cceae8d266efc5c971fca" }      
*/
router.delete('/', asyncHandler(async (req, res) => {
    const { id } = req.body;
    const categories = await categoryService.deleteCategories(id);
    return res.status(200).json({
        status:200,
        msg: "카테고리 삭제",
        categories
    })
}));

module.exports = router;