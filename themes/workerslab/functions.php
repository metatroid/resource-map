<?php
/**
 * The Workers Lab functions and definitions
 *
 * @package WordPress
 * @subpackage Workers_Lab
 * @since workerslab 0.1
 */

add_theme_support('post-thumbnails');

function override_tinymce_option($initArray) {
  $opts = 'a[*]';
  $initArray['valid_elements'] = $opts;
  $initArray['extended_valid_elements'] = $opts;
  return $initArray;
}
add_filter('tiny_mce_before_init', 'override_tinymce_option');

?>