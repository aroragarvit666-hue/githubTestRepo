# githubTestRepo — Hello World (Adobe App Builder)

A minimal Adobe App Builder app: one authenticated web action (`hello`) and an
ExC Shell React Spectrum UI that calls it.

## Structure

```
app.config.yaml              # standalone app manifest (actions under application.runtimeManifest)
actions/hello/index.js       # web action — returns { message: "Hello, <name>!" }
web-src/index.html           # SPA entry (loads src/index.js)
web-src/src/index.js         # ExC Shell bootstrap
web-src/src/exc-runtime.js   # official ExC Shell runtime loader
web-src/src/config.json      # action URLs — filled by `aio app deploy` / preview
web-src/src/components/App.js # React Spectrum UI
test/hello.test.js           # action tests (200 / 500)
```

## Develop

```bash
npm install
aio app use          # select org / project / workspace
aio app run          # local dev with the UI
aio app deploy       # build + deploy to Adobe I/O Runtime
npm test             # run action tests
```

The `hello` action has `require-adobe-auth: true`, so ExC Shell injects the IMS
token automatically; the UI forwards it as `Authorization: Bearer <token>`.
