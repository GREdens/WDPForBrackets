/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

define(function (require, exports, module) {
    'use strict';
    
    var MODULE_NAME                     = 'mendix.codesnippets',
        
        WorkspaceManager                = brackets.getModule('view/WorkspaceManager'),
        FileSystem                      = brackets.getModule('filesystem/FileSystem'),
        FileUtils                       = brackets.getModule('file/FileUtils'),
        
        MendixWorkshopManager           = require('lib/MendixWorkshopManager'),
        MendixCodeManager               = require('lib/MendixCodeManager');
    
    var MendixWorkspaceManager = {
        
        panel : null,
        iframeDoc : null,
        
        alterNoFilePanel : function () {
            var mendixLogo = $('<img>');
            mendixLogo.attr('src', require.toUrl('img/mendix_app.png'));
            $('.pane-content').children().before('<div class="mx-mendix-logo-mid" style="position: absolute;left: 50%;margin-left: -140px;top: 50%;width:280px;height:111px;"></div>');
            $('.mx-mendix-logo-mid').append(mendixLogo);
        },
        
        getStyleRules : function (className_) {

            var styleSheets = null,
                styleSheetsLength = null,
                classes = null,
                classesLength = null,
                i = 0,
                x = 0;
            
            styleSheets = MendixWorkspaceManager.iframeDoc;
            styleSheetsLength = styleSheets.length;
            
            for(i = 0; i < styleSheetsLength; i++){
                classes = styleSheets[i].rules || styleSheets[i].cssRules;
                classesLength = classes.length;
                for (x = 0; x < classesLength; x++) {
                    if (classes[x].selectorText == className_) {
                        if(classes[x].cssText){
                            return classes[x].cssText;
                        } else {
                            return classes[x].style.cssText;
                        }
                    }
                }
            }

        },
        
        readInterface : function(){
        
            function GetDoc(x) {
                return x.contentDocument || x.contentWindow.document;
            }
            
            var cssTheme,
                iframe = null,
                iframeDoc = null,
                body = null,
                divs = null,
                i = 0,
                html = '<ul>';
            
            iframe = document.getElementById('mx_coder_iframe');
            iframeDoc = GetDoc(iframe);
            MendixWorkspaceManager.iframeDoc = iframeDoc;

            /*
            body = iframeDoc.getElementsByTagName('body')[0]; 
            body.innerHTML = body.innerHTML + '<script>alert("hi!");</script>';
            */

            divs = MendixWorkspaceManager.iframeDoc.getElementsByTagName('div');
        
            for( i = 0; i < divs.length ; i++) {
                html += '<li class="mx-layer"><table><tr><td class="mx-layer-show"><i class="fa fa-eye"></i></td><td class="mx-layer-select"><i class="fa fa-square-o"></i></td><td>' + divs[i].className + '</td></tr></table></li>';
            }
            
            $('.mx-coder-layers').html('');
            $('.mx-coder-layers').html(html);
        },
        
        /**
         *
         */
        panelResizer : function () {
            
            $('#mendix_panel').on("panelResizeStart", function (evt, width) {
            });

            $('#mendix_panel').on("panelResizeUpdate", function (evt, width) {
                $('.mx-tab-content').each(function (index, node) {
                    $(node).css('height', $('#mendix_panel').height() - 25 + 'px');
                });
            });

            $('#mendix_panel').on("panelResizeEnd", function (evt, width) {
                $('.mx-tab-content').each(function (index, node) {
                    $(node).css('height', $('#mendix_panel').height() - 25 + 'px');
                });
            });
            
        },
        
        panelNavigation : function () {

            $('#mx_coder_refresh').on('click', MendixCodeManager.refreshMendix);
            $('#mx_coder_show').on('click', function () {
                $('.mx-tab-content.coder').removeClass('mx-hidden');
                $('.mx-tab-content.snippets').addClass('mx-hidden');
                $('.mx-tab-buttons.coder').removeClass('mx-hidden');
                $('.mx-tab-buttons.snippets').addClass('mx-hidden');
                MendixWorkspaceManager.readInterface();
            });
            $('#mx_snippets_show').on('click', function () {
                $('.mx-tab-content.coder').addClass('mx-hidden');
                $('.mx-tab-content.snippets').removeClass('mx-hidden');
                $('.mx-tab-buttons.coder').addClass('mx-hidden');
                $('.mx-tab-buttons.snippets').removeClass('mx-hidden');
            });
            
            $('.mx-tab-content').each(function (index, node) {
                $(node).css('height', $('#mendix_panel').height() - 25 + 'px');
            });
            
        },
        
        /**
         * Create the actual panel with code snippets.
         */
        createPanel : function () {

            this.panel = WorkspaceManager.createBottomPanel(MODULE_NAME, $('<div id="mendix_panel" class="bottom-panel mx-code-snippets">' +
                '<div id="mendix_coder_panel" class="mx-coder">' +
                    '<div class="mx-tab-buttons coder mx-hidden" id="mx_coder_buttons">' +
                        '<div class="mx-coder-top"><div class="btn btn-small" id="mx_snippets_show"><i class="fa fa-file-text-o"></i></div><div class="btn btn-small" id="mx_coder_refresh"><i class="fa fa-refresh fa-1"></i></div></div>' +
                    '</div>' +
                    '<div class="mx-tab-buttons snippets" id="mx_coder_buttons">' +
                        '<div class="mx-coder-top"><div class="btn btn-small" id="mx_coder_show"><i class="fa fa-code"></i></div></div>' +
                    '</div>' +
                '</div>' +
                '<div class="mx-tab-content coder mx-hidden">' +
                    '<div id="content" class="mx-coder-iframe-container" name="coder' + Date.now() + '"><iframe src="http://localhost:8080/" frameborder="0" class="mx-coder-iframe" id="mx_coder_iframe"></iframe></div>' +
                    '<div id="content" class="mx-coder-layers" name="layers' + Date.now() + '"></div>' +
                '</div>' +
                '<div class="mx-tab-content snippets">' +
                    '<div class="mx-code-snippets-content-container"></div>' +
                '</div>' + '</div>'), 150);
        }
        
    };

    module.exports = MendixWorkspaceManager;
});