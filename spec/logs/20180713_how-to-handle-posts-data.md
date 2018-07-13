# consideration

- **when to fetch posts**

  - fetch all posts on component mount
  - but don't fetch all posts if `this.props.posts.all` already exists
  - fetch filtered posts on the filter applied

- **limit on display count**

  - Map
    - show all posts
  - Grid
    - show limited posts by `this.props.posts.limitCountGrid`
    - limited count increases by the infinity scroll function

- **order by date VS random**

  - Pros
    - user likes SNS style
    - user can easily check how far they have browsed
    - user can easily check the created post
  - Cons
    - browsing is biased towards new posts

# props need to be created

- limitCountGrid
- mapLat
- mapLng
- mapZoomLevel

# todo

- add `created_at` column for `posts` table
- create infinity scroll function
- generate google maps infowindow dynamically
