const axios = require('axios');


axios.get('https://testsw2.free.beeceptor.com')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
