<?php

function optsHandler(){
    $opts = wp_load_alloptions();
    $wlabOpts = $opts["wlab_options"];
    return unserialize($wlabOpts);
}
add_action( 'rest_api_init', function () {
    register_rest_route( 'wp/v2', '/options', array(
        'methods' => 'GET',
        'callback' => 'optsHandler',
    ) );
} );