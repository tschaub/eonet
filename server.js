var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var port = 3000;
var hostname = 'localhost';

config.devtool = 'cheap-module-eval-source-map';
config.entry.unshift('webpack-dev-server/client?http://' + hostname + ':' + port);

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  stats: {
    colors: true
  }
}).listen(port, hostname, function(err) {
  if (err) {
    process.stderr.write(err.message + '\n');
  }

  process.stdout.write('Listening at http://' + hostname + ':' + port + '/\n');
});
