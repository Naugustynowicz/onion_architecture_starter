import { stopDocker } from "./docker-manager"

export const setup = async () => {
    await stopDocker()
}