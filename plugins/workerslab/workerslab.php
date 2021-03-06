<?php
/*
Plugin Name: Workers Lab Plugin
Description: Provides custom behavior/functionality
Version: 0.01
Author: Jon Gronberg
Author URI: http://metatroid.com
License: GPL2
*/

//define a debugging logger
function logg($msg, $title = ''){
  $logFile = dirname( __FILE__ ) . '/workerslab.log';
  $date = date('d.m.Y h:i:s');
  $msg = print_r($msg, true);
  $log = $title . " | " . $msg . "\n";
  error_log($log, 3, $logFile);
}
// logg("example", "title");

//load + enable custom meta boxes
if ( file_exists( dirname( __FILE__ ) . '/workerslab/cmb2/init.php' ) ) {
  require_once dirname( __FILE__ ) . '/workerslab/cmb2/init.php';
}

//define 'company' post type
function wlab_cpt(){
  include_once('workerslab/post-types.php');
}
add_action('init', 'wlab_cpt');
add_action( 'cmb2_init', 'company_info_fields' );

//define meta box fields
function company_info_fields(){
  include_once('workerslab/company-info-fields.php');
}

//set up API/JSON endpoints
add_action('init', 'add_company_to_rest_api', 30);
function add_company_to_rest_api(){
  global $wp_post_types;
  $wp_post_types['company']->show_in_rest = true;
  $wp_post_types['company']->rest_base = 'company';
  $wp_post_types['company']->rest_controller_class = 'WP_REST_Posts_Controller';
}

//include meta fields in JSON response
add_filter( 'rest_prepare_company', 'add_meta_to_json', 10, 3 );
function add_meta_to_json($data, $post, $request){
  $response_data = $data->get_data();
  if ( $request['context'] !== 'view' || is_wp_error( $data ) ) {
    return $data;
  }
  $subtitle = get_post_meta($post->ID, 'subtitle', true);
  $compAddr = get_post_meta($post->ID, 'compAddr', true);
  $compCity = get_post_meta($post->ID, 'compCity', true);
  $compCountry = get_post_meta($post->ID, 'compCountry', true);
  $compState = get_post_meta($post->ID, 'compState', true);
  $compZip = get_post_meta($post->ID, 'compZip', true);
  $compPhone = get_post_meta($post->ID, 'compPhone', true);
  $compWebsite = get_post_meta($post->ID, 'compWebsite', true);
  // $showMap = get_post_meta($post->ID, 'showMap', true);
  // $mapsLink = get_post_meta($post->ID, 'mapsLink', true);
  $lat = get_post_meta($post->ID, 'latitude', true);
  $lng = get_post_meta($post->ID, 'longitude', true);
  $industry = wp_get_post_terms($post->ID, 'industry');
  $campaign = wp_get_post_terms($post->ID, 'campaign');
  $state = wp_get_post_terms($post->ID, 'state');
  if(has_post_thumbnail($post->ID)) {
    $attachment = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full');
    if($attachment){
      $avatar = $attachment[0];
    } else {
      $avatar = "";
    }
  } else {
    $avatar = "";
  }
  if($post->post_type == 'company'){
    $response_data['company_meta'] = array(
      'subtitle' => $subtitle,
      'avatar' => $avatar,
      'compAddr' => $compAddr,
      'compCity' => $compCity,
      'compCountry' => $compCountry,
      'compState' => $compState,
      'compZip' => $compZip,
      'compPhone' => $compPhone,
      'compWebsite' => $compWebsite,
      // 'showMap' => $showMap,
      // 'mapsLink' => $mapsLink,
      'latitude' => $lat,
      'longitude' => $lng,
      'industry' => $industry,
      'campaign' => $campaign,
      'state' => $state
    );  
  }
  $data->set_data($response_data);
  return $data;
}

