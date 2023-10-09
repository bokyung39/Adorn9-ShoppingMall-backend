const { Product, Category } = require('../models');

class ProductService {
    constructor(Product) {
        this.Product = Product;
        this.perPage = 16;
    }

    // 한 페이지에 표시할 물품 개수를 바꿀 경우
    setPerPage(num) {
        this.perPage = num;
        return;
    }

    // 전체 상품 조회
    async getProducts() {
        return await Product.find({});
    }

    // 카테고리 검색 결과에 페이지네이션 적용 
    async getCategoryProductsPage(category ,page) {
        const perPage = this.perPage;
        const skipCount = (Number(page)-1)*perPage;
          
        const categoryCollection = await Category.findOne({ name: category });
          
        if(!categoryCollection){
            throw new Error("존재하지 않는 카테고리입니다.");
            
        }
          
        const productList = await Product.find({ category:categoryCollection._id }, null, { skip: skipCount, limit: perPage})
        if(!productList){
            throw new Error("상품이 존재하지 않습니다.");
        }
        return productList;
    }

    // 특정 상품 조회
    async getProductById(productId) {
        if(productId.length !== 24){
            throw new Error('상품번호를 다시 확인해주세요');
        }
        // 우선 해당 상품이 db에 존재하는지 확인
        const product = await this.Product.findOne({_id:productId});
        if (!product) {
            throw new Error("상품이 존재하지 않습니다.");
        }

        return product;
    }

    // 카테고리로 조회
    async getCategoryProducts(category) {
        const categoryCollection = await Category.findOne({ name: category });

        if(!categoryCollection){
            throw new Error("존재하지 않는 카테고리입니다.");
        }

        return categoryCollection;
    }
}

const productService = new ProductService(Product);

module.exports = { productService };
