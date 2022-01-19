import React, { useState } from "react";
//import { Link } from "@reach/router";
import { Button, ButtonGroup, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Name, Description, Count, FileUpload, createThumbnail } from './addpost'

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
    return <FileUpload handleChange={props.handleChange} title='Update thumbnail' />
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

const processEdit = async (id, originalImage, thumbnailImage) => {
  let name = document.getElementById(`name-${id}`).value
  let count = document.getElementById(`count-${id}`).value
  let description = document.getElementById(`description-${id}`).value

  let img = originalImage
  let thumbnail_img = thumbnailImage

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
  const [newImage, setFileData] = useState('')

  const handleChange = async (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      let data = event.target.result
      setFileData(data)
    };
    reader.readAsDataURL(file);
  }

  return (
    <Card key={post.id} style={{ width: '18rem', margin: '0 5%', backgroundColor: 'whitesmoke' }} >
      <ShowThumbnail edit={edit} thumbnail_img={post.thumbnail_img} handleChange={handleChange} />
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
                  let thumbnailImage, originalImage
                  if (newImage) {
                    thumbnailImage = await createThumbnail(newImage, 200)
                    originalImage = newImage
                  } else {
                    thumbnailImage = post.thumbnail_img
                    originalImage = post.original_img
                  }
                  let modPost = await processEdit(post.id, originalImage, thumbnailImage)
                  props.updatePost(modPost)
                  setEdit(false)
                  setFileData('')
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