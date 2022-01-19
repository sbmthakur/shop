import React, { useEffect, useState } from "react";
import { Router } from "@reach/router";

import Posts from './components/posts'
import AddPost from "./components/addpost";

const WORKERS_URL = process.env.REACT_APP_WORKERS_URL

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const resp = await fetch(
        `${WORKERS_URL}/items` // eslint-disable-line
      );
      const postsResp = await resp.json()
      return postsResp
    };

    getPosts().then(somePosts => setPosts(somePosts))
  }, []);

  const addNewPost = (post) => {
    posts.unshift(post)
    setPosts(posts.map(p => p))
  }

  const updatePostWorkers = async post => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(post)
    };
    try {
      await fetch(`${WORKERS_URL}/additem`, requestOptions)// eslint-disable-line
        .then(response => response.json())
    } catch (err) {
      alert('Invalid response while adding. Please check the console');
      let errorMessage = err && err.message ? err.message : err;
      console.error(errorMessage);
    }
  }

  const deletePost = async (postId) => {
    //let post = posts.find(p => p.id === postId)
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: JSON.stringify({
        id: postId
      })
    };
    try {
      await fetch(`${WORKERS_URL}/deleteitem`, requestOptions)// eslint-disable-line
        .then(response => response.text())
    } catch (err) {
      alert('Invalid response while adding. Please check the console');
      let errorMessage = err && err.message ? err.message : err;
      console.error(errorMessage);
    }
    setPosts(posts.filter(p => p.id !== postId))
  }

  const updatePost = async modifiedPost => {
    await updatePostWorkers(modifiedPost)
    //let post = posts.find(p => p.id === modifiedPost.id)
    setPosts(posts.map(p => p.id === modifiedPost.id ? modifiedPost : p))
  }

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      backgroundColor: 'wheat'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        marginLeft: 0,
        marginRight: 'auto'
      }}>
        <h1
          style={{ margin: '0 auto' }}
        > Add Item</h1>
        <AddPost posts={posts} addNewPost={addNewPost} />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        //alignItems: 'flex-end'
        marginLeft: 'auto',
        marginRight: 0,
        marginTop: 0
      }}>
        <Router>
          <Posts path="/" posts={posts} updatePost={updatePost} deletePost={deletePost} />
        </Router>
      </div>
    </div>
  );
}

export default App;
