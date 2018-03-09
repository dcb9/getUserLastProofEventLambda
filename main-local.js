const {
    getUserLastProofEvent,
} = require('./lib/index.js');

getUserLastProofEvent({
   "platform": "twitter",
  "userAddress": "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"
}, undefined, console.log)
