<?php

if ($messages) $content = $messages.$content;
print drupal_to_js($page['content']);
?>
