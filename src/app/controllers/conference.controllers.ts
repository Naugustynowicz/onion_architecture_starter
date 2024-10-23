import { NextFunction, Request, Response } from "express";
import { container } from "../../infrastructure/config/dependency-injection";
import { RequestValidator } from "../utils/validate-request";
import { ChangeSeatsInputs, CreateConferenceInputs } from "../dto/conference.dto";

export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {input, errors} = await RequestValidator(CreateConferenceInputs, req.body)

        if(errors) return res.jsonError(errors, 400)

        const result = await container('organizeConferenceUsecase').execute({
            user: req.user,
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats
        })
        return res.jsonSuccess({id: result.id}, 201)
    } catch(e){
        next(e)
    }
}

export const changeSeats = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { conferenceId } = req.params

        const {input, errors} = await RequestValidator(ChangeSeatsInputs, req.body)

        if(errors) return res.jsonError(errors, 400)

        await container('changeSeatsUsecase').execute({
            seats: input.seats,
            conferenceId,
            user: req.user
        })
        return res.jsonSuccess({message: `Conference with id: ${conferenceId} was updated.`}, 200)
    } catch(e){
        next(e)
    }
}