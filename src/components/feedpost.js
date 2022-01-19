import React, { useState } from "react";
//import { Link } from "@reach/router";
import { Button, ButtonGroup, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Name, Description, Count } from './addpost'

const ShowName = (props) => {
  const editEnabled = props.edit
  const name = props.name
  if (editEnabled) {
    return <Name name={name} id={props.id} />
  } else {
    return <Card.Title>{name}</Card.Title>
  }
}

const ShowThumbnail = (props) => {
  const editEnabled = props.edit
  const thumbnail = props.thumbnail_img
  if (editEnabled) {
    //return <Name name={name} id={props.id} />
  } else {
    return <Card.Img style={{
      width: '200px',
      height: '200px',
      margin: '0 auto',
      objectFit: 'cover'
    }}
      variant="top"
      src={thumbnail} />
  }
}

const ShowDescription = (props) => {
  const editEnabled = props.edit
  const description = props.description
  if (editEnabled) {
    return <Description description={description} id={props.id} />
  } else {
    return <Card.Text style={{ borderBottom: '2px solid' }} >
      {description}
    </Card.Text>
  }
}

const ShowCount = (props) => <Count count={props.count} id={props.id} />

const processEdit = async (id, fileData) => {
  let name = document.getElementById(`name-${id}`).value
  let count = document.getElementById(`count-${id}`).value
  let description = document.getElementById(`description-${id}`).value

  let img = fileData ? fileData : ''
  let thumbnail_img = ''

  let modifiedPost = {
    id,
    name,
    count,
    description,
    img,
    thumbnail_img
  }

  return modifiedPost
}

const FeedPost = (props) => {
  let post = props.post

  const [edit, setEdit] = useState(false)

  return (
    <Card key={post.id} style={{ width: '18rem', margin: '0 5%', backgroundColor: 'whitesmoke' }} >
      <ShowThumbnail edit={edit} thumbnail_img={post.thumbnail_img} />
      <Card.Body>
        <ShowName edit={edit} name={post.name} id={post.id} />
        <ShowDescription edit={edit} description={post.description} id={post.id} />
        {edit && <ShowCount count={post.count} id={post.id} />}

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
        >
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id={`tooltip-top`}> Click to Delete</Tooltip>
            }
          >
            <Button style={{}}
              variant='danger'
              onClick={async () => {
                await props.deletePost(post.id)
              }
              }
            >Delete</Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={
              <Tooltip id={`tooltip-top`}> Click to Edit</Tooltip>
            }
          >
            <Button style={{}}
              variant='warning'
              onClick={async () => {
                if (edit) {
                  let modPost = await processEdit(post.id, props.updatePost)
                  props.updatePost(modPost)
                  setEdit(false)
                } else {
                  setEdit(true)
                }
              }}
            >{edit ? 'Done' : 'Edit'}</Button>
          </OverlayTrigger>

          <ButtonGroup className="me-2" aria-label="Second group">
            <Button variant="primary" style={{ pointerEvents: 'none' }}>Count {post.count} </Button>
          </ButtonGroup>
        </div>

      </Card.Body>
    </Card >
  )
}

export default FeedPost