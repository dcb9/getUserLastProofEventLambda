export default process.env.NODE_ENV === 'development' ? {
    TWITTER_CONSUMER_KEY: '8rBG1xrUBpFgE2T5bDOskGFpv',
    TWITTER_SECRET_KEY: 'WOL2SCR8RJr38LTBlPEqZz4r6fyU9qqCELBeCE7hmbOcuchnDi',
    DEPLOYED_ADDRESS: 'http://localhost:1234',
    WEB3_URL: 'http://localhost:8545',
} : {
    TWITTER_CONSUMER_KEY: '8rBG1xrUBpFgE2T5bDOskGFpv',
    TWITTER_SECRET_KEY: 'WOL2SCR8RJr38LTBlPEqZz4r6fyU9qqCELBeCE7hmbOcuchnDi',
    DEPLOYED_ADDRESS: 'http://localhost:1234',
    WEB3_URL: 'https://rinkeby.infura.io/FBRYWho7pzEONk2CkfZp',
}
