const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { generateToken } = require('../../helper/index');
const bcrypt = require('bcrypt');


exports.registerUser = async (req,res) => {
    const { name, email, password } = req.body;
    try{

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          return res.status(409).json({ error: 'User already exists' });
        }


        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const Rdata = {
            name,
            email,
            password : hashedPassword,
        }

        let registeredAdmin = await prisma.user.create({data : Rdata})
        res.status(201).json({ message: 'Admin registered successfully' , data :registeredAdmin });

    }catch(err){
        console.log(err);
        
        res.status(500).json({ message: 'Failed to register admin' });
    }
}

exports.loginUser = async (req,res) => {
    const { email, password } = req.body;
    try{
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(existingUser);
        
        if(token) res.status(200).json({ message: 'Login successful', data : {user : existingUser  , token}});

    }catch(err){
        res.status(500).json({ message: 'Failed to login admin' });
    }
}