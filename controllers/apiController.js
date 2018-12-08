const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.mapImage = async (req, res) => {
    const { lat, lng } = req.query;

    const url = `http://www.mapquestapi.com/staticmap/v4/getmap?key=${
        process.env.MAPQUEST_KEY
    }&center=${lat},${lng}&type=sat&size=900,600&zoom=15&scalebar=false&imagetype=jpeg`;

    const filePath = path.join(
        __dirname,
        `../public/uploads/maps/${lat},${lng}.jpg`,
    );

    const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
    });

    const fileStream = response.data.pipe(fs.createWriteStream(filePath));

    fileStream.on('finish', () => {
        res.sendFile(filePath);
    });
};
