<?php

class Company_Routing extends WP_REST_Controller{

  public function register_routes(){
    $version = "1";
    $namespace = "wlab/v{$version}";
    $base = "api";
    register_rest_route($namespace, "/{$base}", array(
      array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => array($this, 'get_items'),
        'permission_callback' => array($this, 'get_items_permissions_check'),
        'args' => array()
      ),
      array(
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => array($this, 'create_item'),
        'permission_callback' => array($this, 'create_item_permissions_check'),
        'args' => $this->get_endpoint_args_for_item_schema(true)
      )
    ));
    register_rest_route($namespace, "/{$base}/(?P<id>[\d]+)", array(
      array(
        'methods' => WP_REST_Server::READABLE,
        'callback' => array($this, 'get_item'),
        'permission_callback' => array($this, 'get_item_permissions_check'),
        'args' => array(
          'context' => array('default' => 'view')
        )
      ),
      array(
        'methods' => WP_REST_Server::EDITABLE,
        'callback' => array($this, 'update_item'),
        'permission_callback' => array($this, 'update_item_permissions_check'),
        'args' => $this->get_endpoint_args_for_item_schema(false)
      ),
      array(
        'methods' => WP_REST_Server::DELETABLE,
        'callback' => array($this, 'delete_item'),
        'permission_callback' => array($this, 'delete_item_permissions_check'),
        'args' => array(
          'force' => array(
            'default' => false
          )
        )
      )
    ));
    register_rest_route($namespace, "/{$base}/schema", array(
      'methods' => WP_REST_Server::READABLE,
      'callback' => array($this, 'get_public_item_schema'),
    ));
  }
  //
  public function get_items( $request ) {
    $items = array();
    $data = array();
    foreach($items as $item){
      $itemdata = $this->prepare_item_for_response($item, $request);
      $data[] = $this->prepare_response_for_collection($itemdata);
    }

    return new WP_REST_Response($data, 200);
  }

}

?>