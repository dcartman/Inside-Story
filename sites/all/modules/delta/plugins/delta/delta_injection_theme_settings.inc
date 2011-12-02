<?php

class delta_injection_theme_settings extends delta_injection {
  /**
   * @todo
   */
  function variables_get() {
    return array('theme_' . $this->template->theme . '_settings');
  }

  /**
   * @todo
   */
  function inject() {
    $cache = &drupal_static('theme_get_setting');
    $cache[$this->template->theme] = NULL;
    
    parent::inject();
  }
  
  /**
   * @todo
   */
  function revoke() {
    $cache = &drupal_static('theme_get_setting');
    $cache[$this->template->theme] = NULL;
    
    parent::revoke();
  }
}