interface IMissionLoggerEvent {
	time: number;
	message: string;
}
export default class MissionLogger {
	private events: IMissionLoggerEvent[] = [];
	static instance: MissionLogger;
	constructor() {
		if (MissionLogger.instance) return MissionLogger.instance;
		MissionLogger.instance = this;
	}

	public log(message: string) {
		this.events.push({
			time: new Date().getTime(),
			message,
		});
	}

	public getLogs() {
		return this.events.slice(0);
	}

	public reset() {
		this.events = [];
	}
}
