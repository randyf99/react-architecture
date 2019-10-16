const dateString = (d) => (
  d.getFullYear()
  + '-' + (d.getMonth() + 1)
  + '-' + d.getDate()
);

console.log(dateString(new Date()));