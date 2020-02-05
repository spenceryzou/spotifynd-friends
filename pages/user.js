import React, { Component } from 'react'
import Router from 'next/router'

var querystring = require('querystring');

var client_id = '2923d79235804ea58633989710346f3d'; // Your client id
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc'; // Your secret
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email';

class User extends Component {
    constructor(props) {
        super(props);
        
    }

    // routeToSearchArtists = (event) => {
    //     event.preventDefault()
    //     const { access_token } = this.props.url.query
    //     Router.push({
    //         pathname: '/search-artists',
    //         query: { access_token }
    //     })
    // }

    generateRandomString = (length) => {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

    makeSpotifyProfileCall = (event) => {
        event.preventDefault()
        const { access_token } = this.state
        if(access_token===''){
            window.location = 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
              response_type: 'code',
              client_id: client_id,
              scope: scope,
              redirect_uri: redirect_uri,
              state: this.generateRandomString(16)
            });
        }else{
            Router.push({
                pathname: '/user',
                query: { access_token }
            })
        }  
    }

    renderPlaylist = () => {
        if(this.props.playlist){
            let allPlayLists = []
            const { playlist } = this.props
            playlist.forEach((list, index) => {
                allPlayLists.push(
                    <Results
                        name={list.name}
                        imageURL={list.images[0].url}
                    >
                    </Results>
                )
            })
            return allPlayLists
        }else{
            return ''
        }
    }
    
    render(){        
        const { user, playlist } = this.props
        console.log('playlist', playlist)
        return(
            <Layout>
                <div className="row mt-5 justify-content-center">
                    <h3>Welcome {user.display_name.split(" ")[0]}!</h3>
                </div>
                <div className="row mt-2 justify-content-center">
                    <img src={user.images[0].url} className="img-responsive" />
                </div>
                <div className="mt-4 justify-content-center">
                    <p className="text-center">username: {user.display_name}</p>
                    <p className="text-center">email: {user.email}</p>
                    <p className="text-center">follower count: {user.followers.total}</p>
                </div>
                <div className="row mt-5 justify-content-center">
                    <button 
                        className="btn btn-success" 
                        onClick={event => this.routeToSearchArtists(event)}
                    >
                        Search Artists
                    </button>
                </div>
                <div className="row mt-5 justify-content-center">
                    <h5>My Playlists</h5>
                </div>
                <div className="row mt-2">
                    { this.renderPlaylist() }
                </div>
            </Layout>
        )
    }
}

User.getInitialProps = async function(context) {
    const { access_token } = context.query
    const res = await fetch('https://api.spotify.com/v1/me?access_token='+access_token)
    const user = await res.json()
    const res2 = await fetch('https://api.spotify.com/v1/me?access_token='+access_token)
    const playlist = await res2.json()
    return { 
        user, 
        playlist: playlist.items 
    }
}

export default User