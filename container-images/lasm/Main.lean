/-
A Hono app on Node (@hono/node-server) whose request handlers are Lean
functions, compiled to WebAssembly by Lasm.
  GET  /             {"message": "Hello from Lean on Vercel!"}
  GET  /hello/:name  {"message": "Hello, NAME, from Lean on Vercel!"}
  GET  /limit/:n     {"requested": "n", "limit": clampLimit n} (proved to be in 1..100)
  POST /echo         {"echo": <the JSON request body>}
  GET  /health       {"ok": true}
Listens on $HOST (default 0.0.0.0) and $PORT (default 80, Vercel's container port).
-/
import App
import Lasm.JS
open Lasm.JS

/-- `new Hono()` -/
@[js "hono" "new Hono"] opaque newHono : IO Value
/-- `serve(options, listening)` from @hono/node-server; returns the Node server. -/
@[js "@hono/node-server" "serve"] opaque serve : Data → Value → IO Value

/-- A Hono handler `(c) => Response` written in Lean. -/
def handler (f : Value → Async Function.Reply) : IO Value :=
  Function.ofFnReply fun args => do
    let .ref c _ := args[0]! | throw (IO.userError "expected a Hono context")
    f c

/-- `c.json(body)` -/
def json (c : Value) (body : Data) : Async Function.Reply :=
  return .callMethod c "json" #[body]

def main : IO Unit := do
  let app ← newHono
  let route (method path : String) (f : Value → Async Function.Reply) : IO Unit := do
    let _ : Value ← app.callMethod method #[toJS path, toJS (← handler f)]
  route "get" "/" fun c => json c (obj [("message", toJS "Hello from Lean on Vercel!")])
  route "get" "/hello/:name" fun c => do
    let name ← (← c.get "req").callMethod "param" #[toJS "name"] String
    json c (obj [("message", toJS (App.greet name))])
  route "get" "/limit/:n" fun c => do
    let raw ← (← c.get "req").callMethod "param" #[toJS "n"] String
    let n := raw.toNat?.getD 0
    json c (obj [("requested", toJS raw), ("limit", toJS (App.clampLimit n))])
  route "post" "/echo" fun c => do
    let body ← (← c.get "req").callMethodAwait "json" #[] Data
    json c (obj [("echo", body)])
  route "get" "/health" fun c => json c (obj [("ok", toJS true)])

  let host := (← IO.getEnv "HOST").getD "0.0.0.0"
  let port := ((← IO.getEnv "PORT").bind String.toNat?).getD 80
  let listening ← Function.ofFn fun _ => do
    IO.println s!"Listening on http://{host}:{port} (Hono)"
    (← IO.getStdout).flush
    return .undefined
  let server ← serve (obj [("fetch", toJS (← app.get "fetch")), ("port", toJS port), ("hostname", toJS host)]) listening

  -- Vercel sends SIGTERM before it stops an idle instance: finish open requests, then exit.
  let process ← require "node:process"
  let exit ← Function.ofFn fun _ => do
    let _ : Value ← process.callMethod "exit" #[toJS 0]
    return .undefined
  let stop ← Function.ofFn fun _ => do
    let _ : Value ← server.callMethod "close" #[toJS exit]
    return .undefined
  for signal in ["SIGTERM", "SIGINT"] do
    let _ : Value ← process.callMethod "once" #[toJS signal, toJS stop]
  waitForever
