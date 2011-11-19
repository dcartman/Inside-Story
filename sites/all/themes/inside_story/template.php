<?php

function inside_story_breadcrumb($variables) {
    $breadcrumb = $variables['breadcrumb'];
    if (!empty($breadcrumb)) {
        // Adding the title of the current page to the breadcrumb.

        if (preg_match('/>' . drupal_get_title() . '</', $breadcrumb[count($breadcrumb) - 1])) {
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

?>
