const { Router } = require('express');
const upload = require('../middlewares/image-uploader');
const asyncHandler = require('../utils/async-handler');
const { productService } = require('../services');
const authenticateToken = require('../middlewares/authenticateToken');
const authenticateTokenAdmin = require('../middlewares/authenticateTokenAdmin');
const router = Router();

// 전체 상품 조회. 요청 URI : GET ~~/api/v1/products
router.get('/', asyncHandler(async (req, res) => {
  const products = await productService.getProducts();
/**
    * #swagger.tags = ['products']
    * #swagger.summary = '전체 상품 조오회'
    */
  return res.status(200).json({
    status: 200,
    msg: "전체 상품 리스트",
    products,
  });
}));

// 메인 페이지 상품 조회
// 피드 이미지 8개
router.get('/main/feeds', asyncHandler(async (req, res) => {
  /**
    * #swagger.tags = ['products']
    * #swagger.summary = '메인 페이지 조회'
    */
  const feeds = await productService.getfeeds();
  return res.status(200).json({
    status:200,
    msg: `feed 목록`,
    feeds,
  });
}));

// 광고 이미지 3개
// router.get('/main/ads', asyncHandler(async (req, res) => {
  
// }));

// 최신 등록순 4개
router.get('/main/new-products', asyncHandler(async (req, res) => {
  const newProducts = await productService.getNewProducts();

  return res.status(200).json({
    status:200,
    msg: `최근 등록된 상품`,
    newProducts,
  });

}));

// 한번에 여러개의 ID를 받아서 한꺼번에 리턴
// [ id, id, id, id] 같은방식
router.post('/array', asyncHandler(async (req, res) => {
  const { idlist } = req.body;
  const products = await productService.getManyProducts(idlist);

  return res.status(200).json({
    status:200,
    msg: `상품 리스트`,
    products,
  });
}));

// 카테고리 + 페이지네이션. 요청 URI : GET ~~/api/v1/products/categories?category=ring&page=1
router.get('/categories', asyncHandler(async (req, res) => {
  const { category, page } = req.query;

  const productList = await productService.getCategoryProductsPage(category ,page);

  return res.status(200).json({
    status:200,
    msg: `${category} 카테고리 ${page}페이지`,
    productList,
  });
}));

// 특정 상품 조회. 요청 URI : GET ~~/api/v1/products/:상품id
router.get('/:id', asyncHandler(async (req, res) => {
/**
    * #swagger.tags = ['products']
    * #swagger.summary = '특정 상품 조오회'
    */
  const productId = req.params.id;
  const product = await productService.getProductById(productId);

  return res.status(200).json({
    status: 200,
    msg: `id:${productId} 상품 검색 결과`,
    product,
  });
}));

// 카테고리로 검색. 요청 URI : GET ~~/api/v1/products/category/necklace
router.get('/categories/:categories', asyncHandler(async (req, res) => {
/**
    * #swagger.tags = ['products']
    * #swagger.summary = '카테고리 검색으로 상품 조회'
    */
  const name = req.params.categories;
  const categoryProducts = await productService.getCategoryProducts(name);

  return res.status(200).json({
    status:200,
    msg: `${name}으로 검색결과`,
    categoryProducts,
  });
}));

// 이미지 등록시 
// 상품 이름, 상품 가격, 상품 카테고리, 상품 이미지, 상품 상세설명, 상품 메이커 
/*
Postman으로 테스트시 Body에 form-data선택, key - Value로 아래처럼 등록
{
    name:테스트상품,
    price: 5000,
    category: 651ccd268d266efc5c971fc9,
    detail: 상품등록 테스트 상세설명입니다,
    maker: ADORN9,
    image: 이미지파일
}
*/
router.post('/', 
  authenticateTokenAdmin, 
  upload.single('image'), 
  asyncHandler( async (req, res) => {
    /**
    * #swagger.tags = ['products']
    * #swagger.summary = '상품 등록'
    */
    const result = await productService.addProduct(req, res);

    res.status(201).json({
    status:201,
    msg: '상품이 등록되었습니다',
    result,
    });
  })
);

// 상품 수정
router.patch('/:id',
  authenticateTokenAdmin,
  upload.single('image'),
  productService.deleteImage,
  productService.setProduct);

// 상품 삭제
router.delete('/:id',
  authenticateTokenAdmin,
  productService.deleteImage,
  productService.deleteProduct);

module.exports = router;
