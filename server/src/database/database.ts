import initData from './initData.json' with { type: 'json' };
import { DB } from 'https://deno.land/x/sqlite@v3.8/mod.ts';
export const db = new DB();
db.execute(`
  CREATE TABLE IF NOT EXISTS missions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    tasks TEXT
  );
  CREATE TABLE IF NOT EXISTS flightObjectTypes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rcs INTEGER,
    maxVelocity INTEGER,
    altitude INTEGER
  );
  DELETE FROM missions;
  DELETE FROM flightObjectTypes;
`);

initData.missions.forEach((mission) => {
	db.query(`INSERT INTO missions (name, tasks) VALUES (?, ?)`, [
		mission.name,
		mission.tasks,
	]);
});

initData.flightObjectTypes.forEach((fot) => {
	db.query(
		`INSERT INTO flightObjectTypes (name, rcs, maxVelocity, altitude) VALUES (?, ?, ?, ?)`,
		[
			fot.name,
			fot.rcs,
			fot.maxVelocity,
			fot.altitude,
		],
	);
});
