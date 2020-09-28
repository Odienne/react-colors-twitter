import React from "react";
import io from 'socket.io-client';
import Lodash from 'Lodash';
import classes from "./twitter.css";
import {getPrimaryColor} from './getColor.js';
import {getSecondaryColor} from './getColor.js';
// import {Bar} from 'react-chartjs-2';
// import {Line, Circle} from 'rc-progress';


import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPowerOff} from '@fortawesome/free-solid-svg-icons'
import {faChartBar} from '@fortawesome/free-solid-svg-icons'
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import {faClock} from '@fortawesome/free-solid-svg-icons'
import {faMousePointer} from '@fortawesome/free-solid-svg-icons'


library.add(faPowerOff);
library.add(faPlus);
library.add(faClock);
library.add(faMousePointer);
library.add(faChartBar);



export class Twitter extends React.Component {
    constructor(props) {
        super(props);

        // this.socket = io('http://10.136.9.164:3001');
        this.socket = io('http://localhost:3000');

        this.socket.on('tweet', this.onNewTweet);

        const colors = localStorage.getItem("colors") ? JSON.parse(localStorage.getItem("colors")) : [];

        this.state = {
            tweets: [],
            clickedTweet: null,
            colors,
            searchTag: null
        };
    }

    onNewTweet = (data) => {
        let {tweets} = this.state;

        data.size = this.defineSize(data);
        data.posY = Math.random() * (100) + "%";
        data.posX = Math.random() * (100) + "%";
        tweets = [...tweets, data];

        this.setState(
            {
                tweets
            }
        );

        this.goodbyeTweet(data);
    };

    defineSize = (data) => {
        if (!data.retweeted_status) {
            return 10;
        }

        if (data.retweeted_status.retweet_count > 25) {
            return 25;
        }

        return 10 + data.retweeted_status.retweet_count;
    };

    goodbyeTweet = (tweet) => {
        setTimeout(() => {
            let {tweets} = this.state;
            tweets = tweets.map(elem => ({
                ...elem,
                hide: elem.id === tweet.id ? true : elem.hide
            }));

            this.setState(
                {
                    tweets
                }
            );
        }, 20000);
    };

    getHashtagsList = () => {
        const {tweets} = this.state;
        let tags = [];
        tweets.filter(tweet => tweet.entities.hashtags.length > 0).map(tweet => {
            tweet.entities.hashtags.map(elem => {
                if (!tags.find(tag => tag.toLowerCase() === elem.text.toLowerCase())) {
                    tags = [...tags, elem.text];
                }
            })
        });

        return tags;
    };

    componentWillUnmount() {
        this.socket.disconnect();
    }

    showTweet = (tweet) => {
        this.setState(
            {
                clickedTweet: tweet
            }
        );
    };

    hasHashtag = (tagsArray, tag) => {
        for (let i = 0; i < tagsArray.length; i++) {
            if (tagsArray[i].text.toLowerCase() === tag.toLowerCase()) return true
        }
        return false;
    };

    onChangeSelect = (event) => {
        this.setState({searchTag: event.target.value});
    };

    getRandomColor = () => {
        const {colors} = this.state;

        if (colors.length === 0) {
            return "#c4ff79"
        }

        let key = Math.floor(Math.random() * colors.length);
        return colors[key].hex.value;
    };

    calculPercentage = (array, arrayTotal) => {
        return array.length > 0 ? (array.length / arrayTotal.length * 100).toFixed(2) : 0;
    };

