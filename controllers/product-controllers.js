const ProductModel = require("../models/product-model")
const uploadToCloudinary = require("../utils/uploadToCloudinary")


module.exports.getAllProducts = async (req, res) => {
    try {

        const {limit, sort} = req.query
        
        const query = ProductModel.find()

        if(limit) {
          query.limit(parseInt(limit))
        }

        if(sort) {
          query.sort(sort)
        }

         const products = await query
         res.json(products)
    } catch (error) {
      console.log(error)
        res.status(500).json({ message : "Error fetching products"})
    }
}


module.exports.createProduct = async (req, res) => {
  try {
    const { Title, Price, Category, Discount, Description, BGColor } = req.body;
    let imageURL = null;

    if (req.file) {
      try {
        imageURL = await uploadToCloudinary(req.file);
        console.log(imageURL)
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ message: "Error uploading image" });
      }
    }

    const newProduct = await ProductModel.create({
      Title,
      Price,
      Category,
      Discount,
      Description,
      BGColor,
      Image: imageURL,
    });

    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};


module.exports.updateProduct = async (req, res) => {
    try {
      const { Id } = req.params;
      const { Title, Price, Category, Discount, Description, BGColor } = req.body;
      const Image = req.file ? req.file.buffer : undefined;
      const updatedProduct = await ProductModel.findOneAndUpdate(
        {_id: Id},
        {Title, Price, Category, Discount, Description, BGColor, Image},
        { new: true}
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found"})
      }

      res.json(updatedProduct)

    } catch (error) {
       console.log(error);
        res.status(500).json({ message: "Error updating product"})
    }
    
}

module.exports.deleteProduct = async (req, res) => {
  try {
    const { Id } = req.params;
    const deletedProduct = await ProductModel.findOneAndDelete({_id: Id})
    if(!deletedProduct) {
      return res.status(404).json({ message: "Product not found"})
    }
    res.json({ message: "Product deleted successfully", deletedProduct })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting product"})
  }
}


module.exports.getProduct = async (req, res) => {
  try {
    const { Id } = req.params;
    const product = await ProductModel.findOne({ _id: Id})
    if (!product) {
      return res.status(404).json({ message: "Product not found"})
    }

    res.json(product)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching product" })
  }
}


module.exports.getProductCount = async (req, res) => {
  try {
    const totalProducts = await ProductModel.countDocuments();
    res.status(200).json({ totalProducts });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res.status(500).json({ message: "Server error" });
  }
};