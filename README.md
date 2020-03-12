# Spotifynd Friends

## Github Actions
### Documentation
Our Github Actions currently run unit tests on various buttons on our app, as well as functional tests for all the functions of our app, including getting user information, getting topPlaylist information, getting playlist information, and comparing playlists.
### Trigger
on : push
## Project Summary
### Elevator Pitch  
This webapp analyzes Spotify playlists and measures their compatability which can then be used to make friends and find people to go to concerts with.

### Additional Information  
Description: Oftentimes, as young people, we find it difficult to share our music with our friends--people always seem more inclined to suggest than receive suggestions. As a result, it is hard to know who has the same music tastes as us and even harder to find people interested in going to the same concerts as us. With Spotifynd Friends, you can easily match with other users who like the same music! After connecting to your Spotify account, simply choose a playlist and our app will find other users who have the same tastes. Connect with users to find friends, concert carpool buddies, and new music!

Target Audience: Young adults who are Spotify users

Main Functionality: User can compare their playlists with other users' playlists to see how similar their music tastes are. 

## Installation
### Prerequisites
node.js: v13.6.0

Firefox or Chrome

### Dependencies  
next.js: framework for using react and node.js, specializes in server-side rendering

querystring: string formatter, convert objects into strings

react: library for building user interface

react-dom: library, allows for manipulation of the DOM

react-bootstrap: front-end framework, built for react

react-spinner: allows for a loading component

request: simplifies http call process

firebase: mobile application, development platform

firebase-admin: allows for read and write to realtime database

axios: allows for HTTP requests

@babel/runtime:

@emotion/core:

bootstrap:

chart.js: allows 

chartjs-plugin-labels:


### Installation Steps

#### Run Locally
1. clone our repo using `git clone https://github.com/ucsb-cs48-w20/Spotify.git`
2. run `npm install` command to install necessary dependencies
3. use `npm run dev` command to run our app

#### Browser
Go to https://spotifynd-friends.herokuapp.com/

## Functionality
1. Click the 'Log in' button on the home page
2. When redirected, log in to your Spotify account
3. After redirected back to our app, click the 'Enter' button
4. Select the playlist you would like to compare with other user's top playlist in the same location as you
5. The compatability score you have in common with every user in your location is now displayed 
6. Click on the user in order to check out their social media and top playlist

## Known Problems
None at the moment.

## Contributing
1. Fork it!  
2. Create your feature branch: git checkout -b my-new-feature  
3. Commit your changes: git commit -am 'Add some feature'  
4. Push to the branch: git push origin my-new-feature  
5. Submit a pull request :D  

## License
MIT License

