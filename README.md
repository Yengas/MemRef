MemRef
======
![SS](http://i.imgur.com/BzLUooz.png)

A simple history of the links you clicked on reddit and ycombinator. Made to refresh your memory(hence memref) on things you read up weeks/months ago and forgot about.

## Installing 
- Clone the repo and run `npm install && npm start`.
- Go to your `chrome://extensions` page, click on 'Load unpacked extension' and pick the 'MemRef/build' folder.

## Usage
While browsing reddit or ycombinator; middle click(or ctrl + left click) on the stories to open them in a new tab and save them on MemRef.
If you click on stories with the left mouse button or right click and use to context menu to open up stories in a new tab, MemRef will not save those stories!

You can go to options page of the MemRef addon to see your reddit/ycombinator history.

## Structure
````
.
├── package.json                # Required libraries, meta data and start script
├── README.md                   # This file
├── src                         # Project source code
│   ├── background              # Background script that handles chrome storage
│   │   └── index.js
│   ├── options                 # Options page
│   │   ├── components          # React components
│   │   │   ├── App.css         # CSS file for the options page
│   │   │   ├── App.jsx         # Options page with pagination and other buttons
│   │   │   ├── Link.css        # Story link component
│   │   │   ├── Link.jsx        # Link css file
│   │   │   └── LinkList.jsx    # LinkList that shows a list of Link components
│   │   ├── index.html          # Options page HTML
│   │   └── index.js            # Options page script
│   └── tracker
│       └── index.js            # Tracker script that runs on every reddit/ycombinator tab
├── static
│   ├── externals               # Client side libraries used in ui
│   │   ├── react-dom.min.js
│   │   └── react.min.js
│   ├── icons                   # Icons used in options page
│   │   ├── reddit.ico
│   │   └── ycombinator.ico
│   └── manifest.json           # Chrome extension manifest file
└── webpack.config.js           # Webpack config for building the project
````

## Changes
I started to play around with this project after noticing that i have been using it actively for the last 4 months. These are the changes i have made so far.

### 1.1.0
- Added navigation.(Left/Right arrow or Page buttons at the bottom of the page)
- Clear history button refreshes the options page after clearing the story history.
- Organized codebase, converted to es2015, started using npm, webpack, react.

### 1.0.0
- Simple functionality with single page ui.
