import { startDocker } from "./docker-manager"

export const setup = async () => {
    await startDocker()
}