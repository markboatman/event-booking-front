This is a CREATE REACT APP.
The production build is running on firebase hosting at: https://event-booking-frontend.web.app

This app needs a graphql backend API. The URL of this api needs to be defined in the .env as REACT_APP_BACKEND_URL='https://someURL'. The code for the backend is in the sibling folder at event-booking-back. You can connect to a locally running backend or there is one running on heroku. But, need to set REACT_APP_BACKEND_URL accordingly.

this is a temp line to not track

To RUN LOCALLY look at the package.json file for scripts or do this:
npm start.

The app will get events from the backend api defined by REACT_APP_BACKEND_URL in the .env file.

STEPS TO BUILD A CREATE-REACT-APP (THIS APP):
Create a root directory for the project.
Go in the project dir and create a node_modules folder in the root dir and tell dropbox not to sync:

Use below to init the react frontend project from the root, tool likes root dir to be empty,
npx create-react-app .

This will populate the project dir with a template project and populate the node_modules folder with dependancy modules.

At this point could update all node_modules by doing ncu -u. i.e nodemodules check for updates with the -u flag. This will check for newer versions of modules listed as dependencies in the package.json file and update the dependency references in the package.json file. So ....
ncu -u -> followed by:
npm install

Deleted several files from the default react app that was created. See Video 11.

src/App.test.js
App.css -> cleared contents
index.css -> got rid text style
logo.svg -> changed name, not using
Deleted reference to logo in app.js
App.js - removed all html between "App" divs
index.js -> removed serviceWorker

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

To make a production build do this:
yarn build

This will create a build dir in your project with your code.
You need to exec it with a static? server, so do this to install globally:
npm install -g server
OR
yarn global add serve

Then exec from project folder that contains ./build:
serve -s build
