const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();


exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock , categoryId } = req.body;

    const inventory = await prisma.inventory.create({ data : { stock } });

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        inventoryId : inventory.id,
        categoryId
      },
    });

    let allComplete =  await Promise.all([inventory , newProduct])

   if(allComplete) res.status(201).json({ message: 'Product created successfully', data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        inventory: true,
        category: true
      }
    });
    res.status(200).json({ message: 'Products fetched successfully', data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, stock, categoryId } = req.body;
  
    try {
      const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
  
      
      const updateData = {};
  
      if (name) updateData.name = name;
      if (price) updateData.price = price;
      if (categoryId) {
        updateData.category = {
          connect: { id: parseInt(categoryId) }
        };
      }
  
      // Update the product (basic fields)
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...updateData,
          inventory: stock
            ? {
                update: {
                  where: { id: product.inventoryId },
                  data: { stock }
                }
              }
            : undefined,
        },
        include: {
          inventory: true,
          category: true
        }
      });
  
      res.status(200).json({ message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  