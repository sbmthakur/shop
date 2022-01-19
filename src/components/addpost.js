import React, { useState, useRef } from 'react'
import { Form, Button } from "react-bootstrap";
//import imageThumbnail from 'image-thumbnail'

const WORKERS_URL = process.env.REACT_APP_WORKERS_URL

export const Name = props => {
  return <Form.Control
    aria-label="Name of the item"
    placeholder={props.name ? props.name : 'Name'}
    id={props.id ? `name-${props.id}` : 'name'}
    defaultValue={props.name ? props.name : ''}
    required
  />
}

export const Description = props => {
  return <Form.Control
    as="textarea"
    aria-label="Description"
    placeholder={props.description ? props.description : 'Description'}
    defaultValue={props.description ? props.description : ''}
    id={props.id ? `description-${props.id}` : 'description'}
  />
}

export const Count = props => {
  return <Form.Control
    aria-label="Count of the item"
    id={props.id ? `count-${props.id}` : 'count'}
    type="number"
    placeholder={props.count ? props.count : 0}
    defaultValue={props.count ? Number(props.count) : ''}
    required
  />
}

export const FileUpload = props => {
  return <Form.Group controlId="formFile" className="mb-3">
    <Form.Label>{props.title ? props.title : 'Upload image for thumbnail'}</Form.Label>
    <Form.Control
      type="file"
      onChange={props.handleChange}
      ref={props.ref}
    />
  </Form.Group>
}

export const createThumbnail = async (base64Image, targetSize) => {
  return new Promise(resolve => {
    let img = new Image();

    img.onload = function () {
      let width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");

      canvas.width = canvas.height = targetSize;

      ctx.drawImage(
        img,
        width > height ? (width - height) / 2 : 0,
        height > width ? (height - width) / 2 : 0,
        width > height ? height : width,
        width > height ? height : width,
        0, 0,
        targetSize, targetSize
      );
      let img_str = canvas.toDataURL()
      resolve(img_str)
    };

    img.src = base64Image;
  })
};

const AddPost = (props) => {

  const ref = useRef(null)

  const [fileData, setFileData] = useState('')

  const submitMetadata = async (originalImage, thumbnailImage) => {

    let name = document.getElementById('name').value
    let count = document.getElementById('count').value
    let description = document.getElementById('description').value

    let img = originalImage
    let thumbnail_img = thumbnailImage

    let raw = JSON.stringify({
      name,
      count,
      description,
      img,
      thumbnail_img
    });

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw
    };
    let newPost

    try {
      newPost = await fetch(`${WORKERS_URL}/additem`, requestOptions)
        .then(response => response.json())

    } catch (err) {
      alert('Invalid response while adding. Please check the console');
      let errorMessage = err && err.message ? err.message : err;
      console.error(errorMessage);
    }

    return newPost
  }

  const handleChange = async (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = function (event) {
      let data = event.target.result
      setFileData(data)
    };
    reader.readAsDataURL(file);
  }

  const handleSubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    let thumbnailImage = await createThumbnail(fileData, 200)
    let newPost = await submitMetadata(fileData, thumbnailImage)

    props.addNewPost(newPost)
    setFileData('')
    ref.current.value = ''
  };

  const formStyle = {
    borderRadius: '10px',
    margin: '5px auto',
    padding: '2px'
  }

  return (
    <Form style={formStyle} onSubmit={handleSubmit}>

      <Name />
      <Description />
      <Count />

      <FileUpload handleChange={handleChange} />

      <Button style={{ textAlign: 'center', display: 'block', margin: '0 auto' }} variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default AddPost