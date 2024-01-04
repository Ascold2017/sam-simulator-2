import missions from '#src/assets/missions.json' with { type: 'json' };

export function getMissions() {
	return new Response(JSON.stringify(missions));
}
