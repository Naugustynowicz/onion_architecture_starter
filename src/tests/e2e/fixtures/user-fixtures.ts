import { AwilixContainer } from "awilix";
import { User } from "../../../domain/entities/user-entity";
import { IFixture } from "../utils/fixture.interface";
import { resolveDependency } from "../../../infrastructure/config/dependency-injection";

export class UserFixture implements IFixture {
    constructor(public entity: User){}

    async load(container: resolveDependency): Promise<void> {
        const userRepository = container('userRepository')
        await userRepository.create(this.entity)
    }

    createAuthorizationToken(){
        const token = Buffer.from(`${this.entity.props.email}:${this.entity.props.password}`).toString('base64')
        return `Basic ${token}`
    }
}