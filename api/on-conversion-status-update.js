const io3d = require('3dio')
const configs = require('../configs.js')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const handleError = require('./utils/handle-error.js')
const getClient = require('./utils/redis_client.js')

// internals
const mailer = nodemailer.createTransport(sendGridTransport(configs.nodemailer.sendGrid))

// init

module.exports = function onConversionStatusUpdate (rpc) {

  // params from 3d.io API callback
  const conversionId = rpc.params.conversionId

  console.log(`Accepted API request "FloorPlan.onConversionStatusUpdate" with params:`, rpc.params)

  var status

  // get conversion status
  getConversionStatusFrom3dio(rpc, conversionId).then(statusData => {
    // update status info in database
    status = statusData
    return writeToDatabase(rpc, conversionId, JSON.stringify(statusData))
  }).then(() => {
    // get all conversion data from database
    return readFromDatabase (rpc, conversionId)
  }).then(conversionData => {
    // send out notifications etc.
    console.log(conversionData)
    return handleStatusUpdate(rpc, JSON.parse(conversionData), status)
  }).then(() => {
    rpc.sendResult({}) // for JSON-RPC2 notifications
    // rpc.sendResult('') // for JSON-RPC2 requests
  }).catch(error => {
    rpc.sendError(error)
  })

}

// private methods

function getConversionStatusFrom3dio (rpc, conversionId) {
  return io3d.floorPlan.getConversionStatus({ conversionId: conversionId }).then(result => {
    console.log(`Received conversion status from 3d.io API`)
    return result
  }).catch(error => {
    return handleError('Error receiving conversion status from 3d.io.', error, rpc)
  })
}

function writeToDatabase (rpc, conversionId, statusData) {
  return getClient().setAsync('conversions/' + conversionId + '/status', statusData).then(result => {
    console.log(`Stored conversion status update to database`)
    return result
  }).catch(error => {
    return handleError('Error writing to database.', error, rpc)
  })
}

function readFromDatabase (rpc, conversionId) {
  return getClient().getAsync('conversions/' + conversionId).then(result => {
    console.log(`Read conversion data from database`)
    return result
  }).catch(error => {
    return handleError('Error reading from database.', error, rpc)
  })
}

function handleStatusUpdate (rpc, conversionData, statusData) {
  const status = statusData.status
  const toEmail = conversionData.customer.email

  if (status === 'COMPLETED') {
    console.log(`Floor plan conversion successful`)
    const sceneUrl = io3d.scene.getViewerUrl({ sceneId: conversionData.sceneId })
    const emailBody = `Your 3D model is ready: ${sceneUrl}`
    return sendEmailToCustomer(rpc, {
      to: [toEmail],
      from: configs.fromEmail,
      subject: 'Your 3D Model Is Ready',
      text: emailBody,
      html: emailBody
    })

  }  else if (status === 'REJECTED') {
    console.log(`Floor plan conversion rejected`)
    // conversion has unfortunately been reject. most likely due to one of the following reasons:
    // NO_FLOORPLAN, UNCLEAR_FLOORPLAN, MULTIPLE_LEVELS, INCLINED_CEILING
    // Read more about converion limitiations: https://3d.io/docs/api/1/basic-3d-model.html
    const emailBody = `Sorry, your floor plan could not be converted into a 3d model. Reason: ${conversionData.rejectionReason}`
    return sendEmailToCustomer(rpc, {
      to: [toEmail],
      from: configs.fromEmail,
      subject: 'Floor plan conversion error',
      text: emailBody,
      html: emailBody
    })

  }  else if (status === 'IN_PROGRESS') {
    // not a status update although there should be one
    return handleError(`Error in conversion status update.`, 'still in progress', rpc)

  }  else {
    // unknown status
    return handleError(`Error: Unknown conversion status: ${status}.`, 'status unknown', rpc)

  }
}

function sendEmailToCustomer (rpc, email) {
  return mailer.sendMail(email).then(result => {
    console.log(`Sent status update email to customer`)
    return result
  }).catch(error => {
    return handleError('Error sending email to customer.', error, rpc)
  })
}