import type BaseFlightObject from "../../Engine/FlightObject/BaseFlightObject.ts";
import BaseRadarObject from "./BaseRadarObject.ts";

export default class UndetectedRadarObject extends BaseRadarObject {
  constructor(flightObject: BaseFlightObject) {
    super({
      id: flightObject.id,
      currentPoint: flightObject.getCurrentPoint(),
      currentRotation: flightObject.getCurrentRotation(),
      visibilityK: flightObject.visibilityK * 2 * Math.random(),
    });
  }
}
