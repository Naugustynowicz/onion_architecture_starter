import { Router } from "express";
import { changeSeats, organizeConference } from "../controllers/conference.controllers";
import { isAuthenticated } from "../middlewares/authenticator.middleware";

const router = Router()

router.use(isAuthenticated) //protège tout ce qui se trouve en dessous
router.post('/conference', organizeConference)
router.patch('/conference/:conferenceId', changeSeats)

export {router as ConferenceRoutes}