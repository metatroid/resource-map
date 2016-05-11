<?php
/**
 * The Workers Lab Options & Settings
 * @version 0.1.0
 */
class WLab_Admin {

  /**
   * Option key, and option page slug
   * @var string
   */
  private $key = 'wlab_options';

  /**
   * Options page metabox id
   * @var string
   */
  private $metabox_id = 'wlab_option_metabox';

  /**
   * Options Page title
   * @var string
   */
  protected $title = '';

  /**
   * Options Page hook
   * @var string
   */
  protected $options_page = '';

  /**
   * Holds an instance of the object
   *
   * @var WLab_Admin
   **/
  private static $instance = null;

  /**
   * Constructor
   * @since 0.1.0
   */
  private function __construct() {
    // Set our title
    $this->title = __( 'Settings & Text Snippets', 'wlab' );
  }

  /**
   * Returns the running object
   *
   * @return WLab_Admin
   **/
  public static function get_instance() {
    if( is_null( self::$instance ) ) {
      self::$instance = new self();
      self::$instance->hooks();
    }
    return self::$instance;
  }

  /**
   * Initiate our hooks
   * @since 0.1.0
   */
  public function hooks() {
    add_action( 'admin_init', array( $this, 'init' ) );
    add_action( 'admin_menu', array( $this, 'add_options_page' ) );
    add_action( 'cmb2_admin_init', array( $this, 'add_options_page_metabox' ) );
  }


  /**
   * Register our setting to WP
   * @since  0.1.0
   */
  public function init() {
    register_setting( $this->key, $this->key );
  }

  /**
   * Add menu options page
   * @since 0.1.0
   */
  public function add_options_page() {
    $this->options_page = add_menu_page( $this->title, $this->title, 'manage_options', $this->key, array( $this, 'admin_page_display' ) );

    // Include CMB CSS in the head to avoid FOUC
    add_action( "admin_print_styles-{$this->options_page}", array( 'CMB2_hookup', 'enqueue_cmb_css' ) );
  }

  /**
   * Admin page markup. Mostly handled by CMB2
   * @since  0.1.0
   */
  public function admin_page_display() {
    ?>
    <div class="wrap cmb2-options-page <?php echo $this->key; ?>">
      <h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
      <?php cmb2_metabox_form( $this->metabox_id, $this->key ); ?>
    </div>
    <?php
  }

  /**
   * Add the options metabox to the array of metaboxes
   * @since  0.1.0
   */
  function add_options_page_metabox() {

    // hook in our save notices
    add_action( "cmb2_save_options-page_fields_{$this->metabox_id}", array( $this, 'settings_notices' ), 10, 2 );

    $cmb = new_cmb2_box( array(
      'id'         => $this->metabox_id,
      'hookup'     => false,
      'cmb_styles' => false,
      'show_on'    => array(
        // These are important, don't remove
        'key'   => 'options-page',
        'value' => array( $this->key, )
      ),
    ) );

    // Set our CMB2 fields

    $cmb->add_field( array(
      'name' => __( 'Landing page overlay', 'wlab' ),
      'desc' => __( 'The content of the "landing page" overlaid on the map', 'wlab' ),
      'id'   => 'landing_content',
      'type' => 'wysiwyg',
      'default' => '',
    ) );

    $cmb->add_field( array(
      'name' => __( 'About The Workers Lab', 'wlab' ),
      'desc' => __( 'The text which sits within the menu', 'wlab' ),
      'id'   => 'about_text',
      'type' => 'wysiwyg',
      'default' => '',
    ) );

    $group_field_id = $cmb->add_field( array(
      'id'          => 'social_media_links',
      'type'        => 'group',
      'description' => __( 'URLs for The Workers Lab social media profiles', 'cmb2' ),
      'options'     => array(
          'group_title'   => __( 'Profile {#}', 'cmb2' ),
          'add_button'    => __( 'Add Another Profile', 'cmb2' ),
          'remove_button' => __( 'Remove Profile', 'cmb2' ),
          'sortable'      => true
      )
    ));
    $cmb->add_group_field( $group_field_id, array(
      'name' => 'Social Media Service',
      'id'   => 'service',
      'type' => 'select',
      'show_option_none' => false,
        'options'          => array(
          "facebook" => __('Facebook', 'facebook'),
          "twitter" => __('Twitter', 'twitter'),
          "instagram" => __('Instagram', 'instagram'),
          "linkedin" => __('LinkedIn', 'linkedin'),
          "tumblr" => __('Tumblr', 'tumblr'),
          "youtube-play" => __('YouTube', 'youtube-play'),
          "google-plus" => __('Google+', 'google-plus')
        )
    ));
    $cmb->add_group_field( $group_field_id, array(
      'name' => 'Social Media URL',
      'id'   => 'url',
      'type' => 'text',
    ));
    // $cmb->add_field( array(
    //   'name' => __( 'Twitter URL', 'wlab' ),
    //   'desc' => __( 'Enter the Twitter profile address', 'wlab' ),
    //   'id'   => 'twitter_url',
    //   'type' => 'text',
    //   'default' => 'http://',
    // ) );
    // $cmb->add_field( array(
    //   'name' => __( 'Facebook URL', 'wlab' ),
    //   'desc' => __( 'Enter the Facebook profile address', 'wlab' ),
    //   'id'   => 'facebook_url',
    //   'type' => 'text',
    //   'default' => 'http://',
    // ) );
    // $cmb->add_field( array(
    //   'name' => __( 'Instagram URL', 'wlab' ),
    //   'desc' => __( 'Enter the Instagram profile address', 'wlab' ),
    //   'id'   => 'instagram_url',
    //   'type' => 'text',
    //   'default' => 'http://',
    // ) );

  }

  /**
   * Register settings notices for display
   *
   * @since  0.1.0
   * @param  int   $object_id Option key
   * @param  array $updated   Array of updated fields
   * @return void
   */
  public function settings_notices( $object_id, $updated ) {
    if ( $object_id !== $this->key || empty( $updated ) ) {
      return;
    }

    add_settings_error( $this->key . '-notices', '', __( 'Settings updated.', 'wlab' ), 'updated' );
    settings_errors( $this->key . '-notices' );
  }

  /**
   * Public getter method for retrieving protected/private variables
   * @since  0.1.0
   * @param  string  $field Field to retrieve
   * @return mixed          Field value or exception is thrown
   */
  public function __get( $field ) {
    // Allowed fields to retrieve
    if ( in_array( $field, array( 'key', 'metabox_id', 'title', 'options_page' ), true ) ) {
      return $this->{$field};
    }

    throw new Exception( 'Invalid property: ' . $field );
  }

}

/**
 * Helper function to get/return the WLab_Admin object
 * @since  0.1.0
 * @return WLab_Admin object
 */
function wlab_admin() {
  return WLab_Admin::get_instance();
}

/**
 * Wrapper function around cmb2_get_option
 * @since  0.1.0
 * @param  string  $key Options array key
 * @return mixed        Option value
 */
function wlab_get_option( $key = '' ) {
  return cmb2_get_option( wlab_admin()->key, $key );
}

// Get it started
wlab_admin();