CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    migration_name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Mission (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Environment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50),
    entityId INTEGER NOT NULL,
    position JSONB NOT NULL,
    missionId INTEGER REFERENCES Mission(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Radar (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    maxDistance FLOAT NOT NULL,
    maxCaptureRange FLOAT NOT NULL,
    minCaptureRange FLOAT NOT NULL,
    maxDetectCount INTEGER NOT NULL,
    minElevation FLOAT NOT NULL,
    maxElevation FLOAT NOT NULL,
    radarHeight FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS SAM (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    radarId INTEGER REFERENCES Radar(id),
    type VARCHAR(50),
    weaponMaxSelectedCount INTEGER NOT NULL,
    weaponChannelsCount INTEGER NOT NULL,
    weaponAmmoCount INTEGER NOT NULL,
    weaponVelocity FLOAT NOT NULL,
    weaponMaxDistance FLOAT NOT NULL,
    ammoKillRadius FLOAT NOT NULL,
    ammoMaxDeltaRotation FLOAT NOT NULL
);


CREATE TABLE IF NOT EXISTS FlightObjectType (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rcs FLOAT NOT NULL,
    maxVelocity FLOAT NOT NULL,
    altitude FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS MissionFlightTask (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    flightObjectTypeId INTEGER REFERENCES FlightObjectType(id),
    points JSONB NOT NULL,
    delay INTEGER NOT NULL,
    missionId INTEGER REFERENCES Mission(id) ON DELETE CASCADE
);