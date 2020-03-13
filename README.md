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

@babel/runtime: library that contains runtime helpers

@emotion/core: library for css styles with JavaScript

bootstrap: front-end component library

chart.js: library allowing for different type of charts

chartjs-plugin-labels: allows for chart.js to display percentages


### Installation Steps

#### Run Locally
1. clone our repo using `git clone https://github.com/ucsb-cs48-w20/Spotify.git`
2. run `npm install` command to install necessary dependencies
3. use `npm run dev` command to run our app
4. go to http://localhost:3000

#### Browser
Go to https://spotifynd-friends.herokuapp.com/

## Functionality
1. Click the 'Continue With Spotify' button on the home page
2. When redirected, log in to your Spotify account
3. After being redirected back to our app, click the 'Settings' button in the pop up window if it is your first time logging in with our app. Otherwise, you may proceed with step 6.
4. On the Settings page, select your location, top playlist, and enter your Instagram handle. The top playlist is the playlist that will be associated with your profile when other users compare their playlists with you. The Instagram handle will be displayed on your profile page.
5. After your settings are selected, click on "Spotifynd Friends" in the upper left corner.
6. Select one of your playlists in the list on the left to compare it with other users in your area.
7. A list of users will appear sorted by compatibility scores. If you wish to make comparisons with a different playlist, click on the "hamburger" menu button on the left to bring up your list of playlists again and select a different playlist.
8. In the list of users, click on the number on a user's card to view your compatibility summary.
9. Click on a user's name to view their profile.
10. On the user's profile page, you can play their top playlist, go to their Instagram page via the Instagram logo button, and follow them on Spotify via the follow button. 

## Known Problems
Navigating to the settings page via the navbar will sometimes take a while to load without informative feedback that it is loading.
Spotify usernames that contain '.','#','[',']','*','$', will not be able to use our app.

## Contributing
1. Fork it!  
2. Create your feature branch: git checkout -b my-new-feature  
3. Commit your changes: git commit -am 'Add some feature'  
4. Push to the branch: git push origin my-new-feature  
5. Submit a pull request :D  

## License
MIT License

