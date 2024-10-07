import AdminService from "../service/admin-service";
import CustomRouter from "./router";
import express from 'express';

const router = new CustomRouter(express.Router());
const adminService = new AdminService();




export default router._router;