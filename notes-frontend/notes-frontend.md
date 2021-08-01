Use below to init the react frontend project from the root, tool likes root dir to be empty, maybe create a node_modules folder in the root dir first and tell dropbox not to sync:
  npx create-react-app .

Deleted several files from the default react app that was created. See Video 11.

To run, from root dir:
  npm start

If it works, shut down and then install react-router-dom:
  npm install react-router-dom

Got these errors:
  16 vulnerabilities (15 moderate, 1 high)

To address issues that do not require attention, run:
  npm audit fix

Ran npm audit fix but did not seem to work.

To start app run:
  npm start
Should start a dev server and index.html will run in a browser
Initial url is localhost:3000 which will redirect to /auth

Entry point for app is index.html -> index.js -> app.js