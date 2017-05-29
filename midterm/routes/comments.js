"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
//const bcrypt  = require('bcrypt');



module.exports = function (knex) {

  //This is for New Resources logic //

     router.post("/addcomment", (req, res) => {
      console.log("inside add comment");
      console.log(req.session.resourceId);

      var comment={};
      comment.resource_id = req.session.resourceId;
      comment.user_id = req.session.userId;
      comment.text = req.body.comment;

      db(knex).saveComment(comment, function(com) {

        db(knex).getResource(req.session.resourceId, function(resultedresource) {
          db(knex).getComments([req.session.resourceId,req.session.userId], function(result) {
          res.status(200).render("resource_comment", {comments: result.comments, resource: resultedresource });
            });
        });
      });
  })


     router.post("/like", (req, res) => {
      console.log(req.body.resourceId);

      var like={};
      like.resource_id = req.body.resourcesId;
      like.user_id = req.session.userId;
      console.log("inside like request",  like.resource_id,like.user_id);

      db(knex).updateLikes(like, function(com) {


  db(knex).getResourcesByUser(req.session.userId, function(resourcesFromDB) {
          res.status(200).render("user_page", {resources: resourcesFromDB });
        });
      });
  })

  return router;
}

