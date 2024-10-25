import { jwtDecode } from "jwt-decode";
import { IAuthenticator } from "../../interfaces/authenticator.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";

type CustomJwtPayload = {
    email: string,
    password: string
}

export class JwtAuthenticator implements IAuthenticator{
    constructor(
        private readonly userRepository: IUserRepository
    ){}

    async authenticate(token: string){
        // const decoded =  Buffer.from(token, 'base64').toString('utf-8')
        const decoded = jwtDecode<CustomJwtPayload>(token);

        const [email, password] = [decoded.email, decoded.password]
        const user = await this.userRepository.findByEmail(email)

        if(!user || user.props.password !== password) throw new Error("Wrong credentials.")

        return user
    }
}