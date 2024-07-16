export default {
    Mission: [
        {
            id: 1,
            name: 'Test mission',
        },
    ],
    Environment: [
        {
            id: 1,
            type: 'radar',
            name: 'Main',
            entityId: 1,
            position: { x: 0, y: 0, z: 125 },
        },
        {
            id: 2,
            type: 'sam',
            name: 'SAM Position A',
            entityId: 2,
            position: { x: 570, y: 134, z: 54 },
        },
        {
            id: 3,
            type: 'sam',
            name: 'SAM Position B',
            entityId: 3,
            position: { x: -1300, y: -200, z: 38 },
        },
    ],
    Radar: [
        {
            id: 1,
            name: 'P-18',
            maxDistance: 500000,
            maxCaptureRange: 400000,
            minCaptureRange: 20000,
            maxDetectCount: 256,
            minElevation: -2,
            maxElevation: 60,
            radarHeight: 3,
        },
        {
            id: 2,
            name: 'T-25',
            maxDistance: 25000,
            maxCaptureRange: 22000,
            minCaptureRange: 2000,
            maxDetectCount: 8,
            minElevation: -2,
            maxElevation: 60,
            radarHeight: 2,
        },
        {
            id: 3,
            name: 'T-80',
            maxDistance: 80000,
            maxCaptureRange: 75000,
            minCaptureRange: 2200,
            maxDetectCount: 16,
            minElevation: -2,
            maxElevation: 60,
            radarHeight: 4,
        },
        {
            id: 4,
            name: 'T-200',
            maxDistance: 200000,
            maxCaptureRange: 185000,
            minCaptureRange: 5000,
            maxDetectCount: 32,
            minElevation: -2,
            maxElevation: 60,
            radarHeight: 10,
        },
    ],
    SAM: [
        {
            id: 1,
            name: 'P-300',
            radarId: 3,
            type: 'missile',
            weaponMaxSelectedCount: 6,
            weaponChannelsCount: 6,
            weaponAmmoCount: 16,
            weaponVelocity: 800,
            weaponMaxDistance: 75000,
            ammoKillRadius: 10,
            ammoMaxDeltaRotation: 0.5
        },
        {
            id: 2,
            name: 'G-4',
            radarId: 2,
            type: 'gun',
            weaponMaxSelectedCount: 1,
            weaponChannelsCount: 1,
            weaponAmmoCount: 2000,
            weaponVelocity: 990,
            weaponMaxDistance: 4000,
            ammoKillRadius: 0.5,
            ammoMaxDeltaRotation: 0
        },
    ],
    FlightObjectType: [
        {
            id: 1,
            name: 'Su-25',
            rcs: 10,
            maxVelocity: 208,
            altitude: 200,
        },
        {
            id: 2,
            name: 'Su-34/35',
            rcs: 1,
            maxVelocity: 600,
            altitude: 1000,
        },
        {
            id: 3,
            name: 'MIG-29',
            rcs: 4,
            maxVelocity: 600,
            altitude: 500,
        },
        {
            id: 4,
            name: 'Bird',
            rcs: 0.01,
            maxVelocity: 13.9,
            altitude: 100,
        },
        {
            id: 5,
            name: 'X-101',
            rcs: 0.01,
            maxVelocity: 200,
            altitude: 35,
        },
        {
            id: 6,
            name: 'P-800 Onix',
            rcs: 0.3,
            maxVelocity: 680,
            altitude: 12,
        },
        {
            id: 7,
            name: 'X-555',
            rcs: 0.5,
            maxVelocity: 200,
            altitude: 40,
        },
        {
            id: 8,
            name: 'SSM Tochka-U',
            rcs: 1.5,
            maxVelocity: 1100,
            altitude: 26000,
        },
        {
            id: 9,
            name: 'SSM Iskander',
            rcs: 0.15,
            maxVelocity: 2100,
            altitude: 80000,
        },
    ],
    MissionFlightTask: [
        {
            id: 1,
            missionId: 1,
            name: '----Flight object 1----',
            flightObjectTypeId: 1,
            points: [
                { x: 62400, y: 5600, z: 500, v: 208 },
                { x: 4000, y: 6400, z: 0, v: 208 },
            ],
            delay: 0,
        },
        {
            id: 2,
            missionId: 1,
            name: '----Flight object 2----',
            flightObjectTypeId: 3,
            points: [
                { x: 64000, y: 52800, z: 5000, v: 600 },
                { x: -9600, y: 15200, z: 0, v: 600 },
            ],
            delay: 0,
        },
        {
            id: 3,
            missionId: 1,
            name: '----Flight object 3----',
            flightObjectTypeId: 8,
            points: [
                { x: 157200, y: -15200, z: 29000, v: 1100 },
                { x: -7200, y: -8000, z: 0, v: 1100 },
            ],
            delay: 0,
        },
        {
            id: 4,
            missionId: 1,
            name: '----Flight object 4----',
            flightObjectTypeId: 4,
            points: [
                { x: -22400, y: 32800, z: 500, v: 13.9 },
                { x: -20800, y: 26400, z: 500, v: 13.9 },
                { x: -22400, y: 20000, z: 0, v: 13.9 },
            ],
            delay: 0,
        },
        {
            id: 5,
            missionId: 1,
            name: '----Flight object 5----',
            flightObjectTypeId: 4,
            points: [
                { x: -25600, y: 10400, z: 500, v: 13.9 },
                { x: -21600, y: 8800, z: 500, v: 13.9 },
                { x: -16800, y: 8000, z: 0, v: 13.9 },
            ],
            delay: 0,
        },
    ],

   
};
