

export interface ServerConfig {
    name: string;
    externalPort: number;
    port: number;
    host: string;
    image: string;

    service?: {
        lifespan?: number; // in seconds
    }
}

