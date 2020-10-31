export interface point {
    type: 'Point';
    coordinates: [number, number];
}

export interface barebone_order {
    phone_number?: string;
    email?: string;
    region?: string;
    location: point;
    full_address?: string;
    stop_time: number;
    placed?: Date;
    started?: Date;
    arrival_time?: Date;
    arrived?: Date;
    completed?: Date;
}

export interface order extends barebone_order {
    region: string;
    full_address: string;
    stop_time: number;
    placed: Date;
    arrival_time: Date;
}

export interface car {
    _id?: string;
    driver?: string;
    region?: string;
    start_time: number;
    start_pos: point;
    orders?: order[];
}
