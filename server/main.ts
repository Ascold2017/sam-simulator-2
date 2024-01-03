Deno.serve((_request: Request) => {
  return new Response("Hello, world!");
});

/*
TODO

HTTP:
GET /missions
GET /flight-object-types
GET /sam-settings

POST /select-target
POST /unselect-target
POST /reset-targets
POST /launch-missile
POST /reset-missile

WS:
RADAR_OBJECTS_UPDATE
SELECTED_TARGET_IDS_UPDATE
MISSILE_CHANNELS_UPDATE
MISSILES_LEFT_UPDATE
*/
