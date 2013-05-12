/************************************************************************/
/* Writersky Drag and Drop uploader                                     */
/*                                                                      */
/* @author  Harris Wong                                                 */
/* @date    May 5th, 2013                                               */
/************************************************************************/

Heartstring.HSUploader = Heartstring.HSUploader || {};

/**
* component code
*/
Heartstring.HSUploader = function (container, config) {
    var that = Heartstring.init(Heartstring.HSUploader, config);
    that.container = container;
    
    /**
     * Handle uploads from drag and drop/file select, then fire ajax to upload file.
     * @param   Object      $that   
     * @param   Array       $files      The FileUpload object list from browser.
     */
    that.handleUploads = function (that, files) {
        var formData = new FormData();
        for (var i = 0, file; file = files[i]; i++) {
            /* Although we can do files[0], but Firefox will give us permission denied.
             * we need to go through its iterator to retrieve the info.
             */
            formData.append('file', file);
        }
        formData.append('token', Heartstring.select(that.config.selectors.token).val());
        
        $.ajax({
            url: that.config.uploadReceiver,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        }).done(function(response) {
            console.log(response);
            Heartstring.select(that.container).removeClass(that.config.styles.dragenter);
            Heartstring.select(that.config.selectors.token).val(response.token);
            //Handle user defined function.
            that.config.callback(that, response);
        });
    }
    
    /**
     * Bind toggler
     */
    that.bindDrop = function (that) {
        Heartstring.select(that.container).bind('drop', function(e) {
            //TODO: Disable dropbox
            e.preventDefault();
            console.log(e, e.originalEvent.dataTransfer);
            that.handleUploads(that, e.originalEvent.dataTransfer.files);
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
        console.log('drag enter', e);
            Heartstring.select(that.container).addClass(that.config.styles.dragenter);
        });
    };
    /**
     * Drag leave - remove dash border and opacity
     */
    that.bindDragLeave = function (that) {
        Heartstring.select(that.container).bind('dragleave dragend', function(e) {
        console.log('drag leave', e);
            Heartstring.select(that.container).removeClass(that.config.styles.dragenter);
        });
    };
    
    /**
     * Bind the <input type="file"> uploader
     */
    that.bindFileInput = function (that) {
        Heartstring.select(that.config.selectors.fileUploadInput).bind('change', function(e) {
            console.log('upload manually', e);
            that.handleUploads(that, e.target.files);
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
    that.bindFileInput(that);
}

//default settings for this component
Heartstring.HSUploader.defaults = {
    container: "ws-upload",
    config: {
        selectors: {
            token: '',
            fileUploadInput: ''
        },
        styles: {
            dragenter: 'ws-uploader-dragenter'
        },
        uploadReceiver: '',
        callback: function(that, response){}
    }
};