exports.printFrame = (frame, minDistance, maxDistance) => {
  const width = frame.width;
  const data = frame.data;
  let output = '';
  data.forEach((item, index) => {
    if ((width - index) % width === 0) output += '\n';

    if (item > maxDistance || item < minDistance) {
      output += 0;
    } else output += 1;

    output += ' ';
  });
  console.log(output);
};

exports.timer = ms => {
  return new Promise(res => setTimeout(res, ms));
};
