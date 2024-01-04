# SAM Simulator-2

Pseudo-simulator of the surface-to-air system, based on Deno, Vue 3, Canvas&Konva.js.
Client-server version. Backend with Deno.

## Used technologies
Client:
- Vue 3
- Konva.js (VueKonva)
- Typescript
- Vuetify
- Pinia

Server:
- Deno

## Telegram channel of project

https://t.me/sam_simulator

![image](/public/Screenshot_1.png)
![image](/public/Screenshot_2.png)

## How to run

1. Install Deno https://docs.deno.com/runtime/manual#install-deno and Node.Js
2. cd client && npm run dev
3. cd server && deno task run
4. Open http://localhost:5173
5. Enjoy!

## How to game

1. Start Test mission
2. Turn on power (button ON)
3. Seek target list (button SEEK)
4. Select target (button SLCT). Max selected targets count - 3. For unselect - press UNSLCT. For reset all selection - button RST
5. Launch missile, when target will nearby killzone (red circle) - red button LNCH. For reset missile - button RST
6. On each missile channels there are "busy" indicator. If it green - you can launch missile from this channel.
6. Shot and shot, till your missiles or targets end...
7. Turn off your SAM (button OFF)



