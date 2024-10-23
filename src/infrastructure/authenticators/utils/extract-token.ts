export const extractToken = (credentials: string) => {
    const [prefix, token] = credentials.split(' ')
    const prefixes = ['Basic', 'Bearer']

    if(!prefixes.includes(prefix)) return null

    return token
}