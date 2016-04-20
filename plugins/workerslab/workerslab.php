<?php
/*
Plugin Name: Workers Lab Plugin
Description: Provides custom behavior/functionality
Version: 0.01
Author: Jon Gronberg
Author URI: http://metatroid.com
License: GPL2
*/


if ( file_exists( dirname( __FILE__ ) . '/cmb2/init.php' ) ) {
  require_once dirname( __FILE__ ) . '/cmb2/init.php';
}
//
function wlab_cpt(){
  include_once('post-types.php');
}
add_action('init', 'wlab_cpt');
add_theme_support('post-thumbnails');
add_action( 'cmb2_init', 'company_info_fields' );
//
function company_info_fields(){
  include_once('company-info-fields.php');
}
//
// include_once('company-routes.php');
add_action('init', 'add_company_to_rest_api', 30);
function add_company_to_rest_api(){
  global $wp_post_types;
  $wp_post_types['company']->show_in_rest = true;
  $wp_post_types['company']->rest_base = 'company';
  $wp_post_types['company']->rest_controller_class = 'WP_REST_Posts_Controller';
}
add_filter( 'rest_prepare_company', 'add_meta_to_json', 10, 3 );
function add_meta_to_json($data, $post, $request){
  $response_data = $data->get_data();
  if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
    return $data;
  }
  $compAddr = get_post_meta($post->ID, 'compAddr', true);
  $compCity = get_post_meta($post->ID, 'compCity', true);
  $compCountry = get_post_meta($post->ID, 'compCountry', true);
  $compState = get_post_meta($post->ID, 'compState', true);
  $compZip = get_post_meta($post->ID, 'compZip', true);
  $compPhone = get_post_meta($post->ID, 'compPhone', true);
  $compWebsite = get_post_meta($post->ID, 'compWebsite', true);
  $showMap = get_post_meta($post->ID, 'showMap', true);
  $mapsLink = get_post_meta($post->ID, 'mapsLink', true);
  if($post->post_type == 'company'){
    $response_data['company_meta'] = array(
      'compAddr' => $compAddr,
      'compCity' => $compCity,
      'compCountry' => $compCountry,
      'compState' => $compState,
      'compZip' => $compZip,
      'compPhone' => $compPhone,
      'compWebsite' => $compWebsite,
      'showMap' => $showMap,
      'mapsLink' => $mapsLink,
    );  
  }
  $data->set_data($response_data);
  return $data;
}


?>