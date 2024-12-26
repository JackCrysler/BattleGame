const path = require('path')
module.exports = function override(config, env) {
    //do stuff with the webpack config...
    console.log(config.mode)
    if (config.mode === 'production') {
        // config.externals = {
        //     ...config.externals,
        //     'react': "React",
        //     'react-dom': "ReactDOM"
        // }
    }
    config.externals = {
        ...config.externals,
        'react': "React",
        'react-dom': "ReactDOM"
    }
    config.resolve.alias = {
        ...config.resolve.alias,
        '~': path.resolve(__dirname, 'src/'),
    }

    return config;
}