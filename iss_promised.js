const request = require('request-promise-native');
 
 // use request to fetch IP address from JSON API
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};
 
 
const fetchCoordsByIP = function (data) {
  const ip = JSON.parse(data).ip
  return request('https://freegeoip.app/json/' + ip);
};
 
 
const fetchISSFlyOverTimes = (data) => {
  const {latitude, longitude} = JSON.parse(data);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

module.exports = {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes};