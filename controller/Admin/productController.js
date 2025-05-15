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

    
    res.status(201).json({ message: 'Product created successfully', data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}