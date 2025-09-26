import express from 'express'

import { getAccounts,addAccount } from '../controller/account.controller.js';
const router=express.Router()
// Routes
router.post("/add", addAccount);

router.get("/", getAccounts);

export default router