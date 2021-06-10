import React from 'react';
import styled, { css } from 'styled-components'
import { getImages,
    getImagesByTag,
    getImagesByKeyword,
    getImageById,
    deleteImageById,
    addImage } from './../utils/ImageUtils'
import { getTags } from './../utils/TagUtils'
import {openURlPathInNewTab} from './../utils/utils'

class ImageGrid extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          images: Array(),
          selectedImage: null,
          tags: null,
        };

        this.fileInput = React.createRef();
        this.nameInput = React.createRef();
        this.descriptionInput = React.createRef();
        this.tagsInput = React.createRef();
    }

    async componentDidMount() {
        const updatedImages = await getImages();
        await this.setState({ images: updatedImages });

        const updatedTags = await getTags();
        await this.setState({ tags: updatedTags });
    }

    updateView = () => {
        if (this.state.selectedImage) {
            return this.renderImageById()
        } else if (this.state.images.length > 0) {
            return this.renderImagesInGrid()
        } else {
            return <p>no images yet</p>
        }
    }

    mapImageTagsToReact(tags) {
        if (tags) {
            return tags.map(
                tag => {
                    return <li key={tag}>{tag}</li>
                });
        }
        return;
    }

    handleDeleteImage = async(imageId) => {
        await deleteImageById(imageId);
        await this.clearSelectedImage();
    }

    handleSelectedImage = async(imageId) => {
        const images = await getImageById(imageId);
        await this.setState({ selectedImage: images[0] });
    }

    clearSelectedImage = async() => {
        const updatedImages = await getImages();
        await this.setState({ images: updatedImages });
        await this.setState({ selectedImage: null });
    }

    mapGridImagesToReact(images) {
        const Button = styled.button`
        background-color: white;
        border-color: Azure;
        color: darkslategray;
        height: 350px;
        overflow: scroll;
        `;
        if (images) {
            return images.map(
                image => {
                    return (
                    <ImageDetailsWrapper>
                        <Button key={image._id} onClick={() => this.handleSelectedImage(image._id)}>
                            <ImageWrapper src={image.location} alt={image.name} />
                            <Metadata>{image.name}</Metadata>
                            <Metadata>{image.description}</Metadata>
                        </Button>
                    </ImageDetailsWrapper>)
                });
        }
        return;
    }

    handleGridTagsChange = async(event) => {
        console.log(event.target.defaultValue)
        const updatedImages = await getImagesByTag(event.target.defaultValue);
        await this.setState({ images: updatedImages });
    }

    mapGridTagsToReact(tags) {
        if (tags) {
            return tags.map(
                tag => {
                    return (
                    <label for={tag}>{tag}:
                        <input type="radio" id={tag} name="gridtag" value={tag} onChange={this.handleGridTagsChange}></input>
                    </label>
                    )
                });
            }
            return;
    }

    radioGridTags(tags) {
        return (
            <form>
              <label>
                Available Tags:
                <label for="all">Show all:</label>
                <input type="radio" id="all" name="gridtag" value="Show all images" onChange={this.clearSelectedImage}></input>
                {this.mapGridTagsToReact(tags)}
              </label>
            </form>
          );
    }

    handleAddImageSubmit = async(event) => {
        const file = this.fileInput.current.files[0].name
        const name = this.nameInput.current.value;
        const description = this.descriptionInput.current.value;
        const tags = this.tagsInput.current.value;

         const response = await addImage(file, name, description, tags);
         console.log(response)
         await this.clearSelectedImage()
        event.preventDefault();
    }

    renderAddImage = () => {
        return (
            <GridWrapper>
            <h2>Add your own image</h2>
            <form action="#" id="#" encType="multipart/form-data" onSubmit={this.handleAddImageSubmit}>
                <div>
                <label for="newImage">Image to be uploaded (png, jpg, gif only):</label>
                <input type="file" required
                    id="newImage" name="newImage"
                    accept="image/png, image/jpeg, image/jpg, image/gif"
                    ref={this.fileInput}></input>
                </div>
                <div>
                    <label for="name">Name (3 to 20 characters):</label>
                    <input type="text" id="name" name="name" required
                        minlength="3" maxlength="20" size="10" ref={this.nameInput}></input>
                </div>
                <div>
                    <label for="description">Description (3 to 50 characters):</label>
                    <input type="text" id="description" name="description"
                        minlength="3" maxlength="50" size="30" ref={this.descriptionInput}></input>
                </div>
                <div>
                    <label for="tags">Tags (comma separated):</label>
                    <input type="text" id="tags" name="tags"
                        minlength="3" maxlength="50" size="30" ref={this.tagsInput}></input>
                </div>
                <input type="submit" value="Add Image to Album"></input>
            </form>
            </GridWrapper>
        )
    }

    renderImagesInGrid = () => {
        return (
            <BodyWrapper>
                <GridWrapper>
                    {this.radioGridTags(this.state.tags)}
                </GridWrapper>

                {this.renderAddImage()}

                <GridWrapper>
                    {this.mapGridImagesToReact(this.state.images)}
                </GridWrapper>
            </BodyWrapper>
        );
    }

    renderImageById = () => {
        const ImageWrapper = styled.img`
            display: flex;
            height: 400px;
            padding: 0 5px;
            border: 5px;
            `;
        const image = this.state.selectedImage;
        const tags = this.mapImageTagsToReact(image.tags);
        return (
            <div>
                <button onClick={this.clearSelectedImage}>
                    close view
                </button>
                <h2>Name: {image.name}</h2>
                <ImageWrapper key={image._id} src={image.location} onClick={() => openURlPathInNewTab(image.location)}/>
                <p>{image.description}</p>
                <p>Tags:</p>
                <ul>
                    {tags}
                </ul>
                <button onClick={() => this.handleDeleteImage(image._id)}>
                    delete image '{image.name}'
                </button>
            </div>
        );
    }

    render() {
          // if images has been set let's load them
          const updatedReactView = this.updateView();
          return (
              <div>
                  {updatedReactView}
              </div>
          )
    }



}

const BodyWrapper = styled.section`
padding: 5px;
`;
const GridWrapper = styled.section`
display: flex;
flex-wrap: wrap;
padding: 0 5px;
width: 80%;
border: 5px;
`;

const ImageDetailsWrapper = styled.section`
flex-wrap: 25%;
padding: 0 5px;
max-width: 80%;
`;
const ImageWrapper = styled.img`
padding: 10px;
height: 200px;
vertical-align: middle;
`;
const Metadata = styled.p`
width: 200px;
font-size: 15px;
`;


export default ImageGrid;