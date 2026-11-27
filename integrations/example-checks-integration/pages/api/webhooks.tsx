import { NextApiRequest, NextApiResponse } from "next";

const TOKEN = process.env.OAUTH_TOKEN;

const getChecks = (req: NextApiRequest) => {
  return fetch(
    `https://api.vercel.com/v1/deployments/${req.body.payload.deployment.id}/checks`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      method: "get",
    }
  ).then((r) => r.json());
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    switch (req.body.type) {
      case "deployment.created":
        // 1 - Register checks
        const check = await fetch(
          `https://api.vercel.com/v1/deployments/${req.body.payload.deployment.id}/checks`,
          {
            body: JSON.stringify({
              blocking: true,
              name: "Fake Check",
            }),
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "post",
          }
        ).then((r) => r.json()); 
        console.log({
          deploymentId: req.body.payload.deployment.id,
          webhookType: req.body.type,
          payload: check,
        });
        break;
      case "deployment.ready":
        // 2 - Run checks (i.e. ping deployment url)
        await fetch(`https://${req.body.payload.deployment.url}`).then((r) =>
          r.text()
        );

        // 3 - Update checks
        const data = await getChecks(req);
        const result = await fetch(
          `https://api.vercel.com/v1/deployments/${req.body.payload.deployment.id}/checks/${data.checks[0].id}`,
          {
            body: JSON.stringify({
              conclusion: "succeeded",
              status: "completed",
            }),
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
            method: "patch",
          }
        ).then((r) => r.json());

        console.log({
          deploymentId: req.body.payload.deployment.id,
          webhookType: req.body.type,
          payload: {
            checks: data.checks,
            updateCheck: result,
          },
        });
        break;
      case "deployment.succeeded":
        // 3 - Deployment completed, checks succeeded/skipped/failed(non-blocking)
        console.log({
          deploymentId: req.body.payload.deployment.id,
          webhookType: req.body.type,
          payload: {
            checks: (await getChecks(req)).checks,
          },
        });
        break;
      case "deployment.error": {
         // 4 - I.e. Re-run the check on error 
        const data = await getChecks(req);
        const result = await fetch(
          `https://api.vercel.com/v1/deployments/${req.body.payload.deployment.id}/checks/${data.checks[0].id}/rerequest`,
          { 
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              "Content-Type": "application/json",
            },
              method: "post",
          }
        ).then((r) => r.json());
        console.log(result)
        break;
      }

      case "deployment.check-rerequested": {
        // 5 - Check re-requested 
         console.log(req.body);
        break;
      }
      case "deployment.canceled":{
        // 6 - Deployment canceled
         console.log(req.body);
      }
      default:
        console.log(req.body);
    }
  } catch (e) {
    console.log(e);
  }
  res.json({ done: true });
};
