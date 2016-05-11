<?php

$cmb = new_cmb2_box(array(
    'id'            => 'company_info',
    'title'         => 'Company Information',
    'object_types'  => array('company'),
    'context'       => 'normal',
    'priority'      => 'high',
    'show_names'    => true,
    'cmb_styles'    => true,
    'closed'        => false,
));
//
$cmb->add_field(array(
  'name' => 'Subtitle',
  'type' => 'text',
  'id' => 'subtitle'
));
//
$cmb->add_field(array(
  'name' => 'Address',
  'type' => 'text',
  'id' => 'compAddr'
));
//
$cmb->add_field(array(
  'name' => 'City',
  'type' => 'text',
  'id' => 'compCity'
));
//
$cmb->add_field(array(
  'name' => 'State or Province',
  'type' => 'text',
  'id' => 'compState'
));
//
$cmb->add_field(array(
  'name' => 'Country',
  'type' => 'select',
  'default' => 'us',
  'options' => array(
    'us' => __('United States', 'us'),
    'canada' => __('Canada', 'canada'),
    'mexico' => __('Mexico', 'mexico')
  ),
  'id' => 'compCountry'
));
//
$cmb->add_field(array(
  'name' => 'Postal Code',
  'type' => 'text',
  'id' => 'compZip'
));
//
$cmb->add_field(array(
  'name' => 'Phone',
  'type' => 'text',
  'id' => 'compPhone'
));
//
$cmb->add_field(array(
  'name' => 'Website',
  'type' => 'text_url',
  'id' => 'compWebsite'
));
//
$cmb->add_field(array(
  'name' => 'Show Mapbox',
  'type' => 'checkbox',
  'id' => 'showMap'
));
//
$cmb->add_field(array(
  'name' => 'Show Mapbox Link',
  'type' => 'checkbox',
  'id' => 'mapsLink'
));

?>