const withImages = require('next-images')
module.exports = withImages()
module.exports = withImages({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
      };
    }    return config;
  },
});
