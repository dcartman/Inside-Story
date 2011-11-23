(function($) {
    $(document).ready(function() {
        $('.modal-link').each(function(i,e) {
            ActivateModal.processModal(e, { 
                "selector": ".modal-dialog-box"
            });
        }) 
    });
    
})(jQuery)

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
    
    this.url = jQuery(this.element).find('h2 a').attr('href') + "/rss.xml";
    
    this.modal = jQuery(this.selector);
    
    this.closeButton = this.modal.find('.close.button');
    
    this.modalContent = this.modal.find('.modal-content');
    
    this.setListeners();
    
    
}

ActivateModal.processModal = function(ele, h) {
    var h = h || {},
    modal = new ActivateModal(ele, h);
}

ActivateModal.prototype.loadData = function(event) {
    var ele = event.currentTarget || event.srcElement,
    me = ele.object;
    jQuery.ajax({
        url: me.url,
        context: me,
        success: me.processData,
        error: me.showError
    })    
    me.openModal('loading');
        
}

ActivateModal.prototype.openModal = function(content) {
    this.modalContent.html(content);
    this.modal.show();
    // this.addDocumentListeners();
}

ActivateModal.prototype.closeModal = function() {
    // this.removeDocumentListeners();
    this.modal.hide();
    this.modalContent.html("");
}

ActivateModal.prototype.setListeners = function() {
    var me = this;
    jQuery(this.element).click(me.loadData);
    jQuery(this.element).find('a').click(function(e) { 
        e.preventDefault();
        return false; 
    });
    jQuery(this.closeButton).click(function() { me.closeModal(); })
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

ActivateModal.prototype.processData = function(data, textStatus, jqXHR) {
    console.log(data);
    console.log(textStatus);
    console.log(jqXHR);
    var title = jQuery(data).find('item title').first().text();
    this.modalContent.html(jQuery(data).find('item description').first().text());
    this.modalContent.find('.field-name-field-film-role').after("<div class='field-name-title'>"+title+"</div>");
}

ActivateModal.prototype.showError = function(jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
    console.log(textStatus);
    console.log(jqXHR);
}


