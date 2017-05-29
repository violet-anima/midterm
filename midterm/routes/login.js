"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();
//const bcrypt  = require('bcrypt');


module.exports = function (knex) {

  //This is the Login Logic//

  router.post("/", (req, res) => {

    const email = req.body.email;
    db(knex).getUserByEmail(email, function(user) {

      if (user) {
        if(req.body.password === user.password) {
           req.session.userId = user.id;
          db(knex).getResourcesByUser(user.id, function(resourcesFromDB) {
          res.status(200).render("user_page", {resources: resourcesFromDB });
        });
        } else {
            req.session.error_message = 'Email and/or password is incorrect.  Please try again.';
            res.status(401).redirect('/');
            return;
        }
      } else {
        req.session.error_message = 'Email and/or password is incorrect.  Please try again.';
        res.status(401).redirect('/');
        return;
      }
    })
  })


  router.post("/update", (req, res) => {

    const email = req.body.username;
    var user = {};
    user.email =  email;
    user.password = req.body.password;
    user.id= req.session.userId ;


    db(knex).updateUser(user, function(userid) {

      if (req.session.userId ) {

          db(knex).getResourcesByUser(req.session.userId, function(resourcesFromDB) {
          res.status(200).render("user_page", {resources: resourcesFromDB });
        });

      } else {
        req.session.error_message = 'Email and/or password is incorrect.  Please try again.';
        res.status(401).redirect('/');
        return;
      }
    })
  })


    router.get("/edit", (req, res) => {
     res.status(200).render("edit_profile");
  })


      router.get("/register", (req, res) => {
     res.status(200).render("register");
  })



      router.get("/resource", (req, res) => {
        db(knex).getAllResources(function(resourcesFromDB) {
          res.status(200).render("user_page", {resources: resourcesFromDB });
        });
  })

  return router;
}
