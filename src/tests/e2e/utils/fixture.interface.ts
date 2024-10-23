import { resolveDependency } from "../../../infrastructure/config/dependency-injection";

export interface IFixture {
    load(container: resolveDependency): Promise<void>
}