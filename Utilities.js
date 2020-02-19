exports.printFrame = frame => {
  const width = frame.width;
  const data = frame.data;
  let output = '';
  data.forEach((item, index) => {
    if ((width - index) % width === 0) output += '\n';

    output += item + ' ';
  });
  console.log(output);
};

exports.timer = ms => {
  return new Promise(res => setTimeout(res, ms));
};
