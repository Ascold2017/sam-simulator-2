import { engineInstance } from '#src/main.ts';
import { db } from '../../database/index.ts';
import MissionDTO, { MissionRow } from '../dto/MissionDTO.ts';
import FlightObjectTypesDTO, {
	FlightObjectTypesRow,
} from '../dto/FlightObjectTypesDTO.ts';

export function getFlightObjectTypes() {
	const data = db.query<FlightObjectTypesRow>(
		'SELECT * FROM flightObjectTypes',
	).map((
		payload,
	) => new FlightObjectTypesDTO(payload));
	return new Response(JSON.stringify(data));
}

export function getMissions() {
	const data = db.query<MissionRow>('SELECT * FROM missions').map((payload) =>
		new MissionDTO(payload)
	);
	return new Response(JSON.stringify(data));
}

export async function startMission(req: Request) {
	try {
		const { id } = await req.json();
		const [mission] = db.query<MissionRow>(
			'SELECT * FROM missions WHERE id=(?)',
			[id],
		).map((payload) => new MissionDTO(payload));
		if (mission) {
			engineInstance.resetMission();
			engineInstance.startMission(mission.tasks);
			
			return new Response(JSON.stringify({ ok: true }), { status: 200 });
		}
		return new Response(JSON.stringify({ ok: true }), { status: 404 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}

export async function saveMission(req: Request) {
	try {
		const payload = await req.json();
		if (payload.id === null) {
			const data = db.query(
				'INSERT INTO missions (name, tasks) VALUES (?, ?)',
				[
					payload.name,
					JSON.stringify(payload.tasks),
				],
			);
		} else {
			db.query(
				`UPDATE missions SET name = '${payload.name}', tasks = '${
					JSON.stringify(payload.tasks)
				}' WHERE id=${payload.id};`,
			);
		}
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (e) {
		console.log(e.message);
		return new Response(e.message, { status: 500 });
	}
}
