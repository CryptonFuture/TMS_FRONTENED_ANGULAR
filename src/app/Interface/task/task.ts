export interface AddTask {
    name: string;
    description: string,
    client_id: string,
}

export interface UpdateTask {
    name: string;
    description: string,
    client_id: string,
    status: boolean
}

