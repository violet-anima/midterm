exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists('comments'),
    knex.schema.dropTableIfExists('resource_tags'),
    knex.schema.dropTableIfExists('ratings'),
    knex.schema.dropTableIfExists('tags'),
    knex.schema.dropTableIfExists('likes'),
    knex.schema.dropTableIfExists('resources'),
    knex.schema.dropTableIfExists('users')
  ]).then(() => {
    return Promise.all([

      knex.schema.createTable('users', function (table) {
          table.increments();
          table.string('name');
          table.string('email');
          table.string('password');
        }),

      knex.schema.createTable('resources', function (table) {
        table.increments();
        table.integer('user_id');
        table.string('resource_url');
        table.string('title');
        table.text('description');
        table.integer('likes_count');
        table.integer('avg_rating');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('user_id')
        .references('users.id');
      }),

      knex.schema.createTable('likes', function (table) {
        table.integer('resource_id');
        table.integer('user_id');
        table.foreign('resource_id')
        .references('resources.id');
        table.foreign('user_id')
        .references('users.id');
      }),

      knex.schema.createTable('tags', function (table) {
        table.increments();
        table.string('tag_name');
      }),

      knex.schema.createTable('ratings', function (table) {
        table.integer('resource_id');
        table.integer('user_id');
        table.integer('value');
        table.foreign('resource_id')
        .references('resources.id');
        table.foreign('user_id')
        .references('users.id');
      }),

      knex.schema.createTable('resource_tags', function (table) {
        table.integer('resource_id');
        table.integer('tag_id');
        table.foreign('resource_id')
        .references('resources.id');
        table.foreign('tag_id')
        .references('tags.id');
      }),

      knex.schema.createTable('comments', function (table) {
        table.increments();
        table.integer('resource_id');
        table.integer('user_id');
        table.text('c_text');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.foreign('resource_id')
        .references('resources.id');
        table.foreign('user_id')
        .references('users.id');
      })
    ]);
  });
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('resource_tags'),
    knex.schema.dropTable('ratings'),
    knex.schema.dropTable('tags'),
    knex.schema.dropTable('likes'),
    knex.schema.dropTable('resources'),
    knex.schema.dropTable('users'),
  ]);
};
