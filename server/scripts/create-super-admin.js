const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
require("dotenv").config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB for creating super admin");

        const existingSuperAdmin = await userModel.findOne({role: "super_admin"})
        if(existingSuperAdmin){
            console.log("Super admin already exists");
            process.exit(0);
        }

        const superAdminData = {
            username: "super_admin",
            password: await bcrypt.hash("SuperAdmin123", 10),
            email: "super_admin@example.com",
            role: "super_admin",
            bio: "I am the super admin",
        }

        const newSuperAdmin = new userModel(superAdminData);
        await newSuperAdmin.save();
        console.log("Super admin created successfully");
        process.exit(0);

    } catch (error) {
        console.error("Error creating super admin", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createSuperAdmin();