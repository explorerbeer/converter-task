const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const baseUrl = 'https://www.nbrb.by/api';

const getAllActualDataFromAPI = async () => {
  const actualData = await axios.get(
    `${baseUrl}/exrates/rates?periodicity=0`
  );
  return actualData.data;
};

module.exports = getAllActualDataFromAPI;
