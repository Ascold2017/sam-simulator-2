import { IPoint } from '#src/core/Engine/Engine.ts';

interface ITask {
	id: number;
	flightObjectTypeId: number;
	points: IPoint[];
	rcs: number;
	delay: number;
}
export type MissionRow = [id: number, name: string, tasksJSON: string];
export default class MissionDTO {
	public id: number;
	public name: string;
	public tasks: ITask[];
	constructor(
		[id, name, tasksJSON]: MissionRow,
	) {
		this.id = id;
		this.name = name;
		this.tasks = JSON.parse(tasksJSON);
	}
}
