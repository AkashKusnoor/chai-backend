import express from 'express'
import { addSkills } from '../controllers/addSkillController.js'


const router = express.Router()


router.post("/addskill", addSkills)


export default router;