export type FlightObjectTypesRow = [
	id: number,
	name: string,
	rcs: number,
	maxVelocity: number,
	altitude: number,
];
export default class FlightObjectTypesDTO {
	public id: number;
	public name: string;
	public rcs: number;
	public maxVelocity: number;
	public altitude: number;
	constructor([id, name, rcs, maxVelocity, altitude]: FlightObjectTypesRow) {
		this.id = id;
		this.name = name;
		this.rcs = rcs;
		this.maxVelocity = maxVelocity;
		this.altitude = altitude;
	}
}
