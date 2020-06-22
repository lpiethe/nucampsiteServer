const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');


const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find()
        .populate('user')
        .populate('campsites')
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    for (let i = 0; i < req.body.length; i++) {
                        if (favorite.campsites.indexOf(req.body[i]._id) === -1) {
                            favorite.campsites.push(req.body[i]._id)
                        }
                    }
                    favorite.save()
                        .then(favorite => {
                            console.log('Favorite Created', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    Favorite.create({
                        campsites: req.body,
                        user: req.user._id
                    })
                        .then(favorite => {
                            console.log('Favorite Created', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite );
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteMany()
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ status: 'Favorites have been deleted!' });
            }) 
            .catch(err => next(err));       
    });

        favoriteRouter.route(':/campsiteId')
            .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
            .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
                res.statusCode = 403;
                res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
            })
            .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                Favorite.findOne({ user: req.user._id })
                    .then(favorite => {
                        if (favorite) {
                            if (favorite.campsites.indexOf(req.params.campsiteId) === -1) {
                                favorite.campsites.push(req.params.campsiteId)
                                favorite.save()
                                .then(favorite => {
                                    console.log('Favorite Created', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite );
                                })
                                .catch(err => next(err)); 
                            } 
                            if (favorite.campsites.includes(req.params.campsiteId)) {
                                res.end('Campsite already marked favorite');
                            }
                        }
                        else {
                            Favorite.create({
                                "campsites": [req.params.campsiteId],
                                "user": req.user._id
                            })
                                .then(favorite => {
                                    console.log('Favorite Created', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ status: 'added campsite to favorites!', favorite: favorite });
                                })
                                .catch(err => next(err));
                        }
                    })
                    .catch(err => next(err));
            })
            .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                res.statusCode = 403;
                res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
            })
            .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
                Favorite.findOne({ user: req.user._id })
                    .then(favorite => {
                        if (favorite) {
                            const deleteIndex = favorite.campsites.indexOf(req.params.campsiteId)
                            favorite.campsites.splice(deleteIndex, 1)
                            favorite.save()
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({ status: 'Favorites have been deleted!' });
                                })
                                .catch(err => next(err));
                        }
                    })
                    .catch(err => next(err));
            });

        module.exports = favoriteRouter;