
/**
 * yyyymmdd 형태를 yyyy-mm-dd 형태로 반환
 * @param date
 * @returns String
 */
function changeDateForm(date) {
	
	if (date != null && date.length > 7) {
		var year = date.substring(0, 4);
		var month = date.substring(4, 6);
		var day = date.substring(6, 8);
		
		return year + '-' + month + '-' + day;
	
	} else {
		return null;
	}
}

/**
 * 빈값을 기본값으로..
 * @param {String} str : 입력값
 * @param {String} defaultValue : 기본값(옵션)
 * @return (String) : 체크 결과값
 */
function nvl(str, defaultVal) {
	var defaultValue = "";
	if (typeof defaultVal != 'undefined') defaultValue = defaultVal;
	if (typeof str == "undefined" || str == null || str == '') {
		return defaultValue;
	}
	return str;
}

/**
 * len 보가 큰 값을 자르고 + ...
 * @param {String} str : 입력값
 * @param {String} len : 길이
 * @return (String) : 결과값
 */

function cutString(str, len) {
	var cutStr;
	if (str.length > len) {
		cutStr = str.substr(0, len);
		cutStr += '...';
	} else {
		cutStr = str;
	}
	return cutStr;
}

/*20151113 Jhee 파일명에 날짜 더해주는 함수*/
function setFileName(sName) {
	var dt = new Date();       
	var year =  dt.getFullYear();
	var month = dt.getMonth() + 1;
	var day =   dt.getDate();
	var hour =  dt.getHours();
	var mins =  dt.getMinutes();
 
	var postfix = year.toString() + month.toString() + day.toString();
	var fileName = sName +"_"+ postfix;
   
	return fileName;       
}

/*20151113 Jhee 길이 체크하는 함수*/
function checkString(str, len) {
	if (str.length > len) {
		return false;
	} else {
		return true;
	}
}

/*브라우저 크기 변화 시, 함수 실행 유무를 체크할 변수*/
var resizeCheck = false;

/**
 * 브라우저 크기 변환 시, 크기 값을 체크하는 함수
 * resizeCheck값이 true일 경우, changeClass를 실행한다
 * changeClass는 필요경우에 따라 각 jsp 파일에서 선언. 브라우저 크기 변환 시 객체 css 값 변경하는 함수
 * 
 */
function updWindowSize() {
	var widthWindow = Number(document.documentElement.clientWidth); //window 창 넓이
	var heightWindow = Number(document.documentElement.clientHeight); //window 창 높이 
	
	//footer값은 실시간 반영한다
	changeContentSize();
	
	if (resizeCheck) {
		changeClass(widthWindow,heightWindow);
	}
}

var modalOpenCheck = false;
/**
 * 최대값 체크하는 함수
 * id : 내용체크할 컨트롤의 id
 * title : maxLength가 넘었을 경우 나오는 경고문구
 * maxLength : 최대 수량
 * */
function textMaxLengthCheck(id, title, maxLength) {
	if ($('#' + id).val().length > maxLength) {
		if (modalOpenCheck == false) {
			var modalTitle = title;
			$('#maxCheck_alert').remove();
			
			var html = '';
			html += '<div id="maxCheck_alert" class="modal modal-alert modal-warning fade">';
			html += '	<div class="modal-dialog">';
			html += '		<div class="modal-content">';
			html += '			<div class="modal-header">';
			html += '				<i class="fa fa-warning"></i>';
			html += '			</div>';
			html += '			<div class="modal-title">' + modalTitle + '</div>';
			html += '			<div class="modal-body mt20"></div>';
			html += '			<div class="modal-footer">';
			html += '				<button type="button" class="btn btn-warning maxCheckBtn" data-dismiss="modal">OK</button>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			
			$('body').append(html);
			$('#maxCheck_alert').modal({'backdrop' : 'static'});
			
			modalOpenCheck = true;
			$('.maxCheckBtn').click(function() {
				$('#maxCheck_alert').modal('hide');
				$('#' + id).focus();
				modalOpenCheck = false;
			});
		}
	}
}
