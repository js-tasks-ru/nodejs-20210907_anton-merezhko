const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const cateogries = await Category.find({});
  ctx.body = {
    categories: cateogries.map((category) => ({
      id: category._id,
      title: category.title,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory._id,
        title: subcategory.title,
      })),
    })),
  };
};
