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

## Changes
I started to play around with this project after noticing that i have been using it actively for the last 4 months. These are the changes i have made so far.

### 1.1.0
- Added navigation.(Left/Right arrow or Page buttons at the bottom of the page)
- Clear history button refreshes the options page after clearing the story history.
- Organized codebase, converted to es2015, started using npm, webpack, react.

### 1.0.0
- Simple functionality with single page ui.
