	
/**
 * 공통 alert js
*/

function yellowAlert(title, message) {
	var modalTitle = title;
	var modalMessage = message;
	if (modalTitle == null || modalTitle == '') {
		modalTitle = '변경된 내용이 없습니다.';
	}
	if (modalMessage == null) {
		modalMessage = '';
	}
	$('#yellow_alert').remove();
	
	var html = '';
	html += '<div id="yellow_alert" class="modal modal-alert modal-warning fade">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<i class="fa fa-warning"></i>';
	html += '			</div>';
	html += '			<div class="modal-title">' + modalTitle + '</div>';
	html += '			<div class="modal-body mt20">' + modalMessage + '</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-warning modalWChkBtn" data-dismiss="modal">OK</button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$('body').append(html);
	$('#yellow_alert').modal({'backdrop' : 'static'});
}

function redAlert(title, message) {
	var modalTitle = title;
	var modalMessage = message;
	if (modalTitle == null || modalTitle == '') {
		modalTitle = '삭제완료 되었습니다.';
	}
	if (modalMessage == null) {
		modalMessage = '';
	}
	$('#red_alert').remove();
	
	var html = '';
	html += '<div id="red_alert" class="modal modal-alert modal-danger fade">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<i class="fa fa-times-circle"></i>';
	html += '			</div>';
	html += '			<div class="modal-title">' + modalTitle + '</div>';
	html += '				<div class="modal-body mt20">' + modalMessage + '</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-danger modalRChkBtn" data-dismiss="modal">OK</button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$('body').append(html);
	$('#red_alert').modal({'backdrop' : 'static'});
}

function greenAlert(title, message) {
	var modalTitle = title;
	var modalMessage = message;
	if (modalTitle == null || modalTitle == '') {
		modalTitle = '저장완료 되었습니다.';
	}
	if (modalMessage == null) {
		modalMessage = '';
	}
	$('#green_alert').remove();
	
	var html = '';
	html += '<div id="green_alert" class="modal modal-alert modal-success fade">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<i class="fa fa-check-circle"></i>';
	html += '			</div>';
	html += '			<div class="modal-title">' + modalTitle + '</div>';
	html += '				<div class="modal-body mt20">' + modalMessage + '</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-success modalGChkBtn" data-dismiss="modal">OK</button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$('body').append(html);
	$('#green_alert').modal({'backdrop' : 'static'});
}

function blueAlert(title, message) {
	var modalTitle = title;
	var modalMessage = message;
	if (modalTitle == null || modalTitle == '') {
		modalTitle = '저장완료 되었습니다.';
	}
	if (modalMessage == null) {
		modalMessage = '';
	}
	$('#blue_alert').remove();
	
	var html = '';
	html += '<div id="blue_alert" class="modal modal-alert modal-info fade">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<i class="fa fa-info-circle"></i>';
	html += '			</div>';
	html += '			<div class="modal-title">' + modalTitle + '</div>';
	html += '				<div class="modal-body mt20">' + modalMessage + '</div>';
	html += '			<div class="modal-footer">';
	html += '				<button type="button" class="btn btn-info modalBChkBtn" data-dismiss="modal">OK</button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$('body').append(html);
	$('#blue_alert').modal({'backdrop' : 'static'});
}
	
function customPrimary(yesFunction, noFunction, message) {
	if (message == null || message == '') {
		message = ' ';
	}
	bootbox.dialog({
		buttons: {
			success: {
				label: "예",
				className: "modal-button btn-primary",
				callback: yesFunction
			},
			danger: {
				label: "아니오",
				className: "modal-button",
				callback: noFunction
			}
		},
		closeButton: false,
		message: message,
		className: "bootbox-sm"
	});
}

function customWarning(yesFunction, noFunction, message) {
	if (message == null || message == '') {
		message = ' ';
	}
	bootbox.dialog({
		buttons: {
			success: {
				label: "예",
				className: "modal-button btn-warning",
				callback: yesFunction
			},
			danger: {
				label: "아니오",
				className: "modal-button",
				callback: noFunction
			}
		},
		closeButton: false,
		message: message,
		className: 'bootbox-sm'
	});
}

function customDanger(yesFunction, noFunction, message) {
	if (message == null || message == '') {
		message = ' ';
	}
	bootbox.dialog({
		buttons: {
			success: {
				label: "예",
				className: "modal-button btn-danger",
				callback: yesFunction
			},
			danger: {
				label: "아니오",
				className: "modal-button",
				callback: noFunction
			}
		},
		closeButton: false,
		message: message,
		className: "bootbox-sm"
	});
}
