const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();


exports.createOrder = async (req, res) => {
const { items} = req.body
const { _id } = req.user
try{

    const order = await prisma.order.create({
        data: {
            total,
            userId: _id,
            items: {
                create: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: {
            items: true
        }
    });

    res.status(201).json({ message: 'Order created successfully', data: order });

} 
catch(error){
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
}

}