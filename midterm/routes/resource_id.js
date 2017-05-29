"use strict";

const scraper         = require('../public/scripts/scraper.js');
const cheerio         = require('cheerio');
const scraper_request = require('../public/scripts/scraper.js');
const url_parser      = require('../public/scripts/url_parser');

const express = require('express');
const router  = express.Router();


module.exports = (db) => {

router.get("/search", (req, res) => {

    let searchArr = req.query;
    console.log('searchArr in route', searchArr);
    db.getResourcesBySearch(searchArr, function(resources) {
      res.json(resources);
    })
  })

router.post("/", (req, res) => {
    //Create new resource
    const user_id     = req.session.user.id;
    const title       = req.body.title;
    const url         = req.body.url;
    const description = req.body.description;
    const img_src     = req.body.img_src;
    const categories  = req.body.category;

    const resource = {user_id:      user_id,
                      url:          url,
                      title:        title,
                      description:  description,
                      media_src:    img_src,
                      categories:   [categories]
                     }
    console.log('resource:', resource);

    db.saveResource(resource, function(resource){
    });
    res.redirect("/");
  })



  router.get("/:resource_id/likes", (req, res) => {
    // returns number of likes for that resource
    if (req.user) {
      const likeObj = {};
      likeObj.resource_id = req.params.resource_id;
      likeObj.user_id = req.user.id
      db.updateLikes(likeObj, function(newCount) {
        res.status(200).send(`${newCount}`);
      })
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  router.post("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
    if (req.user) {
      const commentObj = {
        user_id:        req.user.id,
        resource_id:    req.params.resource_id,
        text:           req.body.text
      };
      db.saveComment(commentObj, function(commentInfo) {
        commentInfo[0].commenter = req.user.name;
        res.status(200).json(commentInfo)
      });
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  router.get("/:resource_id/comments", (req, res) => {
    // returns number and content of comments for that resource
    let resource_id = req.params.resource_id;
    const user_id = req.user ? req.user.id : undefined
    db.getComments([resource_id, user_id], function(results) {
      const result = {comments: results.comments, ratedValue: results.ratedValue, isLoggedIn: !!req.user}
      res.status(200).json(result);
    });
  })

  router.get("/:resource_id/ratings", (req, res) => {
    // returns ratings and average rating for that resource
    if (req.user) {
      const ratingObj = {};
      ratingObj.resource_id = req.params.resource_id;
      ratingObj.user_id = req.user.id;
      ratingObj.value = req.query.value;
      db.updateRating(ratingObj, function(newMean) {
        res.status(200).send(`${newMean}`);
      })
    } else{
      req.session.error_message = "Login first";
      res.status(403).redirect("/");
    }
  })

  return router;
}