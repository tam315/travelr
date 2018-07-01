const config = require('../../config');

module.exports = {
  DUMMY_TOKEN: 'DUMMY_USER_TOKEN',
  DUMMY_USER_ID: 'dummy_user_id',
  DUMMY_USER_DISPLAY_NAME: 'dummy_user_display_name',
  DUMMY_POSTS: [
    {
      user_id: 'dummy_user_id',
      old_image_url: 'dummy1_old_image_url',
      new_image_url: 'dummy1_new_image_url',
      description: 'dummy1_description',
      shoot_date: '1800-01-01',
      geom: `ST_GeomFromText('POINT(10.001 20.001)', ${config.SRID})`,
      view_count: 50000,
    },
    {
      user_id: 'dummy_user_id',
      old_image_url: 'dummy2_old_image_url',
      new_image_url: 'dummy2_new_image_url',
      description: 'dummy2_description',
      shoot_date: '1800-02-02',
      geom: `ST_GeomFromText('POINT(10.002 20.002)', ${config.SRID})`,
      view_count: 50001,
    },
  ],
  DUMMY_NEW_POST: {
    oldImageUrl: 'dummy3_old_image_url',
    newImageUrl: 'dummy3_new_image_url',
    description: 'dummy3_description',
    shootDate: '1800-03-03',
    lng: 10.003,
    lat: 20.003,
  },
};
