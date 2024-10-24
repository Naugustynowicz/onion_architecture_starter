import { Router } from "express";
import { changeDates, changeSeats, organizeConference } from "../controllers/conference.controllers";
import { isAuthenticated } from "../middlewares/authenticator.middleware";

const router = Router()

router.use(isAuthenticated) //protège tout ce qui se trouve en dessous
router.post('/conference', organizeConference)
router.patch('/conference/:conferenceId', changeSeats)
router.patch('/conference/:conferenceId/dates', changeDates)

export { router as ConferenceRoutes };
