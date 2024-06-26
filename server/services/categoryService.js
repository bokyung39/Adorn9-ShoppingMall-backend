const { Category } = require('../models');

class CategoryService {
    constructor(Category) {
        this.Category = Category;
    }

    // 전체 목록 조회
    async getCategories(){
        return await Category.find({});
    }

    // 카테고리 추가
    async addCategories(name){
        const check = await Category.find({ name });
        if(check.length !== 0){
            throw new Error(JSON.stringify({
                status: 400,
                message: '이미 존재하는 카테고리명입니다'
            }));
        }
        
        await Category.create({ name });
        
        return await Category.find({});
    }

    // 카테고리 수정
    async setCategories(id, name){
        if(id.length !== 24){
            throw new Error(JSON.stringify({
                status: 400,
                message: '잘못된 카테고리ID 입니다'
            }));
        }
        
        const category = await Category.find({ _id:id });
        
        if(!category){
            throw new Error(JSON.stringify({
                status: 404,
                message: '존재하지 않는 카테고리ID 입니다'
            }));
        }

        await Category.updateOne({ _id:id },{ name });

        return await Category.find({});
    }

    // 카테고리 삭제
    async deleteCategories(id){
        if(id.length !== 24){
            throw new Error(JSON.stringify({
                status: 400,
                message: '잘못된 카테고리ID 입니다'
            }));
        }
        
        const category = await Category.find({ _id:id });
        
        if(!category){
            throw new Error(JSON.stringify({
                status: 404,
                message: '존재하지 않는 카테고리ID 입니다'
            }));
        }

        await Category.deleteOne({ _id:id });

        return await Category.find({});
    }
}

const categoryService = new CategoryService(Category);

module.exports = { categoryService };