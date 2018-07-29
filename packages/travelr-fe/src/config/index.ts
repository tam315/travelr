const base = {
  apiUrl: 'http://localhost:3090/',
  googleMapApiKey: 'AIzaSyCVzSPlgcFr5D46o5F9frzyKLik5rl7ywM',
  firebase: {
    apiKey: 'AIzaSyDyBIv-KoWF85C2XzHRnBz7211dbX5EDnQ',
    authDomain: 'travelr-a75c4.firebaseapp.com',
    projectId: 'travelr-a75c4',
    storageBucket: 'travelr-images',
  },
};

const prod = {
  apiUrl: 'https://travelr-api.yuuniworks.com/',
};

// use process.env.NODE_ENV to access `process` variable
module.exports =
  process.env.NODE_ENV === 'production' ? { ...base, ...prod } : base;
