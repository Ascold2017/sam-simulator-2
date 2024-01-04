import FLIGHT_OBJECT_TYPES from '#src/assets/FLIGHT_OBJECT_TYPES.ts';

export function getFlightObjectTypes() {
	return new Response(JSON.stringify(FLIGHT_OBJECT_TYPES));
}
