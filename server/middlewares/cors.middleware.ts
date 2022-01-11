const whitelist = [
  "http://localhost:4040",
  "https://m8-desafio-jous.web.app",
  "https://m8-desafio-jous.firebaseapp.com",
  // I set this as undefined 'cause that is what a query from this site returns
  undefined,
];
export const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
