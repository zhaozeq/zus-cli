import runServer from '../../dev';

let closed = false;

// kill(2) Ctrl + C
process.once('SIGINT', () => onSignal('SIGINT'));
// kill(3) Ctrl + \
process.once('SIGQUIT', () => onSignal('SIGQUIT'));
// kill(15) default
process.once('SIGTERM', () => onSignal('SIGTERM'));

function onSignal() {
  // console.log(signal)
  if (closed) return;
  closed = true;
  process.exit(0);
}

process.env.NODE_ENV = 'development';
runServer({});
