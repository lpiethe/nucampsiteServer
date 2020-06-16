 const express = require('express');
 const bodyParser = require('body-parser');
 //gives access to the partner model and schema
 const Partner = require('../models/partner');
 const authenticate = require('../authenticate');
 const cors = require('./cors');
 
 const partnerRouter = express.Router();

 partnerRouter.use(bodyParser.json());

 partnerRouter.route('/')
 .options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
 .get(cors.cors, (req, res, next) => {
    Partner.find()
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    }) 
    //catches all errors and letsexpress worry about how to handle the error
    .catch(err => next(err));
 })

 .post( cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
     //body should contain the info to create the document and body parse middleware wiol have already parsed it
    //mongoose will let us know if something is wrong like a name field or something
     Partner.create(req.body) 
     .then(partner => {
         console.log('Partner Created', partner);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(partner);
     })
     .catch(err => next(err));
 })

 //leaving PUT request as is since it is not allowed
 .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res,) => {
     res.statusCode = 403;
     res.end('PUT operation not supported on /partners');
 })

 .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

 partnerRouter.route('/:partnerId')
 .options(cors.corsWithOptions, (req,res) => res.sendStatus(200))
 .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
    //id is getting parsed by http from whatever user on client side typed in as id they want to access
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})

 .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
     res.statusCode = 403;
     res.end(`POST opertaion not supported on /partners/${req.params.partnerId}`);
 })

 .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
     Partner.findByIdAndUpdate(req.params.partnerId, {
         $set: req.body
     }, { new: true})
     .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
 })

 .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = partnerRouter;