export interface IMessageBroker {
    connect(): Promise<void>
    close(): Promise<void>
    publish(queue: string, message: any): Promise<void>
    isConnected(): boolean
}