//use geojson file for map markers
function updateGeoJson(){
  $jsonFile = dirname( __FILE__ ) . '/companies.json';
  $args = array(
    'post_type' => 'company',
    'posts_per_page' => -1
  );
  $companies = get_posts($args);
  $jsonObj = array();
  foreach ($companies as $company) {
    $latitude = get_post_meta($company->ID, 'latitude', true);
    $longitude = get_post_meta($company->ID, 'longitude', true);
    $title = $company->post_title;
    $slug = $company->post_name;
    $industry = wp_get_post_terms($company->ID, 'industry', array('fields' => 'ids'));
    array_push($industry, "all");
    $campaign = wp_get_post_terms($company->ID, 'campaign', array('fields' => 'ids'));
    array_push($campaign, "all");
    $state = wp_get_post_terms($company->ID, 'state', array('fields' => 'ids'));
    array_push($state, "all");
    $comp = array(
              "geometry" => array(
                              "type" => "Point", 
                              "coordinates" => array($longitude,$latitude)
                            ),
              "type" => "Feature",
              "properties" => array(
                "title" => $title,
                "slug" => $slug,
                "industry" => $industry,
                "campaign" => $campaign,
                "state" => $state,
                "compid" => $company->ID,
                "marker-color" => "#0c1d20",
                "icon" => array(
                   "iconUrl" => "/assets/img/marker_icon.svg",
                   "iconSize" => [22, 31],
                   "iconAnchor" => [11, 31],
                   "popupAnchor" => [0, 0],
                   "className" => "dot"
                 )
              )
            );
    array_push($jsonObj, $comp);
  }
  file_put_contents($jsonFile, json_encode($jsonObj));
}

//add after-save callback to save lat/lng coordinates to db
add_action( 'save_post', 'save_company_meta', 10, 3 );
function save_company_meta($post_id, $post, $update){
  if($post->post_type !== "company"){
    return;
  }
  $street = $post->compAddr;
  $city = $post->compCity;
  $state = $post->compState;
  if(strlen($street) > 0){
    $locationString = "{$street} {$city} {$state}";
    $locationString = urlencode($locationString);
    $apiKey = "AIzaSyDCeNiQn5pxEpsoOGBIRChItBfGSYwe2VY";
    $apiURL = "https://maps.googleapis.com/maps/api/geocode/json?key={$apiKey}&address={$locationString}";
    $geocode = json_decode(file_get_contents($apiURL));
    $lat = $geocode->results[0]->geometry->location->lat;
    $lng = $geocode->results[0]->geometry->location->lng;
    if(isset($lat)){
      update_post_meta($post_id, 'latitude', $lat);
    }
    if(isset($lng)){
      update_post_meta($post_id, 'longitude', $lng);
    }
    updateGeoJson();
  }
}

//add custom taxonomies
function taxonInit() {
  register_taxonomy(
    'industry',
    'company',
    array(
      'label' => __( 'Industries' ),
      'rewrite' => array( 'slug' => 'industries' ),
      'hierarchical' => true,
      'show_in_rest' => true,
      'rest_base' => 'industry',
      'rest_controller_class' => 'WP_REST_Terms_Controller',
    )
  );
  register_taxonomy(
    'campaign',
    'company',
    array(
      'label' => __( 'Campaigns' ),
      'rewrite' => array( 'slug' => 'campaigns' ),
      'hierarchical' => true,
      'show_in_rest' => true,
      'rest_base' => 'campaign',
      'rest_controller_class' => 'WP_REST_Terms_Controller',
    )
  );
  register_taxonomy(
    'state',
    'company',
    array(
      'label' => __( 'States' ),
      'rewrite' => array( 'slug' => 'states' ),
      'hierarchical' => true,
      'show_in_rest' => true,
      'rest_base' => 'state',
      'rest_controller_class' => 'WP_REST_Terms_Controller',
    )
  );
}
add_action( 'init', 'taxonInit' );

//create miscellaneous options/settings page
include_once('workerslab/wlab_options.php');
//options endpoint
include_once('workerslab/wlab_options_endpoint.php');

?>