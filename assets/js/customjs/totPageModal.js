	
/**
 * 2.1 신규추가된 DashBoard, totPage, totAdminPage에서 사용하는 javascript
*/

//검색모듈 세팅(searchType : onchange evt시 하나의 검색모듈만 재설정이 필요할 수 있기에 받는 검색모듈 타입
//         , requestTime:검색모듈 세팅후 실행되는 함수의 실행시점[each:검색모듈 항목 하나가 세팅될 때마다, 모듈명:해당모듈이 세팅될 때, end:모든 항목 세팅이 끝난후]
//         , requestFnc:검색모듈 세팅후 실행되는 함수
//		   , searchLimit:사용자의 검색모듈 교과목 세팅권한(0:담당교과만, 1:소속학과 교과, 2:모든학과 교과))
function setSearchModule(searchType, requestTime, requestFnc, searchLimit) {
	if ((searchType == 'all' || searchType == 'year') && document.getElementById('yearSelect') != null) { //연도
		setYearModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'year')) {
			requestFnc('year'); //callback함수 실행
		}
	}
	
	if ((searchType == 'all' || searchType == 'currYear') && document.getElementById('currYearSelect') != null) { //교육과정개발년도
		setCurrYearModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'currYear')) {
			requestFnc('currYear'); //callback함수 실행
		}
	}
	
	if ((searchType == 'all' || searchType == 'semester') && document.getElementById('semesterSelect') != null) { //학기
		setSemesterModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'semester')) {
			requestFnc('semester'); //callback함수 실행
		}
	}

	if ((searchType == 'all' || searchType == 'depart') && document.getElementById('departSelect') != null) { //계열
		setDepartModule();		
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'depart')) {
			requestFnc('depart'); //callback함수 실행
		}
	}
				
	if ((searchType == 'all' || searchType == 'major') && document.getElementById('majorSelect') != null) { //학과
		setMajorModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'major')) {
			requestFnc('major'); //callback함수 실행
		}
	}

	if ((searchType == 'all' || searchType == 'grade') && document.getElementById('gradeSelect') != null) { //학년
		setGradeModule();				
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'grade')) {
			requestFnc('grade'); //callback함수 실행
		}
	}

	if ((searchType == 'all' || searchType == 'classDivide') && document.getElementById('classDivideSelect') != null) { //분반
		setClassDivideModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'classDivide')) {
			requestFnc('classDivide'); //callback함수 실행
		}
	}

	if ((searchType == 'all' || searchType == 'subjectType') && document.getElementById('subjectTypeSelect') != null) { //교과구분
		setSubjectTypeModule();
		
		if(typeof requestFnc == 'function' && (requestTime == 'each' || requestTime == 'subjectType')) {
			requestFnc('subjectType'); //callback함수 실행
		}
	}
	
	//연도
	function setYearModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'year'
			         , 'useProfileVw' : USE_PROFILE_VW //header.jsp의 프로파일뷰 사용여부 전역변수(true/false)
			        }; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		//연도
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].year + '">';
				html += 	list[i].year;
				html += '</option>';
			}
			
			$('#yearSelect').empty();
			$('#yearSelect').append(html);
		}
	}
	
	//교육과정개발년도
	function setCurrYearModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'currYear'
			         , 'useProfileVw' : USE_PROFILE_VW //header.jsp의 프로파일뷰 사용여부 전역변수(true/false)
			         , 'currYn' : CURR_YN //header.jsp의 교육과정개발 사용여부 전역변수(true/false)
			        }; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		//연도
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].year + '">';
				html += 	list[i].year;
				html += '</option>';
			}
			
			$('#currYearSelect').empty();
			$('#currYearSelect').append(html);
		}
	}
	
	//학기
	function setSemesterModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'semester', 'useProfileVw' : false}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].semester + '">';
				html += 	list[i].semesterName; //계절학기처리를 위해 코드테이블의 학기명을 사용(20170816 Jhee)
				html += '</option>';
			}
			
			$('#semesterSelect').empty();
			$('#semesterSelect').append(html);
		}
	}
	
	//계열
	function setDepartModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'depart', 'useProfileVw' : false}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		if(searchLimit == '2') {
			html += msgSelectAll; //기본값(선택하세요 또는 전체)
		}
		
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				//전체가 세팅되지 않는 사용자의 경우 첫번째 값이 선택되어 자동검색되도록 한다
				if(i==0 && searchLimit != '2') {
					html += '<option value="' + list[i].departCode + '" selected>';
				} else {
					html += '<option value="' + list[i].departCode + '">';
				}
				html += 	list[i].departName;
				html += '</option>';
			}
		}
		$('#departSelect').empty();
		$('#departSelect').append(html);
	}
	
	//학과
	function setMajorModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'major', 'useProfileVw' : false, 'departCode':$('#departSelect').val()}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		if(searchLimit == '2') {
			html += msgSelectAll; //기본값(선택하세요 또는 전체)
		}
		
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				//전체가 세팅되지 않는 사용자의 경우 첫번째 값이 선택되어 자동검색되도록 한다
				if(i==0 && searchLimit != '2') {
					html += '<option value="' + list[i].majorCode + '" selected>';
				} else {
					html += '<option value="' + list[i].majorCode + '">';;
				}
				html += 	list[i].majorName;
				html += '</option>';
			}
		}
		$('#majorSelect').empty();
		$('#majorSelect').append(html);
	}
	
	//학년
	function setGradeModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'grade', 'useProfileVw' : false}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		html += msgSelectAll; //기본값
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].grade + '">';
				html += 	list[i].grade;
				html += '</option>';
			}
		}
		$('#gradeSelect').empty();
		$('#gradeSelect').append(html);
	}
	
	//분반
	function setClassDivideModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'classDivide', 'useProfileVw' : false}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		html += msgSelectAll; //기본값
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].classDivide + '">';
				html += 	list[i].classDivide;
				html += '</option>';
			}
		}
		$('#classDivideSelect').empty();
		$('#classDivideSelect').append(html);
	}
	
	//교과구분
	function setSubjectTypeModule() {
		var html = ''; //화면을 그리기 위한 변수
		var param = {'searchType':'subjectType', 'useProfileVw' : false}; //데이터 select함수에 전달할 parameter변수
		var list = getSearchModuleItem(param); //데이터 select
		
		html += msgSelectAll; //기본값
		if(list != null && list.length != 0) {
			for(var i=0; i<list.length; i++){
				html += '<option value="' + list[i].subjectType + '">';
				html += 	list[i].gubunName;
				html += '</option>';
			}
		}
		$('#subjectTypeSelect').empty();
		$('#subjectTypeSelect').append(html);
	}
	
	//데이터 select를 위한 ajax함수(동기식)
	function getSearchModuleItem(param) {
		var list = '';
		
		$.ajax({
			url : context + "totModule/getSearchModuleItemAjax",
			data : param,
			type : 'POST',
			dataType : 'json',
			async: false, //ajax를 동기 방식으로 위에서부터 순서대로 실행하도록 처리
			traditional : true,
			beforeSend: function (request) {
				// 권한체크를 위해서 Header에 Ajax 호출로 등록
				request.setRequestHeader("authCheckAjax", true);
			},
			success : function(data) {
				list = data.list;
			},error : function(request, status, error) {
				if(request.status == '403') {
	    			alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
	    		} else {
		    		alert("error code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
	    		}
			}
		});
		
		return list;
	}
	
	//콜백함수가 존재하는지 확인하여 존재하면 콜백함수를 실행한다(paramter로 콜백함수의 실행시점을 전달한다)
	if(typeof requestFnc == 'function') {
		requestFnc('end'); //callback함수 실행
	}
}

