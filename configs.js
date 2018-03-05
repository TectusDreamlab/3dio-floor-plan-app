module.exports = {

  // SERVER

  // URL of the server where this app is deployed to (relevant for callbacks)
  // note: localhost or 127.0.0.1 will not work with callbacks from 3d.io -> use ngrok for local testing
  url: process.env.PUBLIC_SERVER_URL || '127.0.0.1',

  // website domains which will be allowed to use this API (CORS)
  corsAllowedDomains: [
    // process.env.PUBLIC_SERVER_URL.replace('https://','').replace('http://',''),
    'localhost',
    'localhost:3000'
  ],

  // email configs
  fromEmail: process.env.EMAIL_FROM,
  adminEmail: process.env.EMAIL_ADMIN,

  //url: 'https://floorplan.3d.io',
  port: process.env.PORT || 3000,

  // directory containing static front end content
  // set to false if this server should not serve front end files
  staticDir: 'public',

  // SERVICES

  // get your 3d.io secret API key from: https://3d.io/dev-dashboard/
  secretApiKey: process.env.IO3D_SECRET_API_KEY,

  redis_url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',

  // email (using nodemailer module and sendGrid API)
  // feel free to replace this with configs specific to your email service of choise
  nodemailer: {
    sendGrid: {
      auth: {
        api_key: process.env.SENDGRID_API_KEY
      }
    }
  }

}