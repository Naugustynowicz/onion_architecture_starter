import { NextFunction, Request, Response } from "express";
import { extractToken } from "../../infrastructure/authenticators/utils/extract-token";
import { container } from "../../infrastructure/config/dependency-injection";

declare module 'express-serve-static-core' {
    interface Request {
        user?: any
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // const userRepository = container('userRepository')
    // await userRepository.create(testUsers.johnDoe)
    try {
        const credentials = req.headers.authorization
        if(!credentials) return res.jsonError('Unauthorized access', 403)

        const token = extractToken(credentials)
        if(!token) return res.jsonError('Unauthorized access', 403)

        const user = await container('authenticator').authenticate(token)
        if(!user) return res.jsonError('Unauthorized access', 403)

        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}