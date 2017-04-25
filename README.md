# RDX Prototype
This is the React prototype of RDX.
The original Surface Book prototype is located in a branch called modular-merge-sb.
## Usage
###Installation and running the demo app.
```
npm install
npm start
```

###Testing
This project uses Enzyme and Jest for JS unit testing.
```
npm run test
```

###Component Library
Run React Storybook to test individual Components. This is intended to provide a rough overview of what components are in use,
components should still be tested in the full app after any updates are made.
```
npm run storybook
```

##Building
Note: The build folder will only run in the RDX app (but you can test it in chrome).
Build unminified dev version with images
```
npm run build-dev
```

Build Production version (minified without images)
```
npm run build-prod
```

Go to localhost://9080 to see the page.