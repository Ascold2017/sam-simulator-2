import DetectedRadarObject from '#src/core/SAM/RadarObject/DetectedRadarObject.ts';
import SnowRadarObject from '#src/core/SAM/RadarObject/SnowRadarObject.ts';
import UndetectedRadarObject from '#src/core/SAM/RadarObject/UndetectedRadarObject.ts';

export default class RadarObjectDTO {
	public id: string;
	public distance: number;
	public azimuth: number;
	public elevation: number;
	public radialVelocity: number;
	public velocity: number;
	public height: number;
	public param: number;
	public x: number;
	public y: number;
	public rotation: number;
	public size: number;
	public visibilityK: number;
	public isMissile: boolean;
	public type: string;
	constructor(
		radarObject:
			| DetectedRadarObject
			| UndetectedRadarObject
			| SnowRadarObject,
	) {
		this.id = radarObject.id;
		this.type = radarObject.type;
		this.x = radarObject.x;
		this.y = radarObject.y;
		this.distance = radarObject.distance;
		this.azimuth = radarObject.azimuth;
		this.elevation = radarObject.elevation;
		this.height = radarObject.height;
		this.velocity = radarObject.velocity;
		this.radialVelocity = radarObject.radialVelocity;
		this.rotation = radarObject.rotation;
		this.size = radarObject.size;
		this.visibilityK = radarObject.visibilityK;
		this.param = radarObject.param;
		this.isMissile = radarObject instanceof DetectedRadarObject
			? radarObject.isMissile
			: false;
	}
}
