export interface IPoint {
    x: number;
    y: number;
    z: number;
    v: number;
}
export interface IMission {
    id: number | null;
    name: string;
    tasks: ITask[];
}
export interface ITask {
    id: number | null;
    points: IPoint[];
    flightObjectTypeId: number | null;
    delay: number;
}
export interface IFlightObjectType {
    id: number;
    maxVelocity: number;
    altitude: number;
    name: string;
}

export interface EditorStartPayload {
    id: number;
}