const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const existingCategory = await prisma.category.findUnique({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }
        let catData = {
            name,
            description
        }
        const newCategory = await prisma.category.create({
            data: catData
        });

        res.status(201).json({ message: 'Category created successfully', data: newCategory });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create category' });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ message: 'Categories fetched successfully', data: categories });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch categories' });
    }
}