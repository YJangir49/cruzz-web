import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import { loading, loaded } from './../../actions/authActions';

class PostFeed extends Component {
  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      shares: 0,
      post: {
        author: {},
        tagList: []
      }
    };
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.favoritePost = this.favoritePost.bind(this);
    this.share = this.share.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.handleDateTime = this.handleDateTime.bind(this);
  }

  dangerous(html) {
    return {
      __html: html
    }
  }
  upVote(e) {
    this.props.loading();
    const URI = 'https://cruzz.herokuapp.com/api/post/' + this.state.post.slug + '/upvote/';
    if(this.state.post.upvoted) {
      axios.delete(URI).then(res => {
        this.setState({
          post: res.data.post
        });
        this.props.loaded();
      }).catch(err => {
        console.log(err.response);
        this.props.loaded();
      });
    } else {
      axios.get(URI).then(res => {
        console.log(res.data);
        this.setState({
          post: res.data.post
        });
        if(this.state.post.downvoted) {
          this.downVote();
        }
      }).catch(err => {
        console.log(err.response);
      });
      this.props.loaded();
    }
  }

  downVote(e) {
    const URI = 'https://cruzz.herokuapp.com/api/post/' + this.state.post.slug + '/downvote/';
    if(this.state.post.downvoted) {
      axios.delete(URI).then(res => {
        this.setState({
          post: res.data.post
        });
        this.props.loaded();
      }).catch(err => {
        console.log(err.response);
        this.props.loaded();
      });
    } else {
      axios.get(URI).then(res => {
        this.setState({
          post: res.data.post
        });
        if(this.state.post.upvoted) {
          this.upVote();
        }
      }).catch(err => {
        console.log(err.response);
      });
    }
  }

  favoritePost(e) {
    const URI = 'https://cruzz.herokuapp.com/api/post/' + this.state.post.slug + '/favorite/';
    if(this.state.post.favorited) {
      axios.delete(URI).then(res => {
        this.setState({
          post: res.data.post
        });
      }).catch(err => {
        console.log(err.response);
      });
    } else {
      axios.get(URI).then(res => {
        console.log(res.data);
        this.setState({
          post: res.data.post
        });
      }).catch(err => {
        console.log(err.response);
      });
    }
  }

  share(e) {
    // console.log(e);
    let shares = this.state.shares;
    this.setState({ shares: shares + 1});
  }

  componentDidMount() {
    this.setState({
      post: this.props.post
    });
  }

  deletePost() {
    const URI = 'https://cruzz.herokuapp.com/api/post/' + this.state.post.slug + '/delete/'
    axios.get(URI).then(res => {
      console.log(res.data);
      this.props.history.push('/');
    }).catch(err => {
      console.log(err.response);
    })
  }

  handleDateTime(date) {
    const dateLocal = new Date(date);
    let mnth = ("0" + (dateLocal.getMonth()+1)).slice(-2);
    let day  = ("0" + dateLocal.getDate()).slice(-2);
    const dateLocalFormatted = [dateLocal.getFullYear(), mnth, day ].join("-");
    const todayDate = new Date();
    mnth = ("0" + (todayDate.getMonth()+1)).slice(-2);
    day  = ("0" + todayDate.getDate()).slice(-2);
    const todayDateFormatted = [todayDate.getFullYear(), mnth, day ].join("-");
    const timeLocal = dateLocal.toLocaleTimeString();
    if(dateLocalFormatted=== todayDateFormatted)
    {
        return (timeLocal);
    }
    else{
      return (String(dateLocal.toDateString().slice(3)));
    }
  }



  render() {
    return (
      <div className="uk-container uk-padding-small uk-width-1-1">

        <div className="uk-card uk-card-default uk-align-center uk-width-1-1@m uk-box-shadow-hover-medium uk-box-shadow-small">

          <div className="uk-card-header">
            <div className="uk-grid-small uk-width-auto uk-margin-remove-bottom uk-flex-inline uk-align-left" data-uk-grid="true">
              <div className="uk-width-auto">
                <img className="uk-border-circle ov-post-author-img" alt="" src={this.state.post.author.image}/>
              </div>
              <div className="uk-width-expand">
                <h4 className="uk-margin-remove-bottom">
                  <Link aria-label="View post" className="uk-link-heading uk-text-top" to={"/view/post/" + this.state.post.slug}>
                    {this.state.post.title}
                  </Link>
                </h4>
                <p className="uk-margin-remove-top uk-text-small uk-text-top">
                  <Link aria-label={this.state.post.author.username + "'s profile"} className="uk-link-text uk-text-primary" to={
                    this.state.post.author.username !== this.props.auth.user.username ? ("/user/" + this.state.post.author.username)
                    : ("/profile/" + this.state.post.author.username)
                  }>{this.state.post.author.first_name}</Link>
                  &nbsp;
                  posted on
                  &nbsp;
                  <time className="uk-text-meta" dateTime={this.state.post.createdAt}>{this.handleDateTime(this.state.post.createdAt)}</time>
                </p>
              </div>
            </div>
            <div className="uk-flex-inline uk-align-right@s uk-margin-remove-top">
              {this.state.post.tagList.map(
                (tag, key) => {
                  return(
                    <label className="uk-badge uk-label-success ov-post-tag uk-padding-small ov-padding-remove uk-margin-small-left uk-margin-remove-top uk-animation-scale-up" key={key}>
                      <Link aria-label={"Posts tagged with " + tag} className="uk-link uk-link-reset" to={"/posts/bytag/" + tag}>
                        {tag}
                      </Link>
                    </label>
                  )
                }
              )}
            </div>
          </div>

          <div className="uk-card-body">
            <div className="uk-margin-small-top" dangerouslySetInnerHTML={this.dangerous(this.state.post.body)}></div>
          </div>

          <div className="uk-card-footer">

            <div className="uk-flex-inline">

              <div>
                <Link to="#" aria-label="Upvote" className={this.state.post.upvoted ? ("uk-icon-button uk-button-primary uk-animation-scale-down"): ("uk-icon-button uk-button-default")} onClick={this.upVote} data-uk-icon="arrow-up" data-uk-tooltip="title: upvote; pos: bottom-center"></Link>
                <span className="uk-badge uk-label-success">{this.state.post.upvotesCount}</span>
              </div>

              <div className="uk-margin-small-left">
                <Link to="#" aria-label="Downvote" className={this.state.post.downvoted ? ("uk-icon-button uk-button-primary uk-animation-scale-down"): ("uk-icon-button uk-button-default")} onClick={this.downVote} data-uk-icon="arrow-down" data-uk-tooltip="title: downvote; pos: bottom-center"></Link>
                <span className="uk-badge uk-label-danger">{this.state.post.downvotesCount}</span>
              </div>

              <div className="uk-margin-small-left">
                <Link to="#" aria-label="Add to favourites"  className={this.state.post.favorited ? ("uk-icon-button uk-button-danger uk-animation-scale-down"): ("uk-icon-button uk-button-default")} onClick={this.favoritePost} data-uk-icon="heart" data-uk-tooltip="title: add to favorites; pos: bottom-center"></Link>
                <span className="uk-badge uk-label-danger">{this.state.post.favoritesCount}</span>
              </div>

              <div className="uk-margin-small-left">
                {
                  this.props.full ?
                  (
                    <Link to="#" aria-label="Comment" className="uk-icon-button uk-button-default" data-uk-icon="comments" data-uk-tooltip="title: comments; pos: bottom-center"></Link>
                  ): (
                    <Link to={'/view/post/' + this.state.post.slug} aria-label="Comment" className="uk-icon-button uk-button-default" data-uk-icon="comments" data-uk-tooltip="title: comment; pos: bottom-center"></Link>
                  )
                }
                <span className="uk-badge">{this.state.post.commentsCount}</span>
              </div>

            </div>
            <div className="uk-flex-inline uk-align-right@s">
              {
                this.props.auth.user.username === this.state.post.author.username ?
                (
                  <div className="uk-margin-small-left">
                    <Link aria-label="Edit Post" to={'/edit/post/' + this.state.post.slug} className="uk-icon-button uk-button-secondary uk-animation-scale-down" data-uk-icon="file-edit" data-uk-tooltip="title: edit; pos: bottom-center"></Link>
                  </div>
                ):null
              }
              {
                this.props.auth.user.username === this.state.post.author.username ?
                (
                  <div className="uk-margin-small-left">
                    <Link aria-label="Delete Post" to="#" onClick={this.deletePost} className="uk-icon-button uk-button-secondary uk-text-danger  uk-animation-scale-down" data-uk-icon="trash" data-uk-tooltip="title: delete; pos: bottom-center"></Link>
                  </div>
                ):null
              }
            </div>
          </div>

        </div>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});


export default connect(mapStateToProps, {loading, loaded})(withRouter(PostFeed));
