<?php

function inside_story_breadcrumb($variables) {
    $breadcrumb = $variables['breadcrumb'];
    if (!empty($breadcrumb)) {
        // Adding the title of the current page to the breadcrumb.

        if (preg_match('/>' . addcslashes(drupal_get_title(), "/") . '</', $breadcrumb[count($breadcrumb) - 1])) {
            array_pop($breadcrumb);
        }
        $breadcrumb[] = "<a href='#content' class='current-page'>" . drupal_get_title() . "</a>";


        // Provide a navigational heading to give context for breadcrumb links to
        // screen-reader users. Make the heading invisible with .element-invisible.
        $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';

        $output .= '<div class="breadcrumb">' . implode(' / ', $breadcrumb) . '</div>';
        return $output;
    }
}

function inside_story_phptemplate_variables($hook, $vars) {
  switch ($hook) {
    case 'page':
      // If the page was requested with the jQuery ajax functionalities, an HTTP header (X-Requested-With: XMLHttpRequest) 
      // will be sent to the server, making it possible to identify if we should serve the content as JSON
      if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && 'xmlhttprequest' == strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])) {
          // Now that we know that the page was requested via remote scripting (AJAX) we can serve the content as JSON
          // by telling Drupal to use a different template for the page (in this case page-json.tpl.php)
          $vars['template_files'] = is_array($vars['template_files']) ? $vars['template_files'] : array();
          $vars['template_files'][] = 'page-json';
      }
      break;
  }
}

?>
