import axios from 'axios';

const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE',
        'Access-Control-Allow-Headers': '*'
    };

async function getTags(filter = '') {
    let returnValue = [];
    await axios.get(`/tags${filter}`, {
        headers: headers
    }).then(function (response) {
        returnValue = response.data;
    }).catch(function (error) {
        console.log("Error getting tags.")
        console.log(error);
    });
    return returnValue;
}

export {
    getTags
};