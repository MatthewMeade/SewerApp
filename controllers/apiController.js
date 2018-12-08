const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.mapImage = async (req, res) => {
    const { lat, lng } = req.query;

    // const url = `http://www.mapquestapi.com/staticmap/v4/getmap?key=${
    //     process.env.MAPQUEST_KEY
    // }&center=${lat},${lng}&type=sat&size=300,250&zoom=16&scalebar=false&imagetype=jpeg`;

    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=500x500&key=${
        process.env.GOOGLE_MAP_KEY
    }&maptype=hybrid`;

    console.log(url);

    const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
    });

    response.data.pipe(res);
};

// 47.5849426,-52.7149954