    render() {
        let {tweets, clickedTweet, searchTag} = this.state;

        if (searchTag) {
            tweets = tweets.filter(tweet => tweet.entities.hashtags.length > 0)
                .filter(tweet => this.hasHashtag(tweet.entities.hashtags, searchTag));
        }

        const listTweets = tweets.filter(elem => !elem.hide).map((tweet) => {

            return (
                <circle key={tweet.id_str} cy={tweet.posX} cx={tweet.posY} r={tweet.size}
                        fill={"#" + tweet.user.profile_background_color}
                        onClick={() => this.showTweet(tweet)}/>
            );
        });

        let retweeted = tweets.filter(elem => elem.retweeted_status);
        let withHashtag = tweets.filter(elem => elem.entities.hashtags.length > 0);
        let withLink = tweets.filter(elem => elem.entities.urls.length > 0);
        let withMentionUser = tweets.filter(elem => elem.entities.user_mentions.length > 0);

        let maxRetweeted = _.maxBy(retweeted, (tweet) => {
            return tweet.retweeted_status.retweet_count;
        });

        /*const data = {
            labels: ['January', 'avec #', 'avec liens', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Stats',
                    backgroundColor: 'rgb(50,99,132)',
                    borderColor: 'rgb(50,50,10)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [0, withHashtag.length, withLink.length, 0, 0, 0, 0]
                }
            ]
        };*/

        let latestTweet = tweets ? tweets[tweets.length - 1] : null;
        let latestTweetTags = (latestTweet && latestTweet.entities.hashtags.length > 0) ? latestTweet.entities.hashtags.map(elem => (
            <a href={`https://twitter.com/hashtag/${elem.text}?src=hash`} target="_blank" className={classes.hashtag}>#{elem.text}</a>)) : null;
        let maxRetweetedTags = (maxRetweeted && maxRetweeted.entities.hashtags.length > 0) ? maxRetweeted.entities.hashtags.map(elem => (
            <a href={`https://twitter.com/hashtag/${elem.text}?src=hash`} target="_blank" className={classes.hashtag}>#{elem.text}</a>)) : null;
        let clickedTweetTags = (clickedTweet && clickedTweet.entities.hashtags.length > 0) ? clickedTweet.entities.hashtags.map(elem => (
            <a href={`https://twitter.com/hashtag/${elem.text}?src=hash`} target="_blank" className={classes.hashtag}>#{elem.text}</a>)) : null;

        let tagList = this.getHashtagsList();
        let optionsList = tagList.map(elem => {
            return (
                <option value={elem} key={elem}>
                    {elem}
                </option>
            )
        });

        return (

            <div className={classes.twitter}>
                <div className={classes.twitterLeftSide} style={{backgroundColor: getPrimaryColor()}}>
                    <div>
                        {latestTweet &&
                        <div>
                            <h4><FontAwesomeIcon icon="clock"/> Latest tweet : </h4>
                            <div className={classes.tweetHighlight}>
                                <div className={classes.userInfos}>
                                    <img src={latestTweet.user.profile_image_url} className={classes.profileImg}/>
                                    <p>{latestTweet.user.name}</p>
                                </div>
                                <div className={classes.tweetMsg}>
                                    <p>{latestTweet.text}</p>
                                </div>
                                <div className={classes.tweetTags}>
                                    {latestTweetTags}
                                </div>
                            </div>
                        </div>
                        }

                        {maxRetweeted &&
                        <div>
                            <h4><FontAwesomeIcon icon="plus"/> Most retweeted : </h4>
                            <div className={classes.tweetHighlight}>
                                <div className={classes.userInfos}>
                                    <img src={maxRetweeted.user.profile_image_url} className={classes.profileImg}/>
                                    <p>{maxRetweeted.user.name}</p>
                                </div>
                                <div className={classes.tweetMsg}>
                                    <p>{maxRetweeted.text}</p>
                                </div>
                                <div className={classes.tweetTags}>
                                </div>
                                <div className={classes.tweetTags}>
                                    {maxRetweetedTags}
                                </div>
                            </div>
                        </div>
                        }

                        {clickedTweet &&
                        <div>
                            <h4><FontAwesomeIcon icon="mouse-pointer"/> Clicked tweet : </h4>
                            <div className={classes.tweetHighlight}>
                                <div className={classes.userInfos}>
                                    <img src={clickedTweet.user.profile_image_url} className={classes.profileImg}/>
                                    <p>{clickedTweet.user.name}</p>
                                </div>
                                <div className={classes.tweetMsg}>
                                    <p>{clickedTweet.text}</p>
                                </div>
                                <div className={classes.tweetTags}>
                                </div>
                                <div className={classes.tweetTags}>
                                    {clickedTweetTags}
                                </div>
                            </div>
                        </div>
                        }
                    </div>

                    <div>
                        <h2><FontAwesomeIcon icon="chart-bar"/> Statistiques</h2>
                        <div className={classes.filtreTags}>
                            <label>Filtrer selon un hashtag</label>
                            <select onChange={this.onChangeSelect}>
                                <option value="">Tous</option>
                                {optionsList}
                            </select>
                            <span title={"Annuler le filtre"}
                                  className={`${classes.roundButton} ${classes.resetFiltre}`}
                                  onClick={() => this.setState({searchTag: null})}>
                                    <FontAwesomeIcon icon="power-off"/>
                                </span>
                        </div>

                        <div>
                            <div className={classes.totalTweets}>
                                <span style={{background: getSecondaryColor()}} className={classes.statBubble}>{tweets.length}</span>
                                <p>Tweets</p>
                            </div>
                            <div className={classes.statsGraph}>
                                <ul className={classes.statList}>
                                    <li>
                                        <span style={{background: getSecondaryColor()}} className={classes.littleStatBubble}>{retweeted.length}</span>
                                        <p>retweetés</p>
                                    </li>
                                    <li>
                                        <span style={{background: getSecondaryColor()}} className={classes.littleStatBubble}>{withHashtag.length}</span>
                                        <p>avec des #</p>
                                    </li>
                                    <li>
                                        <span style={{background: getSecondaryColor()}} className={classes.littleStatBubble}>{withLink.length}</span>
                                        <p>avec des liens</p>
                                    </li>
                                    <li>
                                        <span style={{background: getSecondaryColor()}} className={classes.littleStatBubble}>{withMentionUser.length}</span>
                                        <p>avec mentions d'utilisateurs</p>

                                    </li>
                                </ul>
                                <ul className={`${classes.statList} ${classes.graphsList}`}>
                                    <li>
                                        <div className={classes.progressBar}>
                                            <p style={{
                                                width: this.calculPercentage(retweeted, tweets) + "%",
                                                backgroundColor: getSecondaryColor(),
                                                fontSize: "0.6em"
                                            }}
                                               className={classes.filledBar}>  {this.calculPercentage(retweeted, tweets)} %
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={classes.progressBar}>
                                            <p style={{
                                                width: this.calculPercentage(withHashtag, tweets) + "%",
                                                backgroundColor: getSecondaryColor(),
                                                fontSize: "0.6em"
                                            }}
                                               className={classes.filledBar}>  {this.calculPercentage(withHashtag, tweets)} %
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={classes.progressBar}>
                                            <p style={{
                                                width: this.calculPercentage(withLink, tweets) + "%",
                                                backgroundColor: getSecondaryColor(),
                                                fontSize: "0.6em"
                                            }}
                                               className={classes.filledBar}>  {this.calculPercentage(withLink, tweets)} %
                                            </p>
                                        </div>
                                    </li>
                                    <li>
                                        <div className={classes.progressBar}>
                                            <p style={{
                                                width: this.calculPercentage(withMentionUser, tweets) + "%",
                                                backgroundColor: getSecondaryColor(),
                                                fontSize: "0.6em"
                                            }}
                                               className={classes.filledBar}>  {this.calculPercentage(withMentionUser, tweets)} %
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>


                        {/*<div style={{width: "150px"}}>
                            <Line percent={withLink.length / tweets.length * 100} strokeWidth="3" trailWidth={3}
                                  strokeColor={getSecondaryColor()}/>
                        </div>
                        <div style={{width: "150px"}}>
                            <Circle percent={withMentionUser.length / tweets.length * 100} strokeWidth="3"
                                    trailWidth={3}
                                    strokeColor={getSecondaryColor()}/>
                        </div>*/}
                        {/*<Bar style="width: 500px; height: 10vh"
                            data={data}
                            options={{ maintainAspectRatio: false}}
                        />*/}
                    </div>
                </div>
                <div className={classes.twitterRightSide}>
                    <svg style={{width: "100%", height: "100%"}}>
                        {listTweets}
                    </svg>
                </div>
            </div>)
            ;
    }
}