//검색모듈 필수값 class추가
function setMustItems(list) {
	if(list != null && list.length != 0) {
		for(var i=0; i<list.length; i++) {
			$('#'+list[i]+'Select').parent().addClass('has-success');
		}
	}
}

//필수 검색조건이 선택되었는지 확인하는 fnc
function chkMustItems() {
	var mustYn = true; 
		
	if(typeof(mustItem) != 'undefined') {
		if(mustItem != null && mustItem.length != 0) {
			for(var i=0; i<mustItem.length; i++) {
				if($('#'+mustItem[i]+'Select').val() == null || $('#'+mustItem[i]+'Select').val() == '') {
					mustYn = false;
					break;
				}
			}
			
			if(!mustYn) {
				return false;
			} else {
				return true;
			}
		}
	}
}

//상태값을 버튼이 아닌 span태그로 return하는 fnc
function setStatus(rowIndex, type, status) {
	var html = '';
	
	if(type == 'diagSearch') {
		//20170622 Jhee 진단평가 상태값은 참여율이 아닌 기간에 따라 보여지도록 수정
		if(status == 'N') { //평가기간 미설정
			html += '<span id="'+type+rowIndex+'" class="text-light-gray cursor-pointer moveBtn" name="'+type+'">미설정</span>';
		} else if(status == 'S') {  //미작성
			html += '<span id="'+type+rowIndex+'" class="text-light-gray cursor-pointer moveBtn" name="'+type+'">미진행</span>';
		} else if(status == 'I') {  //작성중
			html += '<span id="'+type+rowIndex+'" class="text-warning cursor-pointer moveBtn" name="'+type+'">진행중</span>';
		} else if(status == 'E') { //완료 
			html += '<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveBtn" name="'+type+'">완료</span>';
		}
	} else if(type == 'diagStats') {
		//20170622 Jhee 진단평가 상태값은 참여율이 아닌 기간에 따라 보여지도록 수정
		if(status == 'N') { //평가기간 미설정
			html += '<span id="'+type+rowIndex+'" class="text-flare cursor-pointer moveBtn" name="'+type+'">미설정</span>';
		} else if(status == 'S') {  //미작성
			html += '<span id="'+type+rowIndex+'" class="text-flare cursor-pointer moveBtn" name="'+type+'">미진행</span>';
		} else if(status == 'I') {  //작성중
			html += '<span id="'+type+rowIndex+'" class="text-flare cursor-pointer moveBtn" name="'+type+'">진행중</span>';
		} else if(status == 'E') { //완료 
			html += '<span id="'+type+rowIndex+'" class="text-flare cursor-pointer moveBtn" name="'+type+'">완료</span>';
		}
	} else {
		if(status == 'N') { //작성불필요
			html += '<span id="'+type+rowIndex+'" class="noMove" name="'+type+'"></span>';	
		} else if(status == 'DN') { //작성불가
			html += '<span id="'+type+rowIndex+'" class="text-light-gray noMove" name="'+type+'"></span>';
		} else if(status == 'S') {  //미작성
			html += '<span id="'+type+rowIndex+'" class="text-light-gray cursor-pointer moveBtn" name="'+type+'">미작성</span>';
		} else if(status == 'I') {  //작성중
			html += '<span id="'+type+rowIndex+'" class="text-warning cursor-pointer moveBtn" name="'+type+'">작성중</span>';
		} else if(status == 'E') { //완료 
			if(type != 'stud') {
				html += '<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveBtn" name="'+type+'">완료</span>';
			} else {
				html += '<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveBtn" name="'+type+'">완료 <span class="text-warning">(마감해제)</span></span>';
			}
		} else if(status == 'F') { //마감
			html += '<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveBtn" name="'+type+'">마감</span>';
		}
	}
	html += 	'<input type="hidden" value="'+rowIndex+'" />'; //rowIndex(화면이동시 사용)
	
	return html;
}

