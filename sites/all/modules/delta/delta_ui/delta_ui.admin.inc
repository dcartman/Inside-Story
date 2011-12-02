<?php

/**
 * @file 
 * Delta UI functionality
 */

/**
 * @todo
 */
function delta_ui_layout_configure($form, &$form_state, $template) {
  module_load_include('inc', 'system', 'system.admin');
  
  $backup = $GLOBALS['delta'];

  delta_inject($template);
  
  $form_state['delta'] = $template;
  $form_state['build_info']['args'][0] = $template->theme;
  $form = system_theme_settings($form, $form_state, $template->theme);
  
  foreach (delta_get_plugins($template) as $plugin) {
    $plugin->form_alter($form, $form_state);
  }
  
  $form['delta'] = array(
    '#type' => 'markup',
    '#markup' => '<div class="messages warning">' . t('You are currently editing the Delta template %name. This template operates in %mode mode.', array('%name' => $template->name, '%mode' => ($template->mode == DELTA_PRESERVE ? t('Preserve') : t('Override')))) . '</div>',
    '#weight' => -999,
  );
  
  $form['#validate'][] = 'delta_ui_layout_configure_validate';
  $form['#submit'][] = 'delta_ui_layout_configure_submit';    
  $form['#attributes']['id'] = 'system-theme-settings';
  
  if (isset($backup)) {
    delta_inject($backup);
  }
  else {
    delta_revoke($template);
  }
  
  return $form;
}

/**
 * @todo
 */
function delta_ui_layout_configure_validate($form, &$form_state) {
  foreach (delta_get_plugins($form_state['delta']) as $plugin) {
    $plugin->form_validate($form, $form_state);
  }
}

/**
 * @todo
 */
function delta_ui_layout_configure_submit($form, &$form_state) {
  foreach (delta_get_plugins($form_state['delta']) as $plugin) {
    $plugin->form_submit($form, $form_state);
  }
  
  foreach (delta_get_plugins($form_state['delta']) as $plugin) {
    $plugin->presave($form, $form_state);
  }
  
  ctools_export_crud_save('delta', $form_state['delta']);
}