"use strict";

const db = require('../db/queries.js');

const express = require('express');
const router  = express.Router();


module.exports = function (knex) {

  //This is the Registration//

  router.post("/", (req, res) => {

    const email = req.body.email;
    const username = req.body.uname
    const password = req.body.pword

    let user = {}
      user.name = username
      user.email = email
      user.password = password

    db(knex).saveUser(user, function(user) {
    db(knex).getResourcesByUser(user.id, function(resourcesFromDB) {
      res.status(200).render("user_page", {resources: resourcesFromDB });
    });
    })
  })
  return router;
}

