import axios from 'axios';

const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE',
        'Access-Control-Allow-Headers': '*'
    };

async function getImages(filter = '') {
    let returnValue = [];
    await axios.get(`/images${filter}`, {
        headers: headers
    }).then(function (response) {
        returnValue = response.data;
    }).catch(function (error) {
        console.log("Error getting images.")
        console.log(error);
    });
    return returnValue;
}

async function getImagesByTag(tagId) {
    return await getImages(`?tagId=${tagId}`);
}

async function getImagesByKeyword(keyword) {
    return await getImages(`?keyword=${keyword}`);
}

async function getImageById(imageId) {
    return await getImages(`?imageId=${imageId}`);
}

async function deleteImageById(imageId) {
    let returnValue = {};
    await axios.delete(`/images/delete?imageId=${imageId}`, {
        headers: headers
    }).then(function (response) {
        returnValue = response.data;
    }).catch(function (error) {
        console.log("Error deleting image.")
        console.log(error);
    });
    return returnValue;
}

async function addImage(file, name, description, tags) {
    const data = new FormData();
    data.append('images', file, file.name);
    data.append('name', name);
    data.append('description', description);
    data.append('tags', tags);
    let returnValue = [];
    await axios.post(`/images`, data, {
        headers: headers
    }).then(function (response) {
        returnValue = response.data;
    }).catch(function (error) {
        console.log("Error getting images.")
        console.log(error);
    });
    return returnValue;
}

export {
    getImages,
    getImagesByTag,
    getImagesByKeyword,
    getImageById,
    addImage,
    deleteImageById
};