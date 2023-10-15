const { Product, Category, Ad } = require('../models');

const { DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});

class ProductService {
    constructor(Product) {
        this.Product = Product;
        this.perPage = 12;
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
            throw new Error(JSON.stringify({
                status: 404,
                message: '존재하지 않는 카테고리입니다'
            }));
        }
          
        const productList = await Product.find({ category:categoryCollection._id }, null, { skip: skipCount, limit: perPage})
        if(!productList){
            throw new Error(JSON.stringify({
                status: 404,
                message: '상품이 존재하지 않습니다'
            }));
        }
        return productList;
    }

    // 특정 상품 조회
    async getProductById(productId) {
        if(productId.length !== 24){
            throw new Error(JSON.stringify({
                status: 400,
                message: '잘못된 상품번호 입니다'
            }));
        }
        // 우선 해당 상품이 db에 존재하는지 확인
        const product = await this.Product.findOne({_id:productId});
        if (!product) {
            throw new Error(JSON.stringify({
                status: 404,
                message: '상품이 존재하지 않습니다'
            }));
        }

        return product;
    }

    // 카테고리로 조회
    async getCategoryProducts(category) {
        const categoryCollection = await Category.findOne({ name: category });

        if(!categoryCollection){
            throw new Error(JSON.stringify({
                status: 404,
                message: '존재하지 않는 카테고리입니다'
            }));
        }

        const productList = await Product.find({ category:categoryCollection._id })

        return productList;
    }

    // 메인화면에 표시할 피드 조회
    async getfeeds() {
        return await Ad.find({ type: "feed" }).limit(8);
    }

    // 메인화면에 표시할 상품 조회
    async getNewProducts() {
        return await Product.find({}).sort({ "_id":-1 }).limit(4);
    }

    // 상품 신규 등록 + 이미지
    async addProduct(req, res) {
        const { name, price, category, detail, maker } = req.body;
        const imageURL = req.file.location;

        const newProduct = await Product.create({
            name,
            price: Number(price),
            category,
            detail,
            maker,
            images: imageURL,
        })

        return newProduct;
    }

    async setProduct(req, res, next) {
        const { id } = req.params;

        const prevProduct = await Product.findOne({_id:id});
        const prevURL = prevProduct.get('images');
        const temp = prevURL.split('/');
        const key = temp[temp.length-1];

        const { name, price, category, detail, maker } = req.body;
        const imageURL = req.file.location;

        const result = await Product.findOneAndUpdate(
            {_id:id},
            { name, price, category, detail, maker, images:imageURL },
            { new: true}
        );

        res.status(200).json({
            status:200,
            msg: '상품 정보를 수정했습니다',
            result,
        });
    }

    async deleteImage(req, res, next) {
        const { id } = req.params;

        const prevProduct = await Product.findOne({_id:id});
        const prevURL = prevProduct.get('images');
        const temp = prevURL.split('/');
        const key = temp[temp.length-1];

        let params = {
            Bucket: 'adorn9',
            Key: `${key}`
        };
        
        const command = new DeleteObjectCommand(params);

        try {
            const response = await s3.send(command);
        }catch(err){
            console.error(err);
        }

        next();
    };

    async deleteProduct(req, res, next) {
        const { id } = req.params;
        const result = await Product.findOneAndDelete({ _id: id });

        res.status(200).json({
            status:200,
            msg: '상품을 삭제했습니다',
            result,
        })
    }

    async getManyProducts(idlist) {
        const result = [];
        
        for(const id of idlist) {
            const product = await Product.findOne({_id: id});
            if(!product){
                throw new error(`${id} 에 해당하는 상품이 없습니다`);
            }
            result.push(product);
        }
        
        return result;
    }
}

const productService = new ProductService(Product);

module.exports = { productService };
