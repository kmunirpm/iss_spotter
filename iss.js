/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request')
const https = require('https')

// use request to fetch IP address from JSON API
const fetchMyIP = callback => {
  request('https://api.ipify.org?format=json', (error, resp, data) => {
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching IP: ${data}`), null);
      return;
    }
    const ip = JSON.parse(data).ip;
    callback(null, ip);
  });
};


const fetchCoordsByIP = (ip, callback) => {
  request('https://freegeoip.app/json/' + ip, (error, resp, data) => {
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching IP: ${data}`), null);
      return;
    }
    const {latitude, longitude} = JSON.parse(data);
    callback(null, {latitude, longitude});
  });
};


const fetchISSFlyOverTimes = (cords, callback) => {
  request(`https://iss-pass.herokuapp.com/json/?lat=${cords.latitude}&lon=${cords.longitude}`, (error, resp, data) => {
    if (error) return callback(error, null);

    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when cordinates IP: ${data}`), null);
      return; 
    }
    const flyover = JSON.parse(data).response;
    callback(null, flyover);
  });
};
  

const nextISSTimesForMyLocation = callback => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }
      //loc = {latitude: '43.5882', longitude: '-79.5594'};
      fetchISSFlyOverTimes(loc, (error, nextPass) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPass);
      });
    });
  });
};


module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};