const config = require('../../config');

module.exports = {
  DUMMY_TOKEN_FOR_TESTING: 'dummy_token',
  DUMMY_USER_ID_FOR_TESTING: 'dummy_user_id',
  DUMMY_POSTS: [
    {
      user_id: 'dummy_user_id',
      old_image_url: 'dummy1_old_image_url',
      new_image_url: 'dummy1_new_image_url',
      description: 'dummy1_description',
      shoot_date: '1901-01-01',
      geom: `ST_GeomFromText('POINT(111 11)', ${config.SRID})`,
      view_count: '10',
    },
    {
      user_id: 'dummy_user_id',
      old_image_url: 'dummy2_old_image_url',
      new_image_url: 'dummy2_new_image_url',
      description: 'dummy2_description',
      shoot_date: '1902-02-02',
      geom: `ST_GeomFromText('POINT(222 22)', ${config.SRID})`,
      view_count: '20',
    },
  ],
};
