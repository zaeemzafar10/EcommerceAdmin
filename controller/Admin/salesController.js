const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();


exports.watchSales = async (req, res) => {
    const { categoryId, productId , fromDate , toDate , page = 1, limit = 5} = req.query;
  
    try {
      const filters = {};
  
      
      if (categoryId || productId) {
        filters.items = {
          some: {
            product: {
              ...(categoryId && { categoryId: parseInt(categoryId) }),
              ...(productId && { id: parseInt(productId) }),
            },
          },
        };
      }

      if (fromDate && toDate) {
        filters.createdAt = {
            gte: new Date(fromDate),
            lte: new Date(toDate),
        };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);
  
      const sales = await prisma.order.findMany({
        where: filters,
        skip,
        take,
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
          user: true,
        },
      });
  
      const totalCount = await prisma.order.count({ where: filters });

      res.status(200).json({
        message: 'Sales fetched successfully',
        data: sales,
        meta: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
exports.getRevenue = async (req, res) => {
    const { mode } = req.query;
  
    try {
      const filters = {};
  
      if (mode === "daily") {
        filters.createdAt = {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        };
      }

        if (mode === "weekly") {
            const startOfWeek = new Date();
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            filters.createdAt = {
            gte: startOfWeek,
            lte: new Date(),
            };
        }


        if(mode === "monthly") {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            filters.createdAt = {
            gte: startOfMonth,
            lte: new Date(),
            };
        }


        if(mode === "yearly") {
            const startOfYear = new Date();
            startOfYear.setMonth(0);
            startOfYear.setDate(1);
            filters.createdAt = {
            gte: startOfYear,
            lte: new Date(),
            };
        }
  
      const revenue = await prisma.order.aggregate({
        where: filters,
        _sum: {
          total: true,
        },
      });
  
      res.status(200).json({
        message: 'Revenue fetched successfully',
        data: {mode , revenue : revenue._sum.total || 0},
      });
    } catch (error) {
      console.error('Error fetching revenue:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };