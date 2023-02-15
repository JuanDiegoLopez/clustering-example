const express = require('express');
const cluster = require('cluster');
const totalCpus = require('os').cpus().length;
const port = 3000;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCpus}`);
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");

    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello world');
  });

  app.get('/api/:n', function (req, res) {
    let n = parseInt(req.params.n);
    let count = 0;

    if (n > 5000000000) n = 5000000000;

    for (let i = 0; i <= n; i++) {
      count += i;
    }

    res.send(`Final count is ${count}`);
  });

  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
