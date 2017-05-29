"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
//const bcrypt  = require('bcrypt');



module.exports = function (knex) {

  //This is for New Resources logic //

  router.post("/", (req, res) => {
    var resource  = {};
        resource.url = req.body.url;
        resource.title = req.body.title;
        resource.description = req.body.dscript;
        resource.user_id = req.session.userId;

    db(knex).saveResource(resource, function() {
      db(knex).getResourcesByUser(req.session.userId, function(resourcesFromDB) {
        res.status(200).render("user_page", {resources: resourcesFromDB });
      });
    })
  })


  router.post("/search", (req, res) => {
    var resource  = {};
        resource.search = req.body.key;
        db(knex).getResourcesBySearch(resource, function(resourcesFromDB) {
          res.status(200).render("user_page", {resources: resourcesFromDB });
        });
  })

    router.get("/comment", (req, res) => {
      req.session.resourceId = req.query.resourceId;
        db(knex).getResource(req.session.resourceId, function(resultedresource) {
          db(knex).getComments([req.session.resourceId,req.session.userId], function(result) {
          res.status(200).render("resource_comment", {comments: result.comments, resource: resultedresource });
            });
        });
  })
  return router;
}
