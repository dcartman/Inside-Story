<?php
/**
 * @file
 * Default theme implementation to display a node.
 *
 * Available variables:
 * - $title: the (sanitized) title of the node.
 * - $content: An array of node items. Use render($content) to print them all,
 *   or print a subset such as render($content['field_example']). Use
 *   hide($content['field_example']) to temporarily suppress the printing of a
 *   given element.
 * - $user_picture: The node author's picture from user-picture.tpl.php.
 * - $date: Formatted creation date. Preprocess functions can reformat it by
 *   calling format_date() with the desired parameters on the $created variable.
 * - $name: Themed username of node author output from theme_username().
 * - $node_url: Direct url of the current node.
 * - $display_submitted: Whether submission information should be displayed.
 * - $submitted: Submission information created from $name and $date during
 *   template_preprocess_node().
 * - $classes: String of classes that can be used to style contextually through
 *   CSS. It can be manipulated through the variable $classes_array from
 *   preprocess functions. The default values can be one or more of the
 *   following:
 *   - node: The current template type, i.e., "theming hook".
 *   - node-[type]: The current node type. For example, if the node is a
 *     "Blog entry" it would result in "node-blog". Note that the machine
 *     name will often be in a short form of the human readable label.
 *   - node-teaser: Nodes in teaser form.
 *   - node-preview: Nodes in preview mode.
 *   The following are controlled through the node publishing options.
 *   - node-promoted: Nodes promoted to the front page.
 *   - node-sticky: Nodes ordered above other non-sticky nodes in teaser
 *     listings.
 *   - node-unpublished: Unpublished nodes visible only to administrators.
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 *
 * Other variables:
 * - $node: Full node object. Contains data that may not be safe.
 * - $type: Node type, i.e. story, page, blog, etc.
 * - $comment_count: Number of comments attached to the node.
 * - $uid: User ID of the node author.
 * - $created: Time the node was published formatted in Unix timestamp.
 * - $classes_array: Array of html class attribute values. It is flattened
 *   into a string within the variable $classes.
 * - $zebra: Outputs either "even" or "odd". Useful for zebra striping in
 *   teaser listings.
 * - $id: Position of the node. Increments each time it's output.
 *
 * Node status variables:
 * - $view_mode: View mode, e.g. 'full', 'teaser'...
 * - $teaser: Flag for the teaser state (shortcut for $view_mode == 'teaser').
 * - $page: Flag for the full page state.
 * - $promote: Flag for front page promotion state.
 * - $sticky: Flags for sticky post setting.
 * - $status: Flag for published status.
 * - $comment: State of comment settings for the node.
 * - $readmore: Flags true if the teaser content of the node cannot hold the
 *   main body content.
 * - $is_front: Flags true when presented in the front page.
 * - $logged_in: Flags true when the current user is a logged-in member.
 * - $is_admin: Flags true when the current user is an administrator.
 *
 * Field variables: for each field instance attached to the node a corresponding
 * variable is defined, e.g. $node->body becomes $body. When needing to access
 * a field's raw values, developers/themers are strongly encouraged to use these
 * variables. Otherwise they will have to explicitly specify the desired field
 * language, e.g. $node->body['en'], thus overriding any language negotiation
 * rule that was previously applied.
 *
 * @see template_preprocess()
 * @see template_preprocess_node()
 * @see template_process()
 */
?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?> clearfix"<?php print $attributes; ?>>

    <?php print $user_picture; ?>

    <div class="blog-date"><?php print $date; ?></div>

    <div class="blog-meta clearfix">
        <?php print render($content['field_blog_category']); ?>
        <?php print render($content['field_tags']); ?>
        <span class="field contributor">
            <span class="field-label">Contributor:</span> 
            <span class="field-items">
                <span class="field-item"><?php print $name; ?></span>
            </span>
        </span>

    </div>

    <hr class="blog-yellow" />

    <?php print render($title_prefix); ?>

    <?php if (!$page): ?>
        <h2 class="node-title" <?php print $title_attributes; ?>><a href="<?php print $node_url; ?>"><?php print $title; ?></a></h2>    
    <?php else: ?>
        <h1 class="node-title" <?php print $title_attributes; ?>><?php print $title; ?></h1>
    <?php endif; ?>

    <?php print render($title_suffix); ?>

    <div class="content"<?php print $content_attributes; ?>>
        <?php
        hide($content['field_tags']);
        hide($content['field_blog_category']);
        // We hide the comments and links now so that we can render them later.
        hide($content['comments']);
        hide($content['links']);
        print render($content);
        ?>
        <?php if(!$page): ?>
            <span class="read-more blog-links"><a href="?q=<?php print $content['links']['node']['#links']['node-readmore']['href']; ?>"><?php print $content['links']['node']['#links']['node-readmore']['title']; ?></a></span>
        <?php endif; ?>
    </div>

    <?php
    $comments_href = (isset($content['links']['comment']['#links']['comment-comments'])) ?
            $content['links']['comment']['#links']['comment-comments']['href'] :
            "#";
    ?>
    <?php
    $add_comment_href = (isset($content['links']['comment']['#links']['comment-add'])) ?
            $content['links']['comment']['#links']['comment-add']['href'] :
            $node_url."#comment-form";
    ?>


    <div class="blog-comments-share">  
        <span class="list-comments blog-links"><a href="?q=<?php print $comments_href; ?>">(<?php print $comment_count; ?>) Comments</a></span> | 
        <span class="add-comment blog-links"><a href="?q=<?php print $add_comment_href; ?>">Post a Comment</a></span>
    </div>  
    <?php print render($content['comments']); ?>

</div>
