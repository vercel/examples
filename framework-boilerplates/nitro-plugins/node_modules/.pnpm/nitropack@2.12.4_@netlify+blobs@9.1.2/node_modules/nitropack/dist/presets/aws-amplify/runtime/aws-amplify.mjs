import "#nitro-internal-pollyfills";
import { useNitroApp } from "nitropack/runtime";
import { Server } from "node:http";
import { toNodeListener } from "h3";
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
server.listen(3e3, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Listening on http://localhost:3000 (AWS Amplify Hosting)`);
  }
});
