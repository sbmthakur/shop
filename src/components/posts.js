import React from "react";
import FeedPost from './feedpost'
import 'emoji-mart/css/emoji-mart.css'

const Posts = (props) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'start',
      alignItems: 'start',
      margin: '0 auto'
    }}>
      {props.posts.map(post => (
        <FeedPost key={post.id} {...props} post={post} />
      ))}
    </div>
  );
};

export default Posts;
