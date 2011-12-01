(function($) {
    // cast profiles
    $(document).ready(function() {
        $('.modal-link').each(function(i,e) {
            ActivateModal.processModal(e, { 
                "urlModifier": "/feed",
                "selector": ".modal-dialog-box",
                "path_to_theme":'/sites/all/themes/inside_story',
                "dataType": "XML",
                "callback": function(data,t,XHR) {
                    var me = this,
                    title = "<span class='title-text'>"+ jQuery(data).find('item title').first().text() +"</span>",
                    content = jQuery(data).find('item description').first().text();
                    if(!content) content = jQuery(data).filter('item description').first().text();
                    
                    var role = jQuery(content).filter('.field-name-field-film-role').first().text(),
                        image = "<span class='title-image'>"+ this.makeImage(role) +"</span>";
    
                    this.modalContent.html(content);
                    this.modalContent.ready(function() {
                        me.openContent();
                    });
    
                    this.modalContent.find('.field-name-field-film-role').after("<div class='field-name-title'>"+ title + image +"</div>");
                }
            });
        }) 
    });
    // the science play-by-play
    $(document).ready(function() {
        $('.view-display-id-the_science_cast_previews_block .views-row .node').each(function(i,e) {
            ActivateModal.processModal(e, { 
                "urlModifier": "/feed",
                "selector": ".modal-dialog-box",
                "path_to_theme":'/sites/all/themes/inside_story',
                "dataType": "XML",
                "callback": function(data,t,XHR) {
                    var me = this,
                    title = "<span class='title-text'>"+ jQuery(data).find('item title').first().text() +"</span>",
                    content = jQuery(data).find('item description').first().text();
                    if(!content) content = jQuery(data).filter('item description').first().text();
    
                    this.modalContent.html(content);
                    this.modalContent.ready(function() {
                        me.openContent();
                    });
    
                    this.modalContent.find('.field-name-field-film-role').after("<div class='field-name-title'>"+ title +"</div>");
                }
            });
        }) 
    });
    // slideshow
    $(document).ready(function() {
        $('.node-slideshow-image').each(function(i,e) {
            ActivateModal.processModal(e, { 
                "selector": ".modal-dialog-box",
                "path_to_theme":'/sites/all/themes/inside_story',
                "url":"?q=behind-the-scenes/images.xml", 
                "dataType": "XML",
                "afterClose": function() {
                    this.modalContent.cycle('destroy');
                    this.container.find('.pager').html("");
                },
                "callback": function(data,t,XHR) {
                    var me = this
                        StartingSlide = 0
                        items = jQuery(data).find('item');
                    if(items.length == 0) items = jQuery(data).filter('item');
                     
                    items.each(function(i,e) {

                        var title = "<div class='title-text'>"+ jQuery(e).find('title').text() +"</div>",
                            content = jQuery(e).find('description').first().text(),
                            slide = jQuery("<div class='slide'>"+ content +"</div>");
                        
                        // slide.find('.field-name-body').before(title);
                        
                        if(jQuery(e).text().match(me.nodeHref)) StartingSlide = i;

                        me.modalContent.append(slide);
                        
                    });
                    
                    this.modalContent
                        .after('<div class="next-slide button">&nbsp;</div>')
                        .after('<div class="prev-slide button">&nbsp;</div>')
                        .after('<div class="pager clearfix"></div>');
                    
                    this.modalContent.cycle({ 
                        containerResize: true,
                        fx:    'fade', 
                        next: this.container.find('.next-slide.button'),
                        pager: this.container.find('.pager'),
                        pause: true,
                        pauseOnPagerHover: true,
                        prev: this.container.find('.prev-slide.button'),
                        speed:  1000,
                        startingSlide: StartingSlide,
                        timeout: 7000
                    });
                    
                    this.modalContent.cycle('pause');
                    
                    this.modalContent.ready(function() {
                        me.openContent();
                    });
                    
                }
            });
        }) 
    });
    
})(jQuery)
/*
jQuery.ajax({ 
    "url":"?q=views/ajax", 
    "data": {
        "view_name":"behind_scenes_slideshow_view",
        "view_display_id":"behind_the_scenes_slideshow_block",
        "view_args": "",
        "view_path":node/14,
        "view_base_path":null,
        "view_dom_id":2,
        "pager_element":0,
        "page":1
    } 
});
 */


