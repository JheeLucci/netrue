	
/**
 * 공통으로 사용되는 함수를 가진 js 
*/

//20160609 Jhee 4가지 특수기호($,&,',")를 입력하지 못하도록 제어하는 함수
// -> footer에도 동일 기능을 하는 함수가 있으나, ajax통신이후 입력태그를 그릴 때에는 footer의 함수가 동작하지 않기 때문에 별도의 공통함수를 생성함
// -> 함수 실행 태그에는 다음과 같이 event를 준다.(무조건 down과 up모두를 주어야 함) [onkeydown="return spChk($(this))" onkeyup="return spChk($(this))"]
function spChk(id) {
	var re = /[$&"']/gi;
	var temp = id.val();
	var realId = id.attr('id');
	
	if(re.test(temp)){ 
		$('#'+realId).val(temp.replace(re,"")); //특수문자가 포함되면 삭제
		return false;
	}
	
	return true;
}

//20160609 Jhee 4가지 특수기호($,&,',")가 입력되었는지 저장시 체크하는 함수
function saveSpChk(spVal) {
	var re = /[$&"']/gi;
	
	var temp = spVal;
	//****해당 함수를 사용하기 위해서는, 사용될 페이지에 overSp라는 전역변수가 필수로 있어야 함!!****
	overSp = false; //for문을 돌면서 항목 하나하나에 대한 overSp를 체크할 경우에는 변수 초기화가 필요
	//****해당 함수를 사용하기 위해서는, 사용될 페이지에 overSp라는 전역변수가 필수로 있어야 함!!****
	
	if(re.test(temp)){ 
		overSp = true;
	}
}


//20160607 Jhee byte길이 체크 함수
function chkByte(msg, maxSize) {
	//****해당 함수를 사용하기 위해서는, 사용될 페이지에 overByte라는 전역변수가 필수로 있어야 함!!****
	overByte = false; //for문을 돌면서 항목 하나하나에 대한 overByte를 체크할 경우에는 변수 초기화가 필요
	//****해당 함수를 사용하기 위해서는, 사용될 페이지에 overByte라는 전역변수가 필수로 있어야 함!!****
	
	var nbytes = 0;
	
	for (i=0; i<msg.length; i++) {
		var ch = msg.charAt(i);
		
		if(escape(ch).length > 4) {
			nbytes += 2;
		} else if (ch == '\n') {
			if (msg.charAt(i-1) != '\r') {
			nbytes += 1;
			}
		} else if (ch == '<' || ch == '>') {
			nbytes += 4;
		} else {
			nbytes += 1;
		}
	}
	
	if(maxSize == null || maxSize == '' || maxSize == 0) {
		maxSize = 3950;
	}
	
	//입력된 데이터의 길이가 maxSize를 초과할 경우 저장불가
	if(Number(nbytes) >= maxSize) {
		overByte = true;
	}
}

/****************************************************
tbl      : 병합할 대상 table object
startRow : 병합 시작 row, title 한 줄일 경우 1
cNum     : 병합 실시할 컬럼번호, 0부터 시작
length   : 병합할 row의 길이, 보통 1
add      : 비교할 기준에 추가할 컬럼번호
          A | 1
          B | 1
         을 서로 구분하고 싶다면, add에 0번째
         컬럼을 추가
*****************************************************/
function mergeCell(tbl, startRow, cNum, length, add) {
	var isAdd = false;
	if(tbl == null) return;
	if(startRow == null || startRow.length == 0) startRow = 1;
	if(cNum == null || cNum.length == 0) return ;
	
	if(add  == null || add.length == 0) {
	    isAdd = false;
	} else {
	    isAdd = true;
	    add   = parseInt(add);
	}
	cNum   = parseInt(cNum);
	length = parseInt(length);
	
	rows   = tbl.rows;
	rowNum = rows.length;
	
	tempVal  = '';
	cnt      = 0;
	startRow = parseInt(startRow);
	
	for( i = startRow; i < rowNum; i++ ) { 
	    curVal = rows[i].cells[cNum].innerHTML;
	    if(isAdd) curVal += rows[i].cells[add].innerHTML;
	    if( curVal == tempVal ) {
	        if(cnt == 0) {
	            cnt++;
	            startRow = i - 1;
	        }
	        cnt++;
	    } else if(cnt > 0) {
	        merge(tbl, startRow, cnt, cNum, length);
	        startRow = endRow = 0;
	        cnt = 0;
	    }
	    
	    tempVal = curVal;
	}
	
	if(cnt > 0) {
	    merge(tbl, startRow, cnt, cNum, length);
	}
}

/*******************************************
mergeCell에서 사용하는 함수
********************************************/
function merge(tbl, startRow, cnt, cellNum, length) {
	rows = tbl.rows;
	row  = rows[startRow];
	
	for( i = startRow + 1; i < startRow + cnt; i++ ) {
	    for( j = 0; j < length; j++) {
	        rows[i].deleteCell(cellNum);
	    }
	}
	
	for( j = 0; j < length; j++) {
	    row.cells[cellNum + j].rowSpan = cnt;
	}
}

//[base64암호화(20170613 Jhee) -----------------------------------------------------
var Base64 = {
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}

}

//[base64암호화 fnc(20170613 Jhee) ----------------------
function chgBase64(type, obj) {
    if(type == 'encode') {
    	return Base64.encode( obj );
    } else if(type == 'decode'){
    	return Base64.decode( obj );
    } 
}
//base64암호화 fnc(20170613 Jhee)] ----------------------
//base64암호화(20170613 Jhee)] -----------------------------------------------------