<?php
  register_post_type('company', array(
    'labels' => array(
      'name'   => 'Companies',
      'singular_name' => 'Company',
      'add_new' => __( 'Add New' ),
      'add_new_item' => __( 'Add new Company' ),
      'view_item' => 'View Company',
      'edit_item' => 'Edit Company',
      'new_item' => __('New Company'),
      'view_item' => __('View Company'),
      'search_items' => __('Search Companies'),
      'not_found' =>  __('No Companies found'),
      'not_found_in_trash' => __('No Companies found in Trash'),
    ),
    'public' => true,
    'exclude_from_search' => false,
    'show_ui' => true,
    'capability_type' => 'post',
    'hierarchical' => true,
    '_edit_link' =>  'post.php?post=%d',
    'rewrite' => array(
      "slug" => "company",
      "with_front" => false,
    ),
    'query_var' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
    'taxonomies' => array('post_tag', 'industry', 'issue', 'category')
  ));
?>