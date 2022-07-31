'use strict';
// remove 함수 IE 지원하지 않는 문제 -> remove polyfill 로직 추가
if ( !( 'remove' in Element.prototype ) ) {
    Element.prototype[ 'remove' ] = function () {
        if ( this.parentNode ) {
            this.parentNode.removeChild( this )
        }
    }
}
// remove 함수 IE 지원하지 않는 문제 -> remove polyfill 로직 추가
 
let fileAddFn = ( function() {
    let uploadParent = document.querySelector( '.upload_file_wrap' ),
        uploadBtn    = document.querySelector( '.upload_btn' ),
        fileCnt      = document.querySelector( '.file_cnt' ),
        fileSize     = document.querySelector( '.file_size' );
     
    let fileName         = null;
 
    let maxCnt          = 0,
        maxSize         = 0,
        cnt             = 0,
        fileSizeVal     = 0,
        filePlusSizeVal = 0,
        fileResultSize  = 0;
 
    let setting = {
        setAttributes : function ( el, attrs ) {
            for ( let key in attrs ) {
                el.setAttribute( key, attrs[ key ] );
            }
        },
        // 사이즈 변환
        formatBytes : function ( bytes ) {
            let decimals = 2;
 
            if (bytes === 0) return '0 KB';
 
            const   k     = 1024,
                    dm    = decimals < 0 ? 0 : decimals,
                    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
 
            const i = Math.floor(Math.log(bytes) / Math.log(k));
 
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },
        // //사이즈 변환
        elementCreate : function( e, file ) {
            let inputWrapDivEl = document.createElement( 'div' ),
                inputEl        = document.createElement( 'input' ),
                closeBtnEl     = document.createElement( 'button' ),
                spanSizeEl     = document.createElement( 'span' );
 
            fileSizeVal        = setting.formatBytes(file.size);
 
            setting.setAttributes( inputWrapDivEl, { 'class': 'upload_file_add' } );
            uploadParent.appendChild( inputWrapDivEl );
 
            setting.setAttributes( inputEl, { 'class': 'upload_file', 'type': 'text', 'readonly': 'readonly', 'value': file.name, 'data-size': file.size } );
            inputWrapDivEl.appendChild( inputEl );
 
            setting.setAttributes( spanSizeEl, { 'class': 'size' } );
            spanSizeEl.appendChild(document.createTextNode( fileSizeVal ) );
            inputWrapDivEl.appendChild( spanSizeEl );
            setting.setAttributes( closeBtnEl, { 'class': 'close_btn', 'type': 'button' } );
             
            closeBtnEl.appendChild(document.createTextNode('X'));
            inputWrapDivEl.appendChild( closeBtnEl );
        },
        handleFiles : function () {
            const fileList = this.files;
            let outputFile = uploadBtn.files[0] !== undefined ? uploadBtn.files[0] : '';
 
            return outputFile;
        },
        elementRemove : function ( e ) {
            let thisEvent    = e.target;
            let thisFileDataSize = Number( thisEvent.previousElementSibling.previousElementSibling.getAttribute( 'data-size' ) );
 
            filePlusSizeVal = filePlusSizeVal - thisFileDataSize;
            fileResultSize  = setting.formatBytes( filePlusSizeVal );
 
            thisEvent.parentNode.remove();
 
            //fileResultSize = fileResultSize.replace('Bytes','KB');
             
            fileCnt.innerHTML  = Number( --cnt );
            fileSize.innerHTML = fileResultSize;
        },
        getFile : function( e ) {
            let getFileInfo = setting.handleFiles();
            maxCnt  = 5,
            maxSize = 50 * 1024 * 1024; // 50MB
 
            if ( getFileInfo === '') return;
            else {
                if ( Number( filePlusSizeVal + getFileInfo.size ) > maxSize ) { return alert('파일첨부는 최대 50MB까지 가능 합니다.'); }
                else if ( cnt >= maxCnt ) { return alert('파일첨부는 최대 5개까지 가능합니다.'); }
                else {
                    filePlusSizeVal = filePlusSizeVal !== 0 ? ( Number(filePlusSizeVal) + Number(getFileInfo.size) ) : Number(getFileInfo.size);
                     
                    if ( cnt < maxCnt && getFileInfo.size < maxSize && filePlusSizeVal < maxSize ) {
                        setting.elementCreate( e, getFileInfo );
                        fileResultSize = setting.formatBytes(filePlusSizeVal);
 
                        if ( filePlusSizeVal < maxSize ) {                      
                            fileCnt.innerHTML  = Number( ++cnt );
                            fileSize.innerHTML = fileResultSize;
                            return;
                        }
                    }
                    else if ( getFileInfo.size > maxSize || filePlusSizeVal > maxSize ) { return alert('파일첨부는 최대 50MB까지 가능 합니다.'); }
                }
            }
        },
        eventList : function() {
            document.addEventListener( 'change', function(e) {
                let targetName = e.target.className;
 
                switch (targetName) {
                    case 'upload_btn':
                        setting.getFile( e );
                        break;
                    default:
                        break;
                }
            } );
            document.addEventListener( 'click', function(e) {
                for ( let i in e.target.classList ) {
                    if ( e.target.classList[i] === 'close_btn' ) setting.elementRemove( e );
                    else return;
                }
            } );
        },
    }
    window.setting = setting; //전역스코프에 setting라는 전역변수로 할당
    setting.eventList();
} );
 
window.addEventListener( 'load', function () { fileAddFn(); } );