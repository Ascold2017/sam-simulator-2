import missions from '#src/assets/missions.json' with { type: 'json' };
import { engineInstance } from '#src/main.ts';
export function getMissions() {
	return new Response(JSON.stringify(missions));
}

export async function startMission(req: Request) {
	try {
		const { id } = await req.json();
		const mission = missions.find((m) => m.id === id);
		const missionData = JSON.parse(mission!.data);
		engineInstance.resetMission();
		engineInstance.startMission(missionData);
		return new Response('ok', { status: 200 });
	} catch (e) {
		return new Response(e.message, { status: 500 });
	}
}