/**
 * Modal for displaying Ajaxy content
 * <div class="modal-dialog-box"><div class="box-container"><div class="button close"></div><div class="modal-content"></div></div></div>
 */
function ActivateModal(ele, h) {
    var me = this,
    h = h || {};
    
    for(var p in h) {
        if(h.hasOwnProperty(p)) {
            this[p] = h[p];
        }
    }
    
    this.element = ele;
    this.element.object = this;
    jQuery(this.element).addClass('modal-link');
    
    this.callback = this.callback || function() {};
    this.urlModifier = this.urlModifier || "";
    
    this.nodeHref = this.getNodeHref();
    this.nodeId = this.getNodeId();
    
    this.setUrl();
    this.data = this.data || ""
    this.dataType = this.dataType || "html"
    
    this.modal = jQuery(this.selector);

    this.container = this.modal.find('.box-container');
    
    this.closeButton = this.modal.find('.close.button');
    
    this.modalContent = this.modal.find('.modal-content');
    
    this.setListeners();
    
    
}

ActivateModal.processModal = function(ele, h) {
    var h = h || {},
    modal = new ActivateModal(ele, h);
}

ActivateModal.prototype.setUrl = function() {
    this.url = this.url || jQuery(this.element).find('h2 a').attr('href') + this.urlModifier;
    if(!this.url.match("q=")) this.url = "?q=" + this.url;
    
}

ActivateModal.prototype.loadData = function(event) {
    var ele = event.currentTarget || event.srcElement,
    me = ele.object;
    jQuery.ajax({
        url: me.url,
        context: me,
        data: me.data,
        dataType: me.dataType,
        success: me.processData,
        error: me.showError
    })    
    me.openModal('loading');
        
}

ActivateModal.prototype.openModal = function(content) {
    this.modal.fadeIn(300);
// this.addDocumentListeners();
}

ActivateModal.prototype.closeModal = function() {
    this.modal.fadeOut(300);
}

ActivateModal.prototype.openContent = function(content) {
    this.container.fadeIn(300);
}

ActivateModal.prototype.closeContent = function() {
    this.container.fadeOut(300);
    this.closeModal();
    this.modalContent.html('');
    if(typeof(this.afterClose) == "function") this.afterClose.call(this);
}

ActivateModal.prototype.setListeners = function() {
    var me = this;
    jQuery(this.element).click(me.loadData);
    jQuery(this.element).find('a').click(function(e) { 
        e.preventDefault();
        return false; 
    });
    jQuery(this.closeButton).click(function() {
        me.closeContent();
    })
}

ActivateModal.prototype.addDocumentListeners = function() {
    var me = this;
    jQuery(document)
    .click(function(event) {
        if (!jQuery(event.target).is(me.modal)) {
            me.closeModal();
        }
    });
}

ActivateModal.prototype.removeDocumentListeners = function() {
    jQuery(document).unbind("click");
}

ActivateModal.prototype.makeImage = function(role) {
    return "<img src='"+ this.path_to_theme +"/images/text/"+ role.toLowerCase() +".png' />";
}

ActivateModal.prototype.processData = function(data, textStatus, jqXHR) {
    var me = this;
    if(typeof(this.callback) == "function") this.callback.call(this, data, textStatus, jqXHR);
}

ActivateModal.prototype.showError = function(jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log(textStatus);
    console.log(jqXHR);
}

ActivateModal.prototype.getNodeId = function(href) {
    var me = this,
        href = href || this.nodeHref,
        id = href.split('/').pop();
    
    return (id.match(/\d/g).length == id.length) ? id : null;
}

ActivateModal.prototype.getNodeHref = function() {
    var me = this,
        href = href = jQuery(this.element).find('h2 a').attr('href');
        return href.split('=').pop();
}


