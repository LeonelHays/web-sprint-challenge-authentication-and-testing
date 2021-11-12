
exports.seed = function(knex, Promise) {
  // Truncate ALL existing entries
  return knex('users')
      .truncate()
      .then(function() {
        return knex('users').insert([
          { 
            username: 'bob',
            password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq'
          },
          {
            username: 'sue',
            password: '$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq'
          },
        ]);
      })
};
