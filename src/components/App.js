import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link , withRouter } from 'react-router-dom';

import '../static/css/style.css';
import logo from '../static/img/index.svg';
import { loading, loaded } from './../actions/authActions';
import axios from 'axios';
import PostFeed from './feed/PostFeed';
import FeedImg from '../static/img/no-feeds.png';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: {}
    }
    this.fetchPosts = this.fetchPosts.bind(this);
  }

  componentDidMount() {
    this.fetchPosts();
  }

  fetchPosts() {
    axios.get('https://cruzz.herokuapp.com/api/post/feed/?&limit=100&offset=0/')
    .then(res => {
      this.setState({
        posts: res.data.posts.reverse()
      });
      console.log(res.data.posts)
    }).catch(err => {
      console.log(err.response);
    });
  }

  render() {
    let spinner;

    if (!this.props.auth.loading) {
      spinner = null;
    } else {
      spinner = (
        <img src={logo} width="100px" className="loading uk-align-center" alt="#" />
      );
    }
    return (
      <div className="App">
        <div className="uk-align-center uk-height-1-1 uk-width-1-1">
          {spinner}
        </div>
        <div data-uk-grid="true">
          <div className="uk-width-4-5@m uk-align-center">
          {
            this.state.posts.length > 0 ? (
              <div>
                {this.state.posts.map((post, key) => {
                  return (
                    <div key={key} data-uk-scrollspy="cls: uk-animation-slide-bottom-medium; target: > div; delay: 40;">
                      <PostFeed post={post} full={false}/>
                    </div>
                  )
                })}
              </div>
            ):(
              <div>
                <div>
                  <img alt="#" className="uk-align-center" src={spinner}></img>
                </div>
              </div>
            )
          }
          </div>
        </div>
        {
          !this.props.auth.loading && this.state.posts.length === 0? (
            <div className="uk-align-center uk-text-center">
              <h2 className="uk-text-center">
                You don't have any posts in your feed, yet.
              </h2>
              <img src={FeedImg} alt="No Feed Img" width="200px" height="200px" />
              <h2 className="uk-text-center">
                Start Creating One
              </h2>
              <Link className="ov-color-black" to="/new/post" data-uk-icon="icon: plus; ratio: 1.2" data-uk-tooltip="title: Create a new post; pos: bottom-center"></Link>
            </div>
          ): null
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {loading, loaded})(withRouter(App));
