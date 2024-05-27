const active = false

const log = (...args) => {
  if( !active ) return;
  console.log(...args);
}

export {
  log
}