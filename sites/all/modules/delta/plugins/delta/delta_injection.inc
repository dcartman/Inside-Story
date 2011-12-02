<?php

class delta_injection {
  var $plugin;
  var $template;
  var $original;
  var $settings;
  
  /**
   * Clone our references when we're being cloned.
   *
   * PHP 5.3 performs 'shallow' clones when clone()'ing objects, meaning that
   * any objects or arrays referenced by this object will not be copied, the
   * cloned object will just reference our objects/arrays instead. By iterating
   * over our properties and serializing and unserializing them, we force PHP to
   * copy them.
   */
  function __clone() {
    foreach ($this as $key => $val) {
      if (is_object($val) || (is_array($val))) {
        $this->{$key} = unserialize(serialize($val));
      }
    }
  }

  /**
   * Constructor. Do not override.
   */
  function __construct($plugin, $template) {
    $this->plugin = $plugin;
    $this->template = $template;
  }
  
  /**
   * @todo
   */
  function variables_get() {
    return array();
  }
  
  /**
   * @todo
   */
  function settings_get($name) {
    if (isset($this->settings[$name])) {
      return $this->settings[$name];
    }

    if (!empty($this->template->parent)) {
      if ($parent = delta_load($this->template_parent)) {
        if ($plugin = delta_get_plugin($parent, $this->plugin['name'])) {
          $this->settings[$name] = isset($this->template->settings[$name]) ? delta_merge($plugin->settings_get($name), $this->template->settings[$name]) : $plugin->settings_get($name);
        }
      }
    }
    
    if (!isset($this->settings[$name])) {
      $this->settings[$name] = isset($this->template->settings[$name]) ? delta_merge(variable_get($name), $this->template->settings[$name]) : variable_get($name);
    }
    
    return $this->settings[$name];
  }
  
  /**
   * @todo
   */
  function inject() {
    foreach ($this->variables_get() as $name) {
      $settings = $this->settings_get($name);
      
      if (isset($settings)) {
        $this->backup($name, delta_variable_set($name, $settings));
      }
    }
  }
  
  /**
   * @todo
   */
  function revoke() {
    foreach ($this->variables_get() as $name) {
      delta_variable_set($name, $this->backup($name));
    }
  }
  
  /**
   * @todo
   */
  function backup($name, $value = NULL) {
    if (isset($value) && !isset($this->original[$name])) {
      $this->original[$name] = $value;
    }
    
    if (isset($this->original[$name])) {
      return $this->original[$name];
    }
  }
  
  /**
   * @todo
   */ 
  function presave($form, &$form_state) {
    if ($this->template->mode == DELTA_PRESERVE) {
      $base = array();
       
      if (!empty($this->template->parent)) {
        if ($parent = delta_load($this->template_parent)) {
          if ($plugin = delta_get_plugin($parent, $this->plugin['name'])) {
            foreach ($this->variables_get() as $variable) {
              $base[$variable] = $plugin->settings_get($variable);        
            }
          }
        }
      }
      
      foreach ($this->variables_get() as $variable) {
        if (isset($base[$variable])) {
          $this->template->settings[$variable] = delta_reduce($this->template->settings[$variable], $base[$variable]);
        }
        else {
          $this->template->settings[$variable] = delta_reduce($this->template->settings[$variable], variable_get($variable));
        }
      }
    }
  }
  
  /**
   * @todo
   */
  function form_alter(&$form, &$form_state) { 
  	// Nothing to do here.
  }
  
  /**
   * @todo
   */
  function form_validate($form, &$form_state) { 
    foreach ($this->variables_get() as $name) {
      $this->backup($name, variable_get($name));
    }
  }
  
  /**
   * @todo
   */
  function form_submit($form, &$form_state) {
    foreach ($this->variables_get() as $name) {
      $this->template->settings[$name] = variable_get($name);
      
      variable_set($name, $this->backup($name));
    }
  }
}