// function that shows the newest posts first //
function sortNewest(a, b) {
  return b.created_at - a.created_at;
}

// all comments and resources are stored in their respective arrays //

module.exports = (knex) => {
  return {


   // getAllResources gets an array of resources //
    getAllResources: (callback) => {
      knex
      .select('*')
      .from('resources')
      .then((allResourcesArr) => {
        callback(allResourcesArr.sort(sortNewest));
      });
    },


    // getResource gets a single resource object and the comments array (might change this later) //
    getResource: (resourceID, callback) => {
      let resrc;
      knex
      .select('*')
      .from('resources')
      .where('resources.id', resourceID)
      .then((thisResourcesArr) => {
        resrc = thisResourcesArr[0];
      }).then(() => {
        knex
        .select('*')
        .from('comments')
        .where('resource_id', resourceID)
        .then((commentsArr) => {
          resrc.comments = commentsArr.sort(sortNewest);
          callback(resrc);
        })
      });
    },


    // getResourcesBySearch gets resources with the associated search tag, title, description and url //
    getResourcesBySearch: (data, callback) => {
      console.log('data in search query', data);

      let tagIDs = data.tagIDs;
      let searchTerm = data.search;
      console.log('tagIDs', tagIDs);
      const approximateTerm = `%${searchTerm}%`.toLowerCase(); // searches description for a match

      //may need to recheck the pluralization with: tags //
      tagIDs = tagIDs || knex.select('id').from('tags');

      return knex
      .distinct('resource_id').select().from('resource_tags').where('tag_id', 'in', tagIDs)
      .then((result) => {
        console.log('result', result);
        result = result.map(obj => obj.resource_id);
        return knex.select('*').from('resources').where('id', 'in', result);
      }).then((r) => {
          console.log('r', r);
        let searchResult = r.filter(res => {
          console.log('res', res);
          return (
          (res.title && res.title.toLowerCase().includes(searchTerm)) ||
          (res.url && res.url.toLowerCase().includes(searchTerm)) ||
          (res.description && res.description.toLowerCase().includes(searchTerm)));
        });

        callback(searchResult.sort(sortNewest));
      });
    },


    // getResourcesByCategory gets resources by category //
    getResourcesByTag: (tagID, callback) => {
      knex
      .select('*')
      .from('resources')
      //the resource_url may get buggy//
      .innerJoin('resource_tag', 'resources.id', 'resource_url')

      //this might have to be tag_id
      .where('tags.id', categoryID)
      .then((catResourcesArr) => {
        callback(catResourcesArr.sort(sortNewest));
      });
    },

    // getResourcesByUser gets resources unique to user //
    getResourcesByUser: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .where('user_id', userID)
      .then((userResourcesArr) => {
        callback(userResourcesArr.sort(sortNewest));
      });
    },


    // getComments returns the comments unique to a resource //
    getComments: (resourceUserArr, callback) => {
      const [resourceID, userID] = resourceUserArr;
      const result = {}
      knex
        .select('users.name as commenter', 'users.id as commenter_id',
          'comments.c_text as text', 'comments.created_at as created_at')
        .from('comments')
        .innerJoin('users', 'comments.user_id', 'users.id')
        .where('resource_id', resourceID)
      .then((commentsArr) => {
        result.comments = commentsArr.sort(sortNewest);
        if (userID) {
          knex('ratings').select('value').where('resource_id', resourceID).andWhere('user_id', userID)
          .then(function(valueArr) {
            console.log('valueArr', valueArr)
            result.ratedValue = (valueArr.length > 0) ? valueArr[0].value : undefined;
            callback(result);
          });
        } else {
          result.ratedValue = undefined;
          callback(result);
        }
      });
    },


    // getResourcesByUserLiked gets resources liked by a user //
    getResourcesByUserLiked: (userID, callback) => {
      knex
      .select('*')
      .from('resources')
      .innerJoin('likes', 'likes.resource_id', 'resources.id')
      .where('likes.user_id', userID)
      .then((userLikedResourcesArr) => {
        callback(userLikedResourcesArr.sort(sortNewest));
      });
    },


    // getUserByEmail gets a user by email //
    getUserByEmail: (email, callback) => {
      knex
      .select('*')
      .from('users')
      .where('email', email)
      .then((userArr) =>{
        callback(userArr[0]);
      });
    },



    // saves a new user from /register
    saveUser: (user, callback) => {
      knex
      .returning('id')
      .insert({
        name:        user.name,
        email:       user.email,
        password:    user.password
      }).into('users')
      .then((idArr) => {
        user.id = idArr[0];
        console.log('user.id', user.id);
        callback(user);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },


    // saveResource saves a new resource for a user //
    saveResource: (resource, callback) => {
      resource.likes_count = 0;
      resource.avg_rating = 0;
      resource.tags =[];
      knex
      .returning('id')
      .insert({
        user_id:        resource.user_id,
        resource_url:   resource.url,
        title:          resource.title,
        description:    resource.description,
        likes_count:    resource.likes_count,
        avg_rating:     resource.avg_rating,
      }).into('resources')
      .then((idArr) => {
        resource.id = idArr[0];
        let tagMap = resource.tags.map(catID => ({tag_id: catID, resource_id: resource.id}));
        return knex.insert(tagMap).into('resource_tags');
      })
      .then(() => {
        callback(resource);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },


    // saveComment saves a new comment //
    saveComment: (comment, callback) => {
      const returnedObj = {};
      knex
      .returning(['id', 'created_at'])
      .insert({
        user_id:        comment.user_id,
        resource_id:    comment.resource_id,
        c_text:           comment.text
      }).into('comments')
      .then((returnedArr) => {
        returnedObj.id = returnedArr[0].id;
        returnedObj.created_at = returnedArr[0].created_at
        returnedObj.commenter_id = comment.user_id;
        returnedObj.resource_id = comment.resource_id;
        returnedObj.text = comment.text;
      })
      .then(() => {
        return [1];
      })
      .then((count) => {
        callback([returnedObj, count[0]]);
      })
      .catch(function(err){
        console.log('Error', err.message);
      });
    },


    // UPDATING SECTION: USER, LIKES, RATINGS //

    // updateUser lets a User update their profile //
    updateUser: (userObj, callback) => {
      const thisId = userObj.id;
      //userObj.id = undefined;
      console.log('thisId', thisId);
      knex('users').where('id', thisId).update(userObj)
      .then(function(isUpdated) {
        if (isUpdated) {
          userObj.id = thisId;
          callback(userObj);
        }
      });
    },


   //the update likes and ratings is causing an error upon npm run local

  //  updates likes: if user hasn't liked it before, it will increment, otherwise it will decrement and remove the like //
    updateLikes: (likeObj, callback) => {
      knex
      .select('*')
      .from('likes')
      .where('likes.user_id', '=', likeObj.user_id)
      .andWhere('likes.resource_id', '=', likeObj.resource_id)
      .then((likeArr) => {
        if (likeArr.length < 1) {
          return knex.insert(likeObj).into('likes')
          .then(() => {
            return knex('resources').where('id', likeObj.resource_id)
            .increment('likes_count', 1).returning('likes_count');
          });
        } else {
          return knex('likes').where('user_id', likeObj.user_id)
            .andWhere('likes.resource_id', '=', likeObj.resource_id).del()
          .then(() => {
            return knex('resources').where('id', likeObj.resource_id)
            .decrement('likes_count', 1).returning('likes_count');
          });
        }
      }).then((newCountArr) => {
        callback(newCountArr[0]);
      });
    },


  // //  updates rating: if user hasn't rated it before, it will increment, otherwise it will decrement and remove the rating //
    updateRating: (ratingObj, callback) => {
      knex
      .select('*')
      .from('ratings')
      .where('ratings.user_id', '=', ratingObj.user_id)
      .andWhere('ratings.resource_id', '=', ratingObj.resource_id)
      .then((ratingArr) => {
        if (ratingArr.length < 1) {
          return knex.insert(ratingObj).into('ratings').then(() => {
          return knex('ratings').avg('value as avgRating').where('resource_id', ratingObj.resource_id)
            .returning('avgRating'); })
          .then((avgRatingArr) => {
            const rating = Math.round(Number(avgRatingArr[0].avgRating));
            return knex('resources').where('id', ratingObj.resource_id)
            .update('avg_rating', rating).returning('avg_rating');
          }).then((newMeanArr) => {
            callback(newMeanArr[0]);
          });
        } else {
          return knex('ratings').where('user_id', ratingObj.user_id)
            .andWhere('ratings.resource_id', '=', ratingObj.resource_id).update('value', ratingObj.value)
          .then(() => {
          return knex('ratings').avg('value as avgRating').where('resource_id', ratingObj.resource_id)
            .returning('avgRating'); })
          .then((avgRatingArr) => {
            const rating = Math.round(Number(avgRatingArr[0].avgRating));
            return knex('resources').where('id', ratingObj.resource_id)
            .update('avg_rating', rating).returning('avg_rating');
          }).then((newMeanArr) => {
            callback(newMeanArr[0]);
          });
        }
      })
    },

   // end of queries.js //
  };
}