//총교과목 수와 완료된 교과목 수 return fnc
function setCnt(rowIndex, type, cnt, totCnt) {
	var html = '';
	
	if(Number(totCnt) == 0) {     //전체 차시가 0인경우 작성불가
		html += 	'<span id="'+type+rowIndex+'" class="text-default no-cursor" name="'+type+'">';
	} else if(Number(cnt) == 0) { //현재 차시가 0인경우 미작성
		html += 	'<span id="'+type+rowIndex+'" class="text-default cursor-pointer moveBtn" name="'+type+'">';
	} else if(Number(cnt) == Number(totCnt)) { //전체차시와 현재차시가 같은경우 작성완료
		html += 	'<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveBtn" name="'+type+'">';
	} else {
		html += 	'<span id="'+type+rowIndex+'" class="text-warning cursor-pointer moveBtn" name="'+type+'">';
	}
	html += 			cnt+'/'+totCnt
	html += 		'</span>';
	html += 		'<input type="hidden" value="'+rowIndex+'" />'; //rowIndex(화면이동시 사용)  
	
	return html;
}

//차시별 버튼(text) return 함수
function setSeqBtn(rowIndex, type, evalSeq, status) {
	var html = '';
	
	if(status == 'N' || status == 'DN') { //작성불필요(비NCS), 작성불가
		html += '<span id="'+type+rowIndex+'" class="noMove" name="'+type+'">';	
	} else if(status == 'S') { //미작성
		html += '<span id="'+type+rowIndex+'" class="text-light-gray cursor-pointer moveSeq mr10" name="'+type+'">'+evalSeq+'차(미작성)';
	} else if(status == 'I') { //작성중
		html += '<span id="'+type+rowIndex+'" class="text-warning cursor-pointer moveSeq mr10" name="'+type+'">'+evalSeq+'차(작성중)';
	} else if(status == 'E' || status == 'F') { //완료 or 마감
		html += '<span id="'+type+rowIndex+'" class="text-success cursor-pointer moveSeq mr10" name="'+type+'">'+evalSeq+'차(완료)';
	} 
	
	html += 	'<input type="hidden" value="'+rowIndex+'┐@#┌'+evalSeq+'┐@#┌'+status+'" />'; //rowIndex(화면이동시 사용)
	html += '</span>';
	return html;
}

//진단평가 기간설정 모달
function drwDiagDateModal() {
	$('#diagDateModal').remove();
	
	var html = '';
	
	html += '<div id="diagDateModal" class="modal fade" tabindex="-1">';
	html += '	<div id="diagDateDiv" class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<button type="button" class="close" data-dismiss="modal">×</button>';
	html += '				<h4 class="modal-title">진단평가 기간설정</h4>';
	html += '			</div>';
	html += '			<div class="modal-body">';
	html += '				<h5>진단평가 기간</h5>';
	html += '				<div class="form-group col-md-12 p-a-0 mt15">';
	html += '					<div class="col-sm-10">';
	html += '						<div class="input-daterange input-group datePicker">';
	html += '							<input type="text" class="form-control text-center cursor-pointer" id="levelEvalSdate" name="levelEvalSdate" placeholder="평가 시작일">';
	html += '							<span class="input-group-addon">-</span>';
	html += '							<input type="text" class="form-control text-center cursor-pointer" id="levelEvalEdate" name="levelEvalEdate" placeholder="평가 종료일">';
	html += '						</div>';
	html += '					</div>';
	html += '					<div class="col-sm-1">';
	html += '						<input type="button" class="btn btn-white" id="devInitBtn" name="devInitBtn" value="초기화"/>';
	html += '					</div>';
	html += '				</div>';
	html += '				<div class="col-md-12 p-a-0 mt15">';
	html += '					<div class="col-sm-6">';
	html += '						<label class="custom-control custom-radio radio-inline mt7">';
	html += '			            	<input type="radio" class="custom-control-input" name="diagDateYn" id="diagDateN" value ="N" checked>';
	html += '			            	<span class="custom-control-indicator"></span>실시간 평가일자';
	html += '			            </label>';
	html += '			            <label class="custom-control custom-radio radio-inline mt7">';
	html += '			            	<input type="radio" class="custom-control-input" name="diagDateYn" id="diagDateY" value ="Y">';
	html += '			            	<span class="custom-control-indicator"></span>평가일자 일괄적용';
	html += '			            </label>';
	html += '		            </div>';
	html += '		            <div class="col-sm-6">';
	html += '		            	<div id="diagDateWrap" class="input-daterange input-group datePicker">';
	html += '							<input type="text" class="form-control text-center cursor-pointer" id="diagDate" name="diagDate" placeholder="일괄적용일자">';
	html += '						</div>';
	html += '		            </div>';
	html += '	            </div>';
	html += '				<input type="hidden" id="tmpYear" value="" />'; 
	html += '				<input type="hidden" id="tmpMajorCode" value="" />';
	html += '	            <input type="hidden" id="tmpSubjectCode" value="" />';
	html += '				<input type="hidden" id="tmpGrade" value="" />';
	html += '				<input type="hidden" id="tmpSemester" value="" />';
	html += '				<input type="hidden" id="tmpProfessorCode" value="" />'; 
	html += '				<input type="hidden" id="tmpClassDivide" value="" />';
	html += '				<input type="hidden" id="tmpEvalSeq" value="" />';	
	html += '			</div>';
	html += '			<div class="modal-footer text-center">';
	html += '				<button type="button" class="btn" data-dismiss="modal">취소</button>';
	html += '				<button type="button" class="btn btn-success" id="diagDateSave">저장</button>';
	html += '			</div>';
	html += '		</div>';
	html += '	</div>';
	html += '</div>';
	
	$('body').append(html);
	
	$('#diagDateWrap').hide(); //일괄적용일자 div의 default는 hide
	$('#diagDateModal').modal({'backdrop' : 'static'});
	
	//진단평가 기간설정 modal 세팅
	//datePicker설정
	var options = {todayBtn: "linked",orientation: $('body').hasClass('right-to-left') ? "auto right" : 'auto auto',format: 'yyyy-mm-dd'};
	$('.datePicker').datepicker(options);
	
	//진단평가 기간 초기화
	$("#devInitBtn").click(function() {
		$("#levelEvalSdate").val("");
		$("#levelEvalEdate").val("");
	});
	
	//진단평가 기간 radio change evt
	$('input[name=diagDateYn]').change(function() {
		var radioValue = $(this).val();
		if (radioValue == 'Y') {
			$('#diagDateWrap').show();
			$('#diagDate').attr('readonly',false);
		} else {
			$('#diagDateWrap').hide();
			$('#diagDate').val('');
			$('#diagDate').attr('readonly',true);
		}
	});
	
	//진단평가 기간 저장
	$('#diagDateSave').click(function() {
		diagDateSave();
	});
	//진단평가 기간설정 modal 세팅 끝
}

