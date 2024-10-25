import { IAuthenticator } from "../../interfaces/authenticator.interface"
import { IUserRepository } from "../../interfaces/user-repository.interface"

export class JwtAuthenticator implements IAuthenticator{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async authenticate(token: string){
        throw new Error('Not implemented.')
    }
}