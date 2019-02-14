	
	/**
	 * 공통 Confirm Dialog 
	 * @param message
	 */
	function confirmDialog(confirmBtnId, message) {
		
		$('#confirmModal').remove();
		
		var html = '';
		html += '<div id="confirmModal" class="modal fade" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button type="button" class="btn btn-default" data-dismiss="modal">취소 <i class="fa fa-times"></i></button>';
		html += '				<button type="button" id="' + confirmBtnId + '" class="btn btn-primary">확인 <i class="fa fa-check"></i></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$("body").append(html);
		$('#confirmModal .modal-body').append(message);
		$('#confirmModal').modal({'backdrop' : 'static'});
	}
	
	/**
	 * 공통 Confirm Cancel Dialog 
	 * @param message
	 */
	function confirmCancelDialog(confirmBtnId, cancelBtnId, confirmBtnMessage, cancelBtnMessage, message) {
		
		$('#confirmModal').remove();
		
		var html = '';
		html += '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button data-dismiss="modal" class="btn btn-default" type="button">취소 <i class="fa fa-times"></i></button>';
		html += '				<button class="btn btn-warning" type="button" id="' + cancelBtnId + '">' + cancelBtnMessage + ' <i class="fa fa-times"></i></button>';
		html += '				<button class="btn btn-primary" type="button" id="' + confirmBtnId + '">' + confirmBtnMessage + ' <i class="fa fa-check"></i></button>';	
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$("body").append(html);
		$('#confirmModal .modal-body').append(message);
		$('#confirmModal').modal({'backdrop' : 'static'});
	}

	/**
	 * 공통 알림 Confirm Dialog
	 * @param message
	 */
	function alertDialog(message) {
		
		$('#alertModal').remove();
		
		var html = '';
		html += '<div class="modal fade" id="alertModal" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button data-dismiss="modal" class="btn btn-default" type="button">닫기 <i class="fa fa-times"></i></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$('body').append(html);
		$('#alertModal .modal-body').html(message);
		$('#alertModal').modal({'backdrop' : 'static'});
	}

	function alertConfirmDialog(confirmBtnId, message) {
		
		$('#alertModal').remove();
		
		var html = '';
		html += '<div class="modal fade" id="alertModal" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button class="btn btn-default" type="button" id="' + confirmBtnId + '">닫기 <i class="fa fa-times"></i></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$('body').append(html);
		$('#alertModal .modal-body').html(message);
		$('#alertModal').modal({'backdrop' : 'static'});
	}
	
	function confirmCancelNotDefaultDialog(confirmBtnId, cancelBtnId, confirmBtnMessage, cancelBtnMessage, message) {
		
		$('#confirmModal').remove();
		
		var html = '';
		html += '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button class="btn btn-warning" type="button" id="' + cancelBtnId + '">' + cancelBtnMessage + ' <i class="fa fa-times"></i></button>';
		html += '				<button class="btn btn-primary" type="button" id="' + confirmBtnId + '">' + confirmBtnMessage + ' <i class="fa fa-check"></i></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$("body").append(html);
		$('#confirmModal .modal-body').append(message);
		$('#confirmModal').modal({'backdrop' : 'static'});
	}

	// 160701 dy.kang MAX_SEQ 삭제에서 사용할 Dialog 정의
	function delCheckModalDialog(confirmBtnId, cancelBtnId, confirmBtnMessage, cancelBtnMessage, message) {
		
		$('#confirmModal').remove();
		
		var html = '';
		html += '<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog modal-sm">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
		html += '				<h4 class="modal-title">확인</h4>';
		html += '			</div>';
		html += '			<div class="modal-body"></div>';
		html += '			<div class="modal-footer">';
		html += '				<button class="btn btn-warning" type="button" id="' + cancelBtnId + '">' + cancelBtnMessage + ' <i class="fa fa-times"></i></button>';
		html += '				<button class="btn btn-danger" type="button" id="' + confirmBtnId + '">' + confirmBtnMessage + ' <i class="fa fa-check"></i></button>';
		html += '			</div>';
		html += '		</div>';
		html += '	</div>';
		html += '</div>';
		
		$("body").append(html);
		$('#confirmModal .modal-body').append(message);
		$('#confirmModal').modal({'backdrop' : 'static'});
	}
