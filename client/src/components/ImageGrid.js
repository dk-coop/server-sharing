import React from 'react';
import styled from 'styled-components'
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
          add: {},
        };
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
            return this.renderAddImage()
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
        // update images
        const updatedImages = await getImages();
        await this.setState({ images: updatedImages });
        await this.setState({ selectedImage: null });
        // update tags
        const updatedTags = await getTags();
        await this.setState({ tags: updatedTags });
    }

    mapGridImagesToReact(images) {
        if (images) {
            return images.map(
                image => {
                    return (
                    <ImageDetailsWrapper>
                        <ImageGridButton key={image._id} onClick={() => this.handleSelectedImage(image._id)}>
                            <ImageWrapper src={image.location} alt={image.name} />
                            <ImageMetadata>{image.name}</ImageMetadata>
                            <ImageMetadata>{image.description}</ImageMetadata>
                        </ImageGridButton>
                    </ImageDetailsWrapper>)
                });
        }
        return;
    }

    handleGridTagsChange = async(event) => {
        const updatedImages = await getImagesByTag(event.target.defaultValue);
        await this.setState({ images: updatedImages });
    }

    mapGridTagsToReact(tags) {
        if (tags) {
            return tags.map(
                tag => {
                    return (
                        <TagWrapper htmlFor={tag}>{tag}:
                            <input type="radio" id={tag} name="gridtag" value={tag} onChange={this.handleGridTagsChange}></input>
                        </TagWrapper>
                    )
                });
            }
            return;
    }

    radioGridTags(tags) {
        return (
            <form>
              <label>
                <h2>Available Tags:</h2>
                <TagWrapper htmlFor="all">Show all:
                    <input type="radio" id="all" name="gridtag" value="Show all images" onChange={this.clearSelectedImage}></input>
                </TagWrapper>
                {this.mapGridTagsToReact(tags)}
              </label>
            </form>
          );
    }

    handleAddImageSubmit = async(event) => {
        const newImageToAdd = this.state.add;
        const newImage = await addImage(newImageToAdd.file, newImageToAdd.name, newImageToAdd.description, newImageToAdd.tags);
        // in case at some point want to switch views to show image view instead of grid
        event.preventDefault();
    }

    renderAddImage = () => {
        // this should be its own component with handleAddImageSubmit(event)
        return (
            <FormWrapper>
                <h2>Add your own image</h2>
                <form action="#" id="#" encType="multipart/form-data" onSubmit={this.handleAddImageSubmit}>
                    <div>
                    <label htmlFor="newImage">Image to be uploaded (png, jpg, gif only):</label>
                    <input type="file" required
                        id="newImage" name="newImage"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        onChange={(event) => {
                                this.setState({ add: { ...this.state.add, file: event.target.files[0] } })
                        }}></input>
                    </div>
                    <div>
                        <label htmlFor="name">Name (3 to 20 characters):</label>
                        <input type="text" id="name" name="name" required
                            minLength="3" maxLength="20" size="10"
                            onChange={(event) => {
                                this.setState({ add: { ...this.state.add, name: event.target.value } })
                            }}></input>
                    </div>
                    <div>
                        <label htmlFor="description">Description (3 to 50 characters):</label>
                        <input type="text" id="description" name="description"
                            minLength="3" maxLength="50" size="30"
                            onChange={(event) => {
                                this.setState({ add: { ...this.state.add, description: event.target.value } })
                            }}></input>
                    </div>
                    <div>
                        <label htmlFor="tags">Tags (comma separated):</label>
                        <input type="text" id="tags" name="tags"
                            minLength="3" maxLength="50" size="30"
                            onChange={(event) => {
                                this.setState({ add: { ...this.state.add, tags: event.target.value } })
                            }}></input>
                    </div>
                    <input type="submit" value="Add Image to Album"></input>
                </form>
            </FormWrapper>
        )
    }

    renderImagesInGrid = () => {
        // this should be its own component separated out as a view
        // and pulling in the renderAddImage() component, the radioGridTags() component,
        // and mapGridImagesToReact() component
        return (
            <div>
                <GridWrapper>
                    {this.radioGridTags(this.state.tags)}
                </GridWrapper>

                {this.renderAddImage()}

                <h2>View images</h2>
                <GridWrapper>
                    {this.mapGridImagesToReact(this.state.images)}
                </GridWrapper>
            </div>
        );
    }

    renderImageById = () => {
        const image = this.state.selectedImage;
        const tags = this.mapImageTagsToReact(image.tags);
        return (
            <div>
                <button onClick={this.clearSelectedImage}>
                    close view
                </button>
                <h2>Name: {image.name}</h2>
                <ImageByIdWrapper key={image._id} src={image.location} onClick={() => openURlPathInNewTab(image.location)}/>
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
            <BodyWrapper>
                {updatedReactView}
            </BodyWrapper>
        )
    }
}

// these should be put in a styles.js sheet and shared across components when
// these are cleaned up to be their own component and then imported.
const BodyWrapper = styled.section`
padding: 5px;
color: DarkSlateGray;
`;
const TagWrapper = styled.label`
display: block;
`;
const GridWrapper = styled.section`
display: flex;
flex-wrap: wrap;
padding: 0 15px;
width: 80%;
border: 5px;
`;
const FormWrapper = styled.section`
padding: 0 15px;
width: 80%;
border: 5px;
`;
const ImageGridButton = styled.button`
background-color: white;
border-color: Azure;
height: 350px;
overflow: scroll;
`;
const ImageWrapper = styled.img`
padding: 10px;
height: 200px;
vertical-align: middle;
cursor: pointer;
`;
const ImageMetadata = styled.p`
width: 200px;
font-size: 15px;
`;
const ImageDetailsWrapper = styled.section`
flex-wrap: 25%;
padding: 0 5px;
max-width: 80%;
`;
const ImageByIdWrapper = styled.img`
display: flex;
height: 400px;
padding: 0 5px;
border: 5px;
cursor: pointer;
vertical-align: middle;
`;

export default ImageGrid;