import { defineNitroPreset } from "nitropack/kit";
const alwaysdata = defineNitroPreset(
  {
    extends: "node-server",
    commands: {
      deploy: "rsync -rRt --info=progress2 ./ [account]@ssh-[account].alwaysdata.net:www/my-app"
    }
  },
  {
    name: "alwaysdata",
    url: import.meta.url
  }
);
export default [alwaysdata];
