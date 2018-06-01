function getRandomInt(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDouble(max, min = 0) {
  return Math.random() * (max - min) + min;
}

module.exports = {
  getRandomInt,
  getRandomDouble,
};