//진단평가 기간저장
function diagDateSave() {
	$('#diagDateModal').modal('hide');	
	// null check 후 저장 안되도록 수정하기 수정하기
	var year = $("#tmpYear").val();
	var majorCode = $("#tmpMajorCode").val();
	var subjectCode = $("#tmpSubjectCode").val();
	var grade = $("#tmpGrade").val();
	var semester = $("#tmpSemester").val();
	var professorCode = $("#tmpProfessorCode").val();
	var classDivide = $("#tmpClassDivide").val();
	var evalSeq = $("#tmpEvalSeq").val();
	
	var levelEvalSdate = $("#levelEvalSdate").val();
	var levelEvalEdate = $("#levelEvalEdate").val();
	var evalDateUseYn = $('input[name=diagDateYn]:checked').val();
	var evalDate = $("#diagDate").val();
	
	var tempEvalDate = '';
	
	if (levelEvalSdate == '' || levelEvalEdate == '') {
		yellowAlert('저장불가','진단평가 기간을 설정해주시기 바랍니다.');
		$('.btn-warning').click(function(){
			$('#diagDateModal').modal('show');	
		});
		return;
	}
	
	levelEvalSdate = levelEvalSdate.substring(0,4) + levelEvalSdate.substring(5,7) + levelEvalSdate.substring(8,10);
	levelEvalEdate = levelEvalEdate.substring(0,4) + levelEvalEdate.substring(5,7) + levelEvalEdate.substring(8,10);
	
	if (Number(levelEvalEdate) < Number(levelEvalSdate)){
		yellowAlert('저장불가','평가 종료기간은 시작일과 동일하거나<br/>이후로 설정해야합니다.');
		$('.btn-warning').click(function(){
			$('#diagDateModal').modal('show');	
		});
		return;
	} 
	
	if (evalDateUseYn == 'Y' && evalDate == '') {
		yellowAlert('저장불가','평가일자 일괄적용시 기간을 설정해야합니다.');
		$('.btn-warning').click(function(){
			$('#diagDateModal').modal('show');	
		});
		return;
	} else if (evalDateUseYn == 'Y' && evalDate != '') {
		tempEvalDate = evalDate.substring(0,4) + evalDate.substring(5,7) + evalDate.substring(8,10);
		if (Number(tempEvalDate) > Number(levelEvalEdate)){
			yellowAlert('저장불가','일괄적용기간은 종료일자와 동일하거나<br/>이전으로 설정해야합니다.');
			$('.btn-warning').click(function(){
				$('#diagDateModal').modal('show');	
			});
			return;
		}
	}
	
	evalDate = evalDate.substring(0,4) + evalDate.substring(5,7) + evalDate.substring(8,10);
	
	$.ajax({
		url : context + "evaluation/diagnosticEvalDate/saveAjax",
		data : {
			"year" : year,
			"majorCode" : majorCode,
			"subjectCode" : subjectCode,
			"professorCode" : professorCode,
			"grade" : grade,
			"semester" : semester,
			"classDivide" : classDivide,
			"evalSeq" : evalSeq,
			"levelEvalSdate" : levelEvalSdate,
			"levelEvalEdate" : levelEvalEdate,
			"evalDateUseYn" : evalDateUseYn,
			"evalDate" : evalDate
		},
		type : 'POST',
		dataType : 'json',
		beforeSend: function (request) {
			// 권한체크를 위해서 Header에 Ajax 호출로 등록
			request.setRequestHeader("authCheckAjax", true);
		},
		success : function(data) {
			greenAlert();
			
			$('.btn-success').click(function(){
				dataSearch();
			});
		},
		error : function(request, status, error) {
			/* alert("code:" + request.status + "\n" + "message:"
					+ request.responseText + "\n" + "error:"
					+ error); */
			loadingProgressHide();
			redAlert('저장에 실패하였습니다<br/>관리자에게 문의하여주세요');
		}
	}).always(function() {
		//location.reload(true);
		loadingProgressHide();
	});
}

