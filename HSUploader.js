/************************************************************************/
/* Writersky Drag and Drop uploader                                     */
/*                                                                      */
/* @author  Harris Wong                                                 */
/* @date    May 5th, 2013                                               */
/************************************************************************/
// $Id: Heartstring.js 195 2012-07-07 22:57:41Z harris $
Heartstring.HSUploader = Heartstring.HSUploader || {};

/**
* component code
*/
Heartstring.HSUploader = function (container, config) {
    var that = Heartstring.init(Heartstring.HSUploader, config);
    that.container = container;
    
    /**
     * Bind toggler
     */
    that.bindDrop = function (that) {
        Heartstring.select(that.container).bind('drop', function(e) {
            //TODO: Disable dropbox
            e.preventDefault();
            var formData = new FormData();
            formData.append('file', e.originalEvent.dataTransfer.files[0]);
            
            $.ajax({
                url: that.config.uploadReceiver,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST'
            }).done(function(data) {
                Heartstring.select(that.container).removeClass(that.config.styles.dragenter);
            });
        });
    };
    
    /**
     * Drag over 
     */
    that.bindDragOver = function (that) {
        Heartstring.select(that.container).bind('dragover', function(e) {
            e.preventDefault();
        });
    };
    
    /**
     * Drag enter - apply dash borders and opacity
     */
    that.bindDragEnter = function (that) {
        Heartstring.select(that.container).bind('dragenter', function(e) {
            Heartstring.select(that.container).addClass(that.config.styles.dragenter);
        });
    };
    /**
     * Drag leave - remove dash border and opacity
     */
    that.bindDragLeave = function (that) {
        Heartstring.select(that.container).bind('dragleave dragend', function(e) {
            Heartstring.select(that.container).removeClass(that.config.styles.dragenter);
        });
    };
    
    return that;
}

/**
* Content init
*/
Heartstring.HSUploader.init = function(container, config) {
    // create this component
    var that = Heartstring.HSUploader(container, config);
    
    // Bind events
    Heartstring.HSUploader.bind(that);
};

Heartstring.HSUploader.bind = function(that) {
    that.bindDrop(that);
    that.bindDragOver(that);
    that.bindDragEnter(that);
    that.bindDragLeave(that);
}

//default settings for this component
Heartstring.HSUploader.defaults = {
    container: "ws-upload",
    config: {
        selectors: {
        },
        styles: {
            dragenter: 'ws-uploader-dragenter'
        },
        uploadReceiver: ''
    }
};