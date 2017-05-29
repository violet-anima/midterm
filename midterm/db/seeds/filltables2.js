
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('comments').del()
    .then(function () { return knex('resource_tags').del() })
    .then(function () { return knex('ratings').del() })
    .then(function () { return knex('likes').del() })
    .then(function () { return knex('tags').del() })
    .then(function () { return knex('resources').del() })
    .then(function () { return knex('users').del() })
    .then(function () {
      return Promise.all([
         //Inserts users seed entries
         knex('users').insert({id: 1, name: 'Alice', email: 'alice@welcome.com', password: '123'}),
         knex('users').insert({id: 2, name: 'Bob', email: 'misterveal@gmail.com', password: '456'}),
         knex('users').insert({id: 3, name: 'Elliot', email: 'a@a.a', password: 'aaa'}),
         knex('users').insert({id: 4, name: 'Charlie', email: 'resourcewall@gmail.com', password: '789'}),
         knex('users').insert({id: 5, name: 'Dan', email: 'dan@gmail.com', password: '012'})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts resources seed entries
        knex('resources').insert({id: 1, user_id: 1, resource_url: 'https://www.w3schools.com/', title: 'We make developers!',
          description: 'Lighthouse Labs in 2013 by a group of software developers with a passion for code, mentorship, and education. They offer various courses and learning materials for anyone interested in advancing their coding knowledge.',
          likes_count: 2, avg_rating: 3 }),
        knex('resources').insert({id: 2, user_id: 3, resource_url: 'https://www.youtube.com/embed/BMUiFMZr7vk', title: 'Yahoo!',
          description: 'The word yahoo is a backronym for Yet Another Hierarchically Organized Oracle or Yet Another Hierarchical Officious Oracle. It\'s like google.',
          likes_count: 2, avg_rating: 3,
          }),
        knex('resources').insert({id: 3, user_id: 1, resource_url: 'http://mashable.com/', title: 'mashable  wtf - whats dis4',
          description: 'Mashable is the go-to source for tech, digital culture and entertainment content for its dedicated and influential audience around the globe.',
          likes_count: 0, avg_rating: 5}),
        knex('resources').insert({id: 4, user_id: 2, resource_url: 'https://www.ultimate-guitar.com/', title: 'Ultimate Guitar Tabs',
          description: 'Large amount of guitar tabs posted by users and ranked based on popularity. Great for learning those songs you know and love.',
          likes_count: 0, avg_rating: 5,
          })
      ])
    }).then(function () {
      return Promise.all([
        // Inserts categories seed entries
        knex('tags').insert({id: 1, tag_name: 'Art'}),
        knex('tags').insert({id: 2, tag_name: 'Biology'}),
        knex('tags').insert({id: 3, tag_name: 'Geography'}),
        knex('tags').insert({id: 4, tag_name: 'Business'}),
        knex('tags').insert({id: 5, tag_name: 'Music'}),
        knex('tags').insert({id: 6, tag_name: 'Tech'}),
        knex('tags').insert({id: 7, tag_name: 'Food'}),
        knex('tags').insert({id: 8, tag_name: 'Philosophy'}),
        knex('tags').insert({id: 9, tag_name: 'Engineering'}),
        knex('tags').insert({id: 10, tag_name: 'Photography'}),
        knex('tags').insert({id: 11, tag_name: 'Other'})

      ])
    }).then(function () {
      return Promise.all([
        // Inserts likes seed entries
        knex('likes').insert({resource_id: 2, user_id: 1}),
        knex('likes').insert({resource_id: 1, user_id: 2}),
        knex('likes').insert({resource_id: 2, user_id: 3}),
        knex('likes').insert({resource_id: 1, user_id: 3})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts ratings seed entries
        knex('ratings').insert({resource_id: 3, user_id: 1, value: 5}),
        knex('ratings').insert({resource_id: 1, user_id: 2, value: 4}),
        knex('ratings').insert({resource_id: 2, user_id: 3, value: 3}),
        knex('ratings').insert({resource_id: 1, user_id: 3, value: 1})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts resource_categories seed entries
        knex('resource_tags').insert({resource_id: 3, tag_id: 6}),
        knex('resource_tags').insert({resource_id: 1, tag_id: 6}),
        knex('resource_tags').insert({resource_id: 2, tag_id: 11}),
        knex('resource_tags').insert({resource_id: 1, tag_id: 3})
      ])
    }).then(function () {
      return Promise.all([
        // Inserts comments seed entries
        knex('comments').insert({id: 1, resource_id: 3, user_id: 1, c_text: 'Awesome!!'}),
        knex('comments').insert({id: 2, resource_id: 1, user_id: 2, c_text: 'The book was a better teacher and had a better personality.'}),
        knex('comments').insert({id: 3, resource_id: 2, user_id: 3, c_text: 'It\'s okay.'}),
        knex('comments').insert({id: 4, resource_id: 1, user_id: 3, c_text: 'So good, the best.'}),
        knex('comments').insert({id: 5, resource_id: 4, user_id: 4, c_text: 'Learned stairway to heaven! Now everyone loves me at parties.'})

      ]);
    });
};