//페이지 이동 전 이전단계 작성유무 확인을 위한 fnc
function chkMoveTo(moveForm, year, majorCode, subjectCode, grade, semester, professorCode, classDivide, subjectType, prevStep, prevMsg) {
	//dashBoard, 관리자메뉴에서는 이전단계 확인이 이루어지지 않기 때문에 페이지 이동 전에 이전단계를 확인한다
	$.ajax({			
		url : context + "totModule/chkMoveToAjax",
		data : {
			'year' : year,
			'majorCode' : majorCode,
			'subjectCode' : subjectCode,
			'grade' : grade,
			'semester' : semester,
			'professorCode' : professorCode,
			'classDivide' : classDivide,
			'subjectType' : subjectType,
			'prevStep' : prevStep,
			'useProfileVw' : USE_PROFILE_VW //header.jsp의 프로파일뷰 사용여부 전역변수(true/false)
		},
		type : 'POST',
		dataType : 'json',
		async : true,
		success : function(data) {
			var result = data.chkList;
			
			if(result.status == 'E' || result.status == 'F') {
				moveForm.submit();
			} else {
				yellowAlert(prevMsg+'을(를) 확인하세요', prevMsg+'이(가) 작성완료되지 않았습니다<br/>'+prevMsg+'을(를) 먼저 작성해주세요');
				return;
			}
		}
		, error:function(request,status,error){
			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
			}
		}
	});
}