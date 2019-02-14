/**
 * 공통 modal js
*/

var firstNcsCode = '';
var secondNcsCode = '';
var thirdNcsCode = '';
var fourthNcsCode = '';
var jobGroupFirstResultList ;
var jobGroupSecondResultList ;
var jobGroupThirdResultList ;
var jobGroupFourthResultList ;
var occuVer;
var isShowViewChecker = false; // 직업분류 보기만 하는 팝업인지 셋팅

/*Jhee 학과 선택 Modal*/
/*requestFnc : callBack함수, selectedVal : 선택된 값*/
function majorSelect (requestFnc, selectedVal) {

	//모달이 그려져 있을 경우, 선택값을 유지하도록 설정
	if ($('body').find($('#majorSelectModal')).length != 0) {
		$('button[name=choiceMajorCode]').each(function() {
			$(this).removeClass('btn-outline');

			//선택된 값과 버튼의 값이 일치할 경우 class 추가
			if(selectedVal == $(this).val()) {
				$(this).addClass('btn-outline');
			}
		});
		$('#majorSelectModal').modal({'backdrop' : 'static'});
	} else {
		$.ajax({
			url : context + 'commonModal/majorSelectAjax',
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				var departList = '';
				var majorList = '';

				departList = data.departList;
				majorList = data.majorList;

				drawModal(departList,majorList,requestFnc, selectedVal);
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}

		function drawModal(departList,majorList,requestFnc, selectedVal) {
		var html = '';

		html += '<div id="majorSelectModal" class="modal fade" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="ncsTitleCloseBtn">×</button>';
		html += '				<h4 class="modal-title">학과선택</h4>';
		html += '			</div>';

		html += '			<div id="majorList" class="modal-body">';
		for (var i = 0; i < departList.length; i++) {
			html += '				<div class="panel panel-success';
			//홀수일 경우 어두운 배경색
			if (i%2 != 0) {
				html += ' panel-dark';
			}
			html += ' m-b-0 no-border-radius">';
			html += '					<div class="panel-heading text-center cursor-pointer" data-toggle="collapse" data-target="#departCode'+departList[i].departCode+'">';
			if(departList[i].departName == null) {
				html += '공통';
			} else {
				html +=                     departList[i].departName;
			}
			html += '					</div>';
			html += '					<div id="departCode'+departList[i].departCode+'" class="panel-collapse';

			//첫번째 panel만 open, 나머지는 close처리
			if (i == 0) {
				html += ' in';
			} else {
				html += ' collapse';
			}
			html += '">';
			html += '						<div class="panel-body">';

			for (var j = 0; j < majorList.length; j++) {
				if(departList[i].departCode == majorList[j].departCode) {
					html += '							<button type="button" name="choiceMajorCode" class="btn padding-md-hr margin-sm-hr margin-sm-b';

					//jsp 저장된 값과 majorCode값이 동일할 경우, active class 추가
					if(selectedVal == majorList[j].majorCode) {
						html += ' btn-outline';
					}
					html += '	" data-dismiss="modal" value="'+majorList[j].majorCode+'">';
					html += 							majorList[j].majorName;
					html += 							'</button>';
				}
			}
			html += '						</div>';
			html += '					</div>';
			html += '				</div>';
		}
		html += '			</div>'; /* /modal body */
		html += '		</div>'; /* /modal content */
		html += '	</div>'; /*/modal dialog*/
		html += '</div>'; /*/ #majorSelectModal*/

		$('body').append(html);
		$('#majorList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용

		$('button[name=choiceMajorCode]').click(requestFnc); //버튼을 클릭했을 때, jsp에서 받은 함수 실행
		$('#majorSelectModal').modal({'backdrop' : 'static'});
	}

}

/*직업분류 Modal : 콜백함수명, 작업버전*/
// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
function jobGroupModal(requestFnc, occuVerParam, isShowView) {

	occuVer = occuVerParam;
	// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
	if (isShowView != null && isShowView == true) {
		isShowViewChecker = isShowView;
	}

	$('#listDelModal').remove();
	var occuParentcode = "ROOT";

	$.ajax({
		url : context + 'commonModal/listJobGroupAjax',
		data : ({
			'occuParentcode' : occuParentcode,
			'occuVer' : occuVer
		}),
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			jobGroupFirstResultList = data.resultList;

			drawJobGroupModal(requestFnc);
		}
		, error:function(request,status,error){

			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
			}

		}
	}).always(function() {
		loadingProgressHide();
	});
}

// 환경분석및 요구사항에서 인재양성유형 추가 버튼 클릭후 닫기 버튼을 클릭하면 opener 에서 생성된 인재양성유형 input box 제거
function fn_close() {
	// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
	if (isShowViewChecker == false) {
		$('.tmp-class'+rowIdx).remove();
	}
}

/*직업분류 Modal : 기본화면*/
function drawJobGroupModal(requestFnc) {
	var html = '';

	html += '<div id="listDelModal" class="modal fade" tabindex="-1" role="dialog">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="ncsTitleCloseBtn">×</button>';
	html += '				<h4 class="modal-title">인재양성유형</h4>';
	html += '			</div>';

	html += '			<div id="majorList" class="modal-body">'

			html += ' <table class="table table-bordered">							';
			html += '	<thead>                                                     ';
			html += '		<tr>                                                    ';
			html += '			<th class="bg-dark-blue text-semibold">대분류</th>  ';
			html += '			<th class="bg-dark-blue text-semibold">중분류</th>  ';
			html += '			<th class="bg-dark-blue text-semibold">소분류</th>  ';
			html += '		</tr>                                                   ';
			html += '		<tr>                                                    ';
			html += '			<th id="oneTh" class="td-light-blue">&nbsp</th>         ';
			html += '			<th id="twoTh">&nbsp</th>                               ';
			html += '			<th id="threeTh">&nbsp</th>                             ';
			html += '		</tr>                                                   ';
			html += '	</thead>                                                    ';
			html += '	<tbody>                                                     ';
			// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
			if (isShowViewChecker == true) {
				html += '		<tr id="showExJob">                                 ';
				html += '			<td colspan="4"></td>                               ';
				html += '		</tr>                                                   ';
			}
			html += '		<tr id="selectBtnList">                                 ';
			html += '			<td colspan="4"></td>                               ';
			html += '		</tr>                                                   ';
			html += '	</tbody>                                                    ';
			html += ' </table>                                                       ';

	html += '			</div>'; /* /modal body */

	html += '		<div class="modal-footer">	 ';
	// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
	if (isShowViewChecker == false) {
		html += '			<button class="btn btn-success padding-md-hr" data-dismiss="modal" id="jobGroupSaveBtn" >저장</button>	 ';
	}
	html += '			<button class="btn btn-outline padding-md-hr" data-dismiss="modal" onClick="fn_close()" >닫기</button>	 ';
	html += '		</div><!-- /modal-footer -->	 ';

	html += '		</div>'; /* /modal content */
	html += '	</div>'; /*/modal dialog*/
	html += '</div>'; /*/ #listDelModal*/

	$('body').append(html);
	$('#majorList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용

	$('#jobGroupSaveBtn').data('resultCd', "");
	$('#jobGroupSaveBtn').data('resultNm', "");

	// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
	if (isShowViewChecker == false) {
		 //버튼을 클릭했을 때, jsp에서 받은 함수 실행
		$('#jobGroupSaveBtn').click(requestFnc);
	}

	// 선택한 값을 입력하는 함수(초기셋팅으로 빈칸을 넣어준다)
	setInitBtn('', '', '', '');
	// 입력된 내용에 따라 다음 버튼 보여주기(초기값이므로 초기값이 셋팅됨)
	setNextBtnList()


	$('#listDelModal').modal({'backdrop' : 'static'});
}

// ncsCode click이벤트 공통함수
function setNcsCodeClick(order, ncsCode, showTxt, resultCd, resultNm) {

	var occuParentcode;

	if (order == '1') { // 순서가 1번일 경우
		setInitBtn(ncsCode, '', '', ''); // 대분류만 셋팅

		if(ncsCode =="")
		{
			occuParentcode = "ROOT";
		}else
		{
			occuParentcode = ncsCode;
		}

		$('#oneTh').text(showTxt);
		$('#jobGroupSaveBtn').data('resultCd', resultCd);
		$('#jobGroupSaveBtn').data('resultNm', resultNm);

		$('#twoTh').text("-");
		$('#threeTh').text("-");

	} else if (order == '2') { // 순서가 2번일 경우
		setInitBtn(firstNcsCode, ncsCode, '', ''); // 대분류, 중분류 셋팅 (firstNcsCode 대신 null을 사용해도 됨)
		occuParentcode = ncsCode;

		$('#twoTh').text(showTxt);
		$('#jobGroupSaveBtn').data('returnVal', showTxt);
		$('#jobGroupSaveBtn').data('resultCd', resultCd);
		$('#jobGroupSaveBtn').data('resultNm', resultNm);

		$('#threeTh').text("-");

	} else if (order == '3') { // 순서가 3번일 경우
		setInitBtn(firstNcsCode, secondNcsCode, ncsCode, ''); // 대분류, 중분류, 소분류 셋팅
		occuParentcode = ncsCode;

		$('#threeTh').text(showTxt);
		$('#jobGroupSaveBtn').data('returnVal', showTxt);
		$('#jobGroupSaveBtn').data('resultCd', resultCd);
		$('#jobGroupSaveBtn').data('resultNm', resultNm);

	} else if (order == '4') { // 순서가 4번일 경우
		setInitBtn(firstNcsCode, secondNcsCode, thirdNcsCode, ncsCode); // 대분류, 중분류, 소분류, 세분류 셋팅
		occuParentcode = ncsCode;

		$('#fourTh').text(showTxt);
		$('#jobGroupSaveBtn').data('returnVal', showTxt);
		$('#jobGroupSaveBtn').data('resultCd', resultCd);
		$('#jobGroupSaveBtn').data('resultNm', resultNm);

	}
	if(parseInt(order,10) ==3)
	{
		// 입력된 ncsCode 값에 따라서 이벤트 등록 & 제거
		setBtnEventInit();
		// 입력된 ncsCode 값에 따라서 다음 버튼화면 보이기
		setNextBtnList();

	}else {
		//서버데이타 조회
		$.ajax({
			url : context + 'commonModal/listJobGroupAjax',
			data : ({
				'occuParentcode' : occuParentcode,
				'occuVer' : occuVer
			}),
			type : 'POST',
			dataType : 'json',
			success : function(data) {

				if(order == '1' || occuParentcode == 'ROOT')
				{
					jobGroupSecondResultList = data.resultList;
				}else if(order == '2')
				{
					jobGroupThirdResultList = data.resultList;
				}else if(order == '3')
				{
					//jobGroupThirdResultList = data.resultList;
				}


				jobGroupAjaxSerchAf();
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}
}

//버튼클릭후 서버데이타 조회후 처리
function jobGroupAjaxSerchAf() {

	// 입력된 ncsCode 값에 따라서 이벤트 등록 & 제거
	setBtnEventInit();
	// 입력된 ncsCode 값에 따라서 다음 버튼화면 보이기
	setNextBtnList();
}

// 입력된 ncsCode값에 따라서 다음 버튼화면 보이기
function setNextBtnList() {
	if (fourthNcsCode != '') { // 세분류 셋팅된 경우 다음화면이 없음
	} else if (thirdNcsCode != '') { // 소분류 셋팅된 경우
		//setFourthBtnList(); // 세분류 버튼 보이기
		// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
		if (isShowViewChecker == true) {
			setShowExJobList();
		}
	} else if (secondNcsCode != '') { // 중분류 셋팅된 경우
		setThirdBtnList(); // 소분류 버튼 보이기
		// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
		if (isShowViewChecker == true) {
			setHideExJobList();
		}
	} else if (firstNcsCode != '') { // 대분류 셋팅된 경우
		setSecondBtnList(); // 중분류 버튼 보이기
		// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
		if (isShowViewChecker == true) {
			setHideExJobList();
		}
	} else { // 아무것도 없을 경우
		setFirstBtnList(); // 대분류 버튼 보이기
		// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
		if (isShowViewChecker == true) {
			setHideExJobList();
		}
	}
}

// 입력된 ncsCode값에 따라 이벤트 등록 & 제거
function setBtnEventInit() {
	if (firstNcsCode != '') { // 대분류 셋팅된 경우
		$('#oneTh').click(setFirstBtnList); // 입력된 대분류칸 선택시 대분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#oneTh').unbind(); // 등록된 이벤트 제거
	}
	if (secondNcsCode != '') { // 중분류 셋팅된 경우
		$('#twoTh').click(setSecondBtnList); // 입력된 중분류칸 선택시 중분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#twoTh').unbind(); // 등록된 이벤트 제거
	}
	if (thirdNcsCode != '') { // 소분류 셋팅된 경우
		$('#threeTh').click(setThirdBtnList); // 입력된 소분류칸 선택시 소분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#threeTh').unbind(); // 등록된 이벤트 제거
	}
	if (fourthNcsCode != '') { // 세분류 셋팅된 경우
		//$('#fourTh').click(setFourthBtnList); // 입력된 세분류칸 선택시 세분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		//$('#fourTh').unbind(); // 등록된 이벤트 제거
	}
}

function setFirstBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#oneTh').addClass('td-light-blue'); // 대분류칸에 선택색상 입히기
	$('#selectBtnList').empty(); // 버튼화면 초기화
	var html = '';
	html += '<td colspan="4">';
	// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
	for(var i = 0 ; i <jobGroupFirstResultList.length; i++){

		var tempTxt = jobGroupFirstResultList[i].occuCode+"."+jobGroupFirstResultList[i].occuName;
		var returnValCode = jobGroupFirstResultList[i].occuCode;
		var returnValName = jobGroupFirstResultList[i].occuName;
		html += '	<button class="btn btn-outline btn-labeled margin-xs" onClick="setNcsCodeClick(\'1\', \'' + jobGroupFirstResultList[i].occuCode + '\', \'' + tempTxt + '\', \'' + returnValCode + '\', \'' + returnValName + '\');">' + tempTxt + '</button>';
	}

	html += '</td>';
	$('#selectBtnList').append(html); // 대분류 버튼 생성
}

// 중분류 버튼 보이기 함수
function setSecondBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#twoTh').addClass('td-light-blue'); // 중분류칸에 선택생상 입히기
	$('#selectBtnList').empty(); // 버튼화면 초기화
	var html = '';
	html += '<td colspan="4">';
	// 중분류 버튼 생성 - 직업분류 선택 화면에서 사용할 버튼 UI

	for(var i = 0 ; i <jobGroupSecondResultList.length; i++){

		var tempTxt = jobGroupSecondResultList[i].occuCode+"."+jobGroupSecondResultList[i].occuName;
		var returnValCode = jobGroupSecondResultList[i].occuCode;
		var returnValName = jobGroupSecondResultList[i].occuName;

		html += '	<button class="btn btn-outline btn-labeled margin-xs" onClick="setNcsCodeClick(\'2\', \'' + jobGroupSecondResultList[i].occuCode + '\', \'' + tempTxt + '\', \'' + returnValCode + '\', \'' + returnValName + '\');">' + tempTxt + '</button>';
	}

	html += '</td>';
	$('#selectBtnList').append(html); // 중분류 버튼 생성
}

// 소분류 버튼 보이기 함수
function setThirdBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#threeTh').addClass('td-light-blue'); // 소분류칸에 선택색상 입히기
	$('#selectBtnList').empty(); // 버튼화면 초기화
	var html = '';
	html += '<td colspan="4">';
	// 소분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI

	for(var i = 0 ; i <jobGroupThirdResultList.length; i++){

		var tempTxt = jobGroupThirdResultList[i].occuCode+"."+jobGroupThirdResultList[i].occuName;
		var returnValCode = jobGroupThirdResultList[i].occuCode;
		var returnValName = jobGroupThirdResultList[i].occuName;

		html += '	<button class="btn btn-outline btn-labeled margin-xs" onClick="setNcsCodeClick(\'3\', \'' + jobGroupThirdResultList[i].occuCode + '\', \'' + tempTxt + '\', \'' + returnValCode + '\', \'' + returnValName + '\');">' + tempTxt + '</button>';
	}

	html += '</td>';
	$('#selectBtnList').append(html); // 소분류 버튼 생성
}

// 세분류 버튼 보이기 함수
function setFourthBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#fourTh').addClass('td-light-blue'); // 세분류칸에 선택색상 입히기
	$('#selectBtnList').empty(); // 버튼화면 초기화
	var html = '';
	html += '<td colspan="4">';
	// 세분류 버튼 생성 - 직업분류 선택 화면에서 사용할 버튼 UI

	for(var i = 0 ; i <jobGroupResultList.length; i++){

		var tempTxt = jobGroupResultList[i].occuCode+"."+jobGroupResultList[i].occuName;
		var returnValCode = jobGroupResultList[i].occuCode;
		var returnValName = jobGroupResultList[i].occuName;

		html += '	<button class="btn btn-outline btn-labeled margin-xs" onClick="setNcsCodeClick(\'4\', \'' + jobGroupResultList[i].occuCode + '\', \'' + tempTxt + '\', \'' + returnValCode + '\', \'' + returnValName + '\');">' + tempTxt + '</button>';
	}

	html += '</td>';
	$('#selectBtnList').append(html); // 세분류 버튼 생성
}

// 160205 dy.kang 직업분류 보기만 하는 팝업인지 셋팅
// 직업예시 보이기 함수
function setShowExJobList() {
	$('#showExJob').empty();
	$.ajax ({
		url : context + 'occuVerify/listJobGroupAjax',
		type : 'POST',
		data : ({
			'occuCode' : thirdNcsCode,
			'sysLevel'   : 3,
			'occuVer': occuVer
		}),

		dataType : 'json',
		success : function(data) {
			var list = data.list;

			if (list != null && list.length != 0) {
				// 160420 dy.kang 직업 예시 중간 띄어쓰기 추가 띄어쓰기를 JSP에 맞게 &nbsp;로 변경
				list[0].exJob = list[0].exJob.replace(/    /gi, ' &nbsp;&nbsp;&nbsp;&nbsp; ');
				$("#exJob"+rowIdx).append( list[0].exJob);
				$('#showExJob').append('<td colspan="3">' + list[0].exJob + '</td>');
				$('#showExJob').show();
			} else {
				$('#showExJob').append('<td colspan="3">직업 예시가 존재하지 않습니다.</td>');
				$('#showExJob').show();
			}
		}
		, error:function(request,status,error) {

			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.\n"+error);
			}
		}
	}).always(function() {

		loadingProgressHide();
	});
}
		
// 직업예시 보이기 함수
function setHideExJobList() {
	$('#showExJob').empty();
	$('#showExJob').hide();
}
		
// 대중소세분류 선택한 ncsCode값 셋팅
function setInitBtn(selectFirstNcsCode, selectSecondNcsCode, selectThirdNcsCode, selectFourthNcsCode) {
	if (selectFirstNcsCode != null) { // null이 아닐경우 대분류값에 선택된값 저장
		firstNcsCode = selectFirstNcsCode;
	}
	if (selectSecondNcsCode != null) {
		secondNcsCode = selectSecondNcsCode;
	}
	if (selectThirdNcsCode != null) {
		thirdNcsCode = selectThirdNcsCode;
	}
	if (selectFourthNcsCode != null) {
		fourthNcsCode = selectFourthNcsCode;
	}
}



var firstDepthNcsCode = '';
var firstDepthNcsName = '';
var firstDepthNcsCodeList = [];
var secondDepthNcsCode = '';
var secondDepthNcsName = '';
var secondDepthNcsCodeList = [];
var thirdDepthNcsCode = '';
var thirdDepthNcsName = '';
var thirdDepthNcsCodeList = [];
var fourthDepthNcsCode = '';
var fourthDepthNcsName = '';
var fourthDepthNcsCodeList = [];
var depthNcsGrDef = '';
var depthNcsCode = '';
var depthNcsLocalYn = '';
var fourthDepthEventSet = false;
var fourthEvent = null;

function ncsCodeSelecter(requestFunction) {
	$('#ncsCodeSelecterModal').remove();

	var html = '';
	html += '	<div id="ncsCodeSelecterModal" class="modal fade" role="dialog">';
	html += '		<div class="modal-dialog modal-lg">';
	html += '			<div class="modal-content">';
	html += '				<div class="modal-header">';
	html += '					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
	html += '					<h4 class="modal-title">분류체계 선택</h4>';
	html += '				</div>';
	html += '				<div id="commonNcsCodeTableList" class="modal-body p-a-0">';
	html += '					<table class="table table-bordered">';
	html += '						<thead>';
	html += '							<tr>';
	html += '								<th class="bg-dark-blue text-semibold">대분류</th>';
	html += '								<th class="bg-dark-blue text-semibold">중분류</th>';
	html += '								<th class="bg-dark-blue text-semibold">소분류</th>';
	html += '								<th class="bg-dark-blue text-semibold">세분류</th>';
	html += '							</tr>';
	html += '							<tr>';
	html += '								<th id="oneDepthNcsCode" class="td-light-blue"></th>';
	html += '								<th id="twoDepthNcsCode"></th>';
	html += '								<th id="threeDepthNcsCode"></th>';
	html += '								<th id="fourDepthNcsCode"></th>';
	html += '							</tr>';
	html += '						</thead>';
	html += '						<tbody>';
	html += '							<tr id="commonNcsCodeSelectBtnList">';
	html += '								<td colspan="4"></td>';
	html += '							</tr>';
	html += '						</tbody>';
	html += '					</table>';
	html += '				</div><!-- /modal-body -->';
	html += '				<div class="modal-footer">';
	html += '					<button class="btn btn-success padding-md-hr" data-dismiss="modal" id="selectedNcsCodeSave">저장</button>';
	html += '					<button class="btn btn-outline padding-md-hr" data-dismiss="modal">닫기</button>';
	html += '				</div><!-- /modal-footer -->';
	html += '			</div><!-- /modal-content -->';
	html += '		</div><!-- /modal-dialog -->';
	html += '	</div><!-- / modal -->';

	$("body").append(html);
	$('#commonNcsCodeTableList').perfectScrollbar({ height: 400, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용
	// 선택한 값을 입력하는 함수(초기셋팅으로 빈칸을 넣어준다)
	commonNcsCodeSetInitBtn('', '', '', '');
	// 입력된 내용에 따라 다음 버튼 보여주기(초기값이므로 초기값이 셋팅됨)
	commonNcsCodeSetNextBtnList();
	// 입력된 내용에 따라 이름 입력해주기(초기값이므로 - 가 셋팅됨)
	commonNcsCodeSetNcsNameView();

	$('#selectedNcsCodeSave').click(requestFunction);
	$('#ncsCodeSelecterModal').modal({'backdrop' : 'static'});
}

//ncsCode click이벤트 공통함수
function commonNcsCodeSetNcsCodeClick(order, ncsCode) {
	if (order == '1') { // 순서가 1번일 경우
		commonNcsCodeSetInitBtn(ncsCode, '', '', ''); // 대분류만 셋팅
		secondDepthNcsCodeList = [];
		thirdDepthNcsCodeList = [];
		fourthDepthNcsCodeList = [];
	} else if (order == '2') { // 순서가 2번일 경우
		commonNcsCodeSetInitBtn(firstDepthNcsCode, ncsCode, '', ''); // 대분류, 중분류 셋팅 (firstDepthNcsCode 대신 null을 사용해도 됨)
		thirdDepthNcsCodeList = [];
		fourthDepthNcsCodeList = [];
	} else if (order == '3') { // 순서가 3번일 경우
		commonNcsCodeSetInitBtn(firstDepthNcsCode, secondDepthNcsCode, ncsCode, ''); // 대분류, 중분류, 소분류 셋팅
		fourthDepthNcsCodeList = [];
	} else if (order == '4') { // 순서가 4번일 경우
		commonNcsCodeSetInitBtn(firstDepthNcsCode, secondDepthNcsCode, thirdDepthNcsCode, ncsCode); // 대분류, 중분류, 소분류, 세분류 셋팅
		if (fourthDepthEventSet == true) {
			fourthEvent();
		}
	}
	// 입력된 ncsCode 값에 따라서 이벤트 등록 & 제거
	commonNcsCodeSetBtnEventInit();
	// 입력된 ncsCode 값에 따라서 이름 등록
	commonNcsCodeSetNcsNameView();
	// 입력된 ncsCode 값에 따라서 다음 버튼화면 보이기
	commonNcsCodeSetNextBtnList();
	}
	//입력된 ncsCode값에 따라서 다음 버튼화면 보이기
	function commonNcsCodeSetNextBtnList() {
	if (fourthDepthNcsCode != '') { // 세분류 셋팅된 경우 다음화면이 없음
	} else if (thirdDepthNcsCode != '') { // 소분류 셋팅된 경우
		commonNcsCodeSetFourthNcsCodeBtnList(); // 세분류 버튼 보이기
	} else if (secondDepthNcsCode != '') { // 중분류 셋팅된 경우
		commonNcsCodeSetThirdBtnList(); // 소분류 버튼 보이기
	} else if (firstDepthNcsCode != '') { // 대분류 셋팅된 경우
		commonNcsCodeSetSecondBtnList(); // 중분류 버튼 보이기
	} else { // 아무것도 없을 경우
		commonNcsCodeSetFirstBtnList(); // 대분류 버튼 보이기
	}
}

//입력된 ncsCode값에 따라 이벤트 등록 & 제거
function commonNcsCodeSetBtnEventInit() {
	if (firstDepthNcsCode != '') { // 대분류 셋팅된 경우
		$('#oneDepthNcsCode').click(commonNcsCodeSetFirstBtnList); // 입력된 대분류칸 선택시 대분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#oneDepthNcsCode').unbind(); // 등록된 이벤트 제거
	}
	if (secondDepthNcsCode != '') { // 중분류 셋팅된 경우
		$('#twoDepthNcsCode').click(commonNcsCodeSetSecondBtnList); // 입력된 중분류칸 선택시 중분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#twoDepthNcsCode').unbind(); // 등록된 이벤트 제거
	}
	if (thirdDepthNcsCode != '') { // 소분류 셋팅된 경우
		$('#threeDepthNcsCode').click(commonNcsCodeSetThirdBtnList); // 입력된 소분류칸 선택시 소분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#threeDepthNcsCode').unbind(); // 등록된 이벤트 제거
	}
	if (fourthDepthNcsCode != '') { // 세분류 셋팅된 경우
		$('#fourDepthNcsCode').click(commonNcsCodeSetFourthNcsCodeBtnList); // 입력된 세분류칸 선택시 세분류 버튼 보이는 함수 셋팅
	} else { // 아닐경우
		$('#fourDepthNcsCode').unbind(); // 등록된 이벤트 제거
	}
}

function commonNcsCodeSetFirstBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#oneDepthNcsCode').addClass('td-light-blue'); // 대분류칸에 선택색상 입히기

	if (firstDepthNcsCodeList != null && firstDepthNcsCodeList != '' && firstDepthNcsCodeList.length != 0) {
		$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
		var html = '';
		html += '<td colspan="4">';
		for (var i = 0; i < firstDepthNcsCodeList.length; i++) {
			// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
			if ( $('#onlyLocalYn').val() == 'Y' ) {  // 능력단위 관리 : 서일대 대응 - onlyLocalYn 체크 
				if (firstDepthNcsCodeList[i].localYn == 'N' ) {
					;
				} else {
					html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'1\', \'' + firstDepthNcsCodeList[i].ncsGrCode + '\');">';
					html += '	<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
					html += 	firstDepthNcsCodeList[i].ncsGrName;
					html += '</button>';
				}
			}
			else {
				html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'1\', \'' + firstDepthNcsCodeList[i].ncsGrCode + '\');">';
				if (firstDepthNcsCodeList[i].localYn == 'N' ) {
					html += '<span class="btn-label-icon left text-info">NCS</span>';
				} else {
					html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
				}
				html += 	firstDepthNcsCodeList[i].ncsGrName;
				html += '</button>';
			}
		}
		html += '</td>';
		$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
	} else {
		$.ajax({
			url : context + 'commonModal/firstDepthGetNcsCodeListAjax',
			type : 'POST',
			dataType : 'json',
			beforeSend: function (request) {
			    	// 권한체크를 위해서 Header에 Ajax 호출로 등록
					request.setRequestHeader("authCheckAjax", true);
			},
			success : function(data) {
				//console.log(data);
				firstDepthNcsCodeList = data.ncsCodeList;
				$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
				var html = '';
				html += '<td colspan="4">';
				for (var i = 0; i < firstDepthNcsCodeList.length; i++) {
					// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
					if ( $('#onlyLocalYn').val() == 'Y' ) {  // 능력단위 관리 : 서일대 대응 - onlyLocalYn 체크 
						if (firstDepthNcsCodeList[i].localYn == 'N') {
							;
						} else {
							html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'1\', \'' + firstDepthNcsCodeList[i].ncsGrCode + '\');">';
							html += '	<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
							html += 	firstDepthNcsCodeList[i].ncsGrName;
							html += '</button>';
						}
					}
					else {
						html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'1\', \'' + firstDepthNcsCodeList[i].ncsGrCode + '\');">';
						if (firstDepthNcsCodeList[i].localYn == 'N' ) {
							html += '<span class="btn-label-icon left text-info">NCS</span>';
						} else {
							html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
						}
						html += 	firstDepthNcsCodeList[i].ncsGrName;
						html += '</button>';
					}
				}
				html += '</td>';
				$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
			}
		});
	}
}

//중분류 버튼 보이기 함수
function commonNcsCodeSetSecondBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#twoDepthNcsCode').addClass('td-light-blue'); // 중분류칸에 선택생상 입히기

	if (secondDepthNcsCodeList != null && secondDepthNcsCodeList != '' && secondDepthNcsCodeList.length != 0) {
		$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
		var html = '';
		html += '<td colspan="4">';
		for (var i = 0; i < secondDepthNcsCodeList.length; i++) {
			// 중분류 버튼 생성 - 직업분류 선택 화면에서 사용할 버튼 UI
			html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'2\', \'' + secondDepthNcsCodeList[i].ncsGrCode + '\');">';
			if (secondDepthNcsCodeList[i].localYn == 'N' ) {
				html += '<span class="btn-label-icon left text-info">NCS</span>';
			} else {
				html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
			}
			html += 	secondDepthNcsCodeList[i].ncsGrName;
			html += '</button>';
		}
		html += '</td>';
		$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
	} else {
		$.ajax({
			url : context + 'commonModal/secondDepthGetNcsCodeListAjax',
			type : 'POST',
			data : {
				"ncsCode": firstDepthNcsCode
			},
			dataType : 'json',
			beforeSend: function (request) {
			    	// 권한체크를 위해서 Header에 Ajax 호출로 등록
					request.setRequestHeader("authCheckAjax", true);
			},
			success : function(data) {
				//console.log(data);
				secondDepthNcsCodeList = data.ncsCodeList;
				$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
				var html = '';
				html += '<td colspan="4">';
				for (var i = 0; i < secondDepthNcsCodeList.length; i++) {
					// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
					html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'2\', \'' + secondDepthNcsCodeList[i].ncsGrCode + '\');">';
					if (secondDepthNcsCodeList[i].localYn == 'N' ) {
						html += '<span class="btn-label-icon left text-info">NCS</span>';
					} else {
						html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
					}
					html += 	secondDepthNcsCodeList[i].ncsGrName;
					html += '</button>';
				}
				html += '</td>';
				$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
			}
		});
	}
}

//소분류 버튼 보이기 함수
function commonNcsCodeSetThirdBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#threeDepthNcsCode').addClass('td-light-blue'); // 소분류칸에 선택색상 입히기

	if (thirdDepthNcsCodeList != null && thirdDepthNcsCodeList != '' && thirdDepthNcsCodeList.length != 0) {
		$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
		var html = '';
		html += '<td colspan="4">';
		for (var i = 0; i < thirdDepthNcsCodeList.length; i++) {
			// 소분류 버튼 생성 - 직업분류 선택 화면에서 사용할 버튼 UI
			html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'3\', \'' + thirdDepthNcsCodeList[i].ncsGrCode + '\');">';
			if (thirdDepthNcsCodeList[i].localYn == 'N' ) {
				html += '<span class="btn-label-icon left text-info">NCS</span>';
			} else {
				html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
			}
			html += 	thirdDepthNcsCodeList[i].ncsGrName;
			html += '</button>';
		}
		html += '</td>';
		$('#commonNcsCodeSelectBtnList').append(html); // 소분류 버튼 생성
	} else {
		$.ajax({
			url : context + 'commonModal/thirdDepthGetNcsCodeListAjax',
			type : 'POST',
			data : {
				"ncsCode": secondDepthNcsCode
			},
			dataType : 'json',
			beforeSend: function (request) {
			    	// 권한체크를 위해서 Header에 Ajax 호출로 등록
					request.setRequestHeader("authCheckAjax", true);
			},
			success : function(data) {
				//console.log(data);
				thirdDepthNcsCodeList = data.ncsCodeList;
				$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
				var html = '';
				html += '<td colspan="4">';
				for (var i = 0; i < thirdDepthNcsCodeList.length; i++) {
					// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
					html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'3\', \'' + thirdDepthNcsCodeList[i].ncsGrCode + '\');">';
					if (thirdDepthNcsCodeList[i].localYn == 'N' ) {
						html += '<span class="btn-label-icon left text-info">NCS</span>';
					} else {
						html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
					}
					html += 	thirdDepthNcsCodeList[i].ncsGrName;
					html += '</button>';
				}
				html += '</td>';
				$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
			}
		});
	}
}

//세분류 버튼 보이기 함수
function commonNcsCodeSetFourthNcsCodeBtnList() {
	$('table thead tr .td-light-blue').removeClass('td-light-blue'); // 대중소세 분류 중 선택된 색의 칸이 있는 경우 제거
	$('#fourDepthNcsCode').addClass('td-light-blue'); // 세분류칸에 선택색상 입히기

	if (fourthDepthNcsCodeList != null && fourthDepthNcsCodeList != '' && fourthDepthNcsCodeList.length != 0) {
		$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
		var html = '';
		html += '<td colspan="4">';
		for (var i = 0; i < fourthDepthNcsCodeList.length; i++) {
			// 소분류 버튼 생성 - 직업분류 선택 화면에서 사용할 버튼 UI
			html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'4\', \'' + fourthDepthNcsCodeList[i].ncsGrCode + '\');">';
			if (fourthDepthNcsCodeList[i].localYn == 'N' ) {
				html += '<span class="btn-label-icon left text-info">NCS</span>';
			} else {
				html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
			}
			html += 	fourthDepthNcsCodeList[i].ncsGrName;
			html += '</button>';
		}
		html += '</td>';
		$('#commonNcsCodeSelectBtnList').append(html); // 소분류 버튼 생성
	} else {
		$.ajax({
			url : context + 'commonModal/fourthDepthGetNcsCodeListAjax',
			type : 'POST',
			data : {
				"ncsCode": thirdDepthNcsCode
			},
			dataType : 'json',
			beforeSend: function (request) {
				// 권한체크를 위해서 Header에 Ajax 호출로 등록
				request.setRequestHeader("authCheckAjax", true);
			},
			success : function(data) {
				//console.log(data);
				fourthDepthNcsCodeList = data.ncsCodeList;
				$('#commonNcsCodeSelectBtnList').empty(); // 버튼화면 초기화
				var html = '';
				html += '<td colspan="4">';
				for (var i = 0; i < fourthDepthNcsCodeList.length; i++) {
					// 대분류 버튼 생성 - 분류체계 선택 화면에서 사용할 버튼 UI
					html += '<button type="button" class="btn btn-white mr5 mb10" onClick="commonNcsCodeSetNcsCodeClick(\'4\', \'' + fourthDepthNcsCodeList[i].ncsGrCode + '\');">';
					if (fourthDepthNcsCodeList[i].localYn == 'N' ) {
						html += '<span class="btn-label-icon left text-info">NCS</span>';
					} else {
						html += '<span class="btn-label-icon left text-danger">' + COLLEGECREATENCS + '</span>';
					}
					html += 	fourthDepthNcsCodeList[i].ncsGrName;
					html += '</button>';
				}
				html += '</td>';
				$('#commonNcsCodeSelectBtnList').append(html); // 대분류 버튼 생성
			}
		});
	}
}

//대중소세분류 선택한 ncsCode값 셋팅
function commonNcsCodeSetInitBtn(selectfirstDepthNcsCode, selectsecondDepthNcsCode, selectthirdDepthNcsCode, selectfourthDepthNcsCode) {
	if (selectfirstDepthNcsCode == null || selectfirstDepthNcsCode == '') { // null일 경우
		firstDepthNcsCode = '';
		firstDepthNcsCode = '';
		secondDepthNcsCode = '';
		thirdDepthNcsCode = '';
		fourthDepthNcsCode = '';
		firstDepthNcsName = '';
		depthNcsGrDef = '';
		depthNcsCode = '';
		depthNcsLocalYn = '';
	}
	if (selectfirstDepthNcsCode != null && firstDepthNcsCode != selectfirstDepthNcsCode) { // null이 아닐경우 대분류값에 선택된값 저장
		firstDepthNcsCode = selectfirstDepthNcsCode;
		firstDepthNcsName = selectfirstDepthNcsCode;
		for (var i = 0; i < firstDepthNcsCodeList.length; i++) {
			if (firstDepthNcsCode == firstDepthNcsCodeList[i].ncsGrCode) {
				firstDepthNcsName = firstDepthNcsCodeList[i].ncsGrName;
				depthNcsGrDef = firstDepthNcsCodeList[i].ncsGrDef;
				depthNcsCode = firstDepthNcsCodeList[i].ncsGrCode;
				depthNcsLocalYn = firstDepthNcsCodeList[i].localYn;
			}
		}
	}
	if (selectsecondDepthNcsCode != null && secondDepthNcsCode != selectsecondDepthNcsCode) {
		secondDepthNcsCode = selectsecondDepthNcsCode;
		secondDepthNcsName = selectsecondDepthNcsCode;
		for (var i = 0; i < secondDepthNcsCodeList.length; i++) {
			if (secondDepthNcsCode == secondDepthNcsCodeList[i].ncsGrCode) {
				secondDepthNcsName = secondDepthNcsCodeList[i].ncsGrName;
				depthNcsGrDef = secondDepthNcsCodeList[i].ncsGrDef;
				depthNcsCode = secondDepthNcsCodeList[i].ncsGrCode;
				depthNcsLocalYn = secondDepthNcsCodeList[i].localYn;
			}
		}
	}
	if (selectthirdDepthNcsCode != null && thirdDepthNcsCode != selectthirdDepthNcsCode) {
		thirdDepthNcsCode = selectthirdDepthNcsCode;
		thirdDepthNcsName = selectthirdDepthNcsCode;
		for (var i = 0; i < thirdDepthNcsCodeList.length; i++) {
			if (thirdDepthNcsCode == thirdDepthNcsCodeList[i].ncsGrCode) {
				thirdDepthNcsName = thirdDepthNcsCodeList[i].ncsGrName;
				depthNcsGrDef = thirdDepthNcsCodeList[i].ncsGrDef;
				depthNcsCode = thirdDepthNcsCodeList[i].ncsGrCode;
				depthNcsLocalYn = thirdDepthNcsCodeList[i].localYn;
			}
		}
	}
	if (selectfourthDepthNcsCode != null && fourthDepthNcsCode != selectfourthDepthNcsCode) {
		fourthDepthNcsCode = selectfourthDepthNcsCode;
		fourthDepthNcsName = selectfourthDepthNcsCode;
		for (var i = 0; i < fourthDepthNcsCodeList.length; i++) {
			if (fourthDepthNcsCode == fourthDepthNcsCodeList[i].ncsGrCode) {
				fourthDepthNcsName = fourthDepthNcsCodeList[i].ncsGrName;
				depthNcsGrDef = fourthDepthNcsCodeList[i].ncsGrDef;
				depthNcsCode = fourthDepthNcsCodeList[i].ncsGrCode;
				depthNcsLocalYn = fourthDepthNcsCodeList[i].localYn;
			}
		}
	}
}

//선택된 분류체계값 이름 셋팅 함수
function commonNcsCodeSetNcsNameView() {
	$('#oneDepthNcsCode').html('-'); // 대분류칸 '-'로 초기화
	if (firstDepthNcsCode != '') { // 대분류값이 선택된 경우
		$('#oneDepthNcsCode').empty(); // 대분류칸 초기화
		$('#oneDepthNcsCode').append(firstDepthNcsName);
	}
	$('#twoDepthNcsCode').html('-'); // 중분류칸 '-' 로 초기화
	if (secondDepthNcsCode != '') { // 중분류값이 선택된 경우
		$('#twoDepthNcsCode').empty(); // 중분류칸 초기화
		$('#twoDepthNcsCode').append(secondDepthNcsName);
	}
	$('#threeDepthNcsCode').html('-'); // 소분류칸 '-'로 초기화
	if (thirdDepthNcsCode != '') { // 소분류값이 선택된 경우
		$('#threeDepthNcsCode').empty(); // 소분류칸 초기화
		$('#threeDepthNcsCode').append(thirdDepthNcsName);
	}
	$('#fourDepthNcsCode').html('-'); // 세분류칸 '-'로 초기화
	if (fourthDepthNcsCode != '') { // 세분류값이 선택된 경우
		$('#fourDepthNcsCode').empty(); // 소분류칸 초기화
		$('#fourDepthNcsCode').append(fourthDepthNcsName);
	}
}

var professorList; //교수 리스트

//교수 선택 공통함수
function professorSelect (requestFnc) {
	$('#listDelModal').remove();

	var html = '';

	html += '<div id="listDelModal" class="modal fade" role="dialog">';
	html += '	<div class="modal-dialog">';
	html += '		<div class="modal-content">';
	html += '			<div class="modal-header">';
	html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="ncsTitleCloseBtn">×</button>';
	html += '				<h4 class="modal-title">교수선택</h4>';
	html += '			</div>';
	html += '			<div class="modal-body searchPanelBody">';
	html += '				<div class="col-xs-12 col-md-12 p-a-0m-b-0"><!-- 1줄 검색조건 -->';
	html += '					<div class="col-xs-12 col-md-12 p-a-0">';
	html += '						<div class="col-xs-12 col-md-6 form-group p-a-0">';
	html += '							<label class="col-md-2 control-label text-center p-a-0formLabel">계열</label>';
	html += '							<div class="col-md-10">';
	html += '								<select id="departSelect" class="form-control" onChange="getMajor(false)">';
	html += '								</select>';
	html += '							</div>';
	html += '						</div>';
	html += '						<div class="col-xs-12 col-md-6 form-group p-a-0">';
	html += '						<label class="col-md-2 control-label text-center p-a-0formLabel">학과</label>';
	html += '							<div class="col-md-10">';
	html += '								<select id="majorSelect" class="form-control">';
	html += '								</select>';
	html += '							</div>';
	html += '						</div>';
	html += '					</div>';
	html += '				</div><!-- /1줄 검색조건 -->';
	html += '				<div class="col-xs-12 col-md-12 p-a-0m-b-0"><!-- 2줄 검색조건 -->';
	html += '					<div class="col-xs-12 col-md-12 p-a-0">';
	html += '						<div class="col-xs-12 col-md-6 form-group p-a-0">';
	html += '							<label class="col-md-2 control-label text-center p-a-0formLabel">성명</label>';
	html += '							<div class="col-md-10">';
	html += '								<input type="text" id="professorName" class="form-control" />';
	html += '							</div>';
	html += '						</div>';
	html += '						<div class="col-xs-12 col-md-6 form-group p-a-0">';
	html += '							<label class="col-md-3 control-label text-center p-a-0formLabel">활동여부</label>';
	html += '							<div class="col-md-9 select2-disabled-examples select2-colors-examples">';
	html += '								<select id="useYnSelect" class="form-control">';
	html += '									<option value="Y">활동중</option>';
	html += '									<option value="N">미활동</option>';
	html += '								</select>';
	html += '							</div>';
	html += '						</div>';
	html += '					</div>';
	html += '				</div><!-- /2줄 검색조건 -->';
	html += '				<div class="col-xs-12 col-md-12 p-a-0m-b-0"><!-- 3줄 검색버튼 -->';
	html += '					<div class="col-xs-12 col-md-12 p-a-0">';
	html += '						<div class="col-xs-12 col-md-12 p-a-0">';
	html += '							<div class="col-xs-12 col-md-12 form-group form-group text-right">';
	html += '								<button type="button" class="btn btn-flare" id="professorSeach">';
	html += '									검색';
	html += '								</button>';
	html += '							</div>';
	html += '						</div>';
	html += '					</div>';
	html += '				</div><!-- /2줄 검색버튼 -->';
	html += '			</div><!-- /modal body -->';
	html += '			<hr class="m-t-0 m-b-0">';
	html += '			<div class="modal-footer">';
	html += '				<div id="professorList">';
	html += '					<div class="text-left">';
	html += '						<label class="control-label text-light-gray">총 <span id="labDataCnt">0</span>개 검색</label>';
	html += '					</div>';
	html += '					<table class="table border-light-info">';
	html += '						<thead>';
	html += '							<tr class="bg-light-info">';
	html += '								<th>#</th>';
	html += '								<th>계열</th>';
	html += '								<th>학과</th>';
	html += '								<th>성명</th>';
	html += '								<th>직위</th>';
	html += '							</tr>';
	html += '						</thead>';
	html += '						<tbody id="tblData">';
	html += '							<tr>';
	html += '								<td colspan="5">검색된 결과가 없습니다</td>';
	html += '							</tr>';
	html += '						</tbody>';
	html += '					</table>';
	html += '				</div>';
	html += '			</div><!-- /modal footer -->';
	html += '		</div><!-- /modal content -->';
	html += '	</div><!-- /modal-dialog -->';
	html += '</div><!-- / modal -->';

	$('body').append(html);

	//계열정보 가져오기
	getDepartment(false);

	$('#professorList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true });

	$('#listDelModal').modal({'backdrop' : 'static'});

	//검색버튼 클릭
	$('#professorSeach').click(function () {
		var departCode = $('#departSelect option:selected').val();
		var majorCode = $('#majorSelect option:selected').val();
		var professorName = $('#professorName').val();
		var useYn = $('#useYnSelect option:selected').val();

		loadingProgressShow();

		$.ajax({
			url : context + 'commonModal/professorSearchAjax',
			data : {
				'departCode' : departCode,
				'majorCode' : majorCode,
				'professorName' : professorName,
				'useYn' : useYn
			},
			type : 'POST',
			dataType : 'json',
			traditional : true,
			success : function(data) {

				professorList = data.list;
				var listLength = data.list.length;
				html = '';

				$('#tblData').empty();
				$('#labDataCnt').empty();

				for (var i = 0; i < listLength; i++) {
					// 160216 dy.kang 교수 순서 받아오는 부분 db에서 값을 가져오는게 아니라 list에서 바로 수정되도록 수정
					html += '<tr name="choiceProfessor" onClick="setProfessorListClick(' + i + ')" data-dismiss="modal">';
					html += '<td width="50px">' + (i + 1) + '</td>';
					//소속 계열 및 학과가 없을 경우 X 로 나오도록.
					if (professorList[i].departName != undefined && professorList[i].majorName != null && professorList[i].majorName != ' ') {
						html += '<td width="100px">' + professorList[i].departName + '</td>';
					} else {
						html += '<td width="100px">X</td>';
					}
					if (professorList[i].majorName != undefined && professorList[i].majorName != null && professorList[i].majorName != ' ') {
						html += '<td width="130px">' + professorList[i].majorName + '</td>';
					} else {
						html += '<td width="130px">X</td>';
					}
					html += '<td>' + professorList[i].professorName + ' (' + professorList[i].professorCode + ')' + '</td>';
					if(professorList[i].professorLevel == null || professorList[i].professorLevel == "undefined") {
						html += '<td width="110px"></td>';
					}
					else {
					html += '<td width="110px">' + professorList[i].professorLevel + '</td>';
					}
					html += '</tr>';
				}
				$('#labDataCnt').append(listLength);
				$('#tblData').append(html);

				$('table tbody tr').addClass('changeBg'); //hover 시 bg color 변경되는 css 추가

				$('table tbody tr[name=choiceProfessor]').click(requestFnc); //버튼을 클릭했을 때, jsp에서 받은 함수 실행

				loadingProgressHide();
			}
			, error:function(request,status,error){
				alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				loadingProgressHide();
	        }
		});
	});
}

/**
 * 계열 검색
 */
function getDepartment(isLoading) {
	if(document.getElementById('departSelect') == null)
		return;
	
	startLoading(isLoading);
	$.ajax({
		url : context + "commonModal/departListAjax",
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			var list = data.departmentList;
			var departSelected = '';
			var html = '';
			
			$('#departSelect').empty();
			
			if(data.admin == 'admin') {
				html += '<option value="">전체</option>';
			}
			
			for (var i=0; i < list.length; i++) {
				html += '<option value="' + list[i].departCode + '" >'+ list[i].departName + '</option>';
			}
			$('#departSelect').append(html);
	 		getMajor(isLoading);
		}, error:function(request,status,error){
			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				$('#departSelect').empty();
				$('#departSelect').append('<option value="ajaxError">전체</option>');
			}
		}
	}).always(function() {
		endLoading(isLoading);
	});
}

/**
 * 전공 검색
 */
function getMajor(isLoading){
	if(document.getElementById('majorSelect') == null)
		return;
	
	if(document.getElementById('departSelect') != null && $('#departSelect option:selected').val() == '') {
		return;
	}
	var departCode = $('#departSelect option:selected').val();
	if (departCode == null) {
		departCode = '';
	}
	
	startLoading(isLoading);
	
	$.ajax({
		url : context + "commonModal/majorListAjax",
		data : { 
			"departCode" : departCode 
		},
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			$('#majorSelect').empty();
			
			var list = data.majorList;
			var html = '';

			if(data.admin == 'admin') {
				html += '<option value="">전체</option>';
			}
			
			for (var i=0; i < list.length; i++) {
				html += '<option value="' + list[i].majorCode + '" >'+ list[i].majorName + '</option>';
			}
			$('#majorSelect').append(html);
			
			//세팅후 전체를 제외한 선택값이 존재시 아래 항목을 조회한다.
			if($('#majorSelect option:selected').val() != '') {
				//교수 항목이 존재시 조회
				if(document.getElementById('professorSelect') != null) {
					getProfessor(isLoading);
				}
			}
		}, error:function(request,status,error){
			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				$('#majorSelect').empty();
				$('#majorSelect').append('<option value="ajaxError">전체</option>');
			}				
			
        }
	}).always(function() {
		endLoading(isLoading);
	});
}

var ajaxStartCount = 0;
/**
 * 로딩 시작
 * reference Count를 체크하여 로딩 프로그레스가 한번만 나오도록.
 */
function startLoading(isLoading) {
	if(isLoading == false)
		return;
	
	if(ajaxStartCount == 0)
		loadingProgressShow();
	ajaxStartCount++;
}

/**
 * 로딩 끝
 * reference Count를 체크하여 로딩 프로그레스가 한번만 나오도록.
 */
function endLoading(isLoading) {
	if(isLoading == false)
		return;
	
	ajaxStartCount--;
	if(ajaxStartCount < 1) {
		loadingProgressHide();
		
		setSearchConditionByHistory(true);
	}
}

//선택한 교수 세팅
function setProfessorListClick(cnt) {
	professorList = professorList[cnt];
	professorName = professorList.professorName;
	professorCode = professorList.professorCode;
	departCode = professorList.departCode;
	departName = professorList.departName;
	majorCode = professorList.majorCode;
	majorName = professorList.majorName;
	professorLevel = professorList.professorLevel;
}

//Jhee 선택한 직업기초능력을 담을 배열
var selectedOccuBase = [];

/*Jhee 직업기초능력 선택 Modal*/
/*requestFnc : callBack함수, selectOccuVer : 직업기초능력 버전*/
function occuBaseSelect (requestFnc, selectOccuVer) {

	//모달이 그려져 있을 경우, 선택값을 유지하도록 설정
	if ($('body').find($('#occuBaseSelectModal')).length != 0) {
		$('#occuBaseSelectModal').modal({'backdrop' : 'static'});
	} else {
		$.ajax({
			url : context + 'commonModal/occuBaseSelectAjax',
			data : {
				occuBaseVer : selectOccuVer
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				var occuBaseList = '';

				occuBaseList = data.occuBaseList;
				drawModal(occuBaseList, requestFnc);
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}

	function drawModal(occuBaseList, requestFnc) {
		var html = '';

		html += '<div id="occuBaseSelectModal" class="modal fade" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
		html += '				<h4 class="modal-title">직업기초능력 선택</h4>';
		html += '			</div>';

		html += '			<div id="occuBaseList" class="modal-body padding-xlg">';
		html += ' 				<div class="col-md-8 col-md-offset-2">';
		html += '					<div id="occuCntCheck" class="col-md-12 text-bold" style="font-size:13px;">총 0개 선택</div>';
		html += '					<div class="col-md-12 padding-xs" style="border-bottom:2px solid #e4e4e4;"></div>';

		for (var i = 0; i < occuBaseList.length; i++) {
			html += '					<div class="col-md-6 p-y-2">';
			html += '						<label class="checkbox-inline">';
			html += '							<input type="checkbox" name="occuCheck" class="px"';
			html += 							' value = "'+occuBaseList[i].occuBaseCode+occuBaseList[i].occuBaseName+'">';
			html += '							<span class="lbl text-semibold">';
			html += 								occuBaseList[i].occuBaseCode+occuBaseList[i].occuBaseName;
			html += 							'</span>';
			html += '						</label>';
			html += '					</div>';
		}

		html += '				</div>';/*/col-md-8*/
	    html += '			</div>'; /*/modal-body*/

	    html += '			<hr class="m-t-0 m-b-0">';
	    html += '			<div class="modal-footer">';
	    html += '				<button id="occuBaseSaveBtn" class="btn btn-success padding-md-hr" data-dismiss="modal">저장</button>';
	    html += '				<button class="btn btn-outline padding-md-hr" data-dismiss="modal">닫기</button>';
	    html += '			</div><!-- /modal footer -->';

	    html += '		</div>';/*/modal-content*/
	    html += '	</div>';/*/modal dialog*/
	    html += '</div>';/*/modal*/

		$('body').append(html);

		//체크박스를 클릭 이벤트
		$('input[name=occuCheck]').click(function(){
			//Jhee 선택된 개수 체크
			$('#occuCntCheck').text('총 '+$('input[name=occuCheck]:checked').length + '개 선택');

			selectedOccuBase = []; //Jhee 전역변수 초기화
			$('input[name=occuCheck]:checked').each(function() {
				selectedOccuBase[selectedOccuBase.length] = $(this).val();
			});
		});

		$('#occuBaseSaveBtn').click(requestFnc); //저장버튼 클릭 이벤트
		$('#occuBaseSelectModal').modal({'backdrop' : 'static'});
	}

}

var selectedMethodTypeItem = 0;
/*dy.kang 평가방법 선택 Modal*/
/*
 * requestFnc : callBack함수
 * selectEvalType : 평가방법 1 / 교수학습방법 2
 * selectedEvalTypeValue : 현재 선택된 평가방법의 코드값 list
 * etcMethodName : 현재 저장된 기타방법의 내용
 * */
function getEvalTypePopup(requestFnc, selectEvalType, selectedEvalTypeValue, etcMethodName) {

	if (selectedMethodTypeItem == selectEvalType) {
		$('#evalTypeSelectModal').modal({'backdrop' : 'static'});
	} else {
		selectedMethodTypeItem = selectEvalType;
		var cdGrpId = '';
		// selectEvalType의 값이 1이냐 2냐에 따라서 공통그룹코드를 바꿔준다
		if (selectEvalType == '1') {
			cdGrpId = 'EVALUATIONTYPECODE';
		} else if (selectEvalType == '2') {
			cdGrpId = 'STUDY_METHOD';
		} else if (selectEvalType == '3') {
			cdGrpId = 'EQUIPMENT_ITEM_TYPE';
		} else if (selectEvalType == '4') {
			cdGrpId = 'COURSE_METHOD';
		} else if (selectEvalType == '5') {
			cdGrpId = 'BNCS_STUDY_ASSIST';
		} else if (selectEvalType == '6') {
			cdGrpId = 'BNSC_STUDY_METHOD';
		}

		$.ajax({
			url : context + 'commonCode/getCommonCdListAjax',
			data : {
				cdGrpId:cdGrpId
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {

				drawModal(data.resultList, requestFnc, selectEvalType, selectedEvalTypeValue, etcMethodName);
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}

	function drawModal(resultList, requestFnc, selectEvalType, selectedEvalTypeValue, etcMethodName) {
		var html = '';

		if ($('body').find($('#evalTypeSelectModal')).length != 0) {
			$('#evalTypeSelectModal').remove();
		}

		html += '<div id="evalTypeSelectModal" class="modal fade" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
		html += '				<h4 class="modal-title">';
		if (selectEvalType == '1') {
			html += '평가 방법 선택';
		} else if (selectEvalType == '2') {
			html += '교수 학습 방법 선택';
		} else if (selectEvalType == '3') {
			html += '기자재 및 매체 선택';
		} else if (selectEvalType == '4') {
			html += '수업방법 선택';
		} else if (selectEvalType == '5') {
			html += '보조기자재 선택';
		} else if (selectEvalType == '6') {
			html += '수업방법 선택';
		}
		html += '</h4>';
		html += '			</div>';

		html += '			<div id="evalTypeSelectList" class="modal-body padding-xlg">';
		html += ' 				<div class="col-md-10 col-md-offset-1">';
		html += '					<div id="evalTypeSelectCheck" class="col-md-12 text-bold" style="font-size:13px;">총 0개 선택</div>';
		html += '					<div class="col-md-12 padding-xs" style="border-bottom:2px solid #e4e4e4;"></div>';

		for (var i = 0; i < resultList.length; i++) {
			html += '					<div class="col-md-6 p-y-2">';
			html += 						'<label class="custom-control custom-checkbox checkbox-inline">';
			html += 							'<input type="checkbox" class="custom-control-input" name="evalTypeCheck" value = "' + resultList[i].stdCode + '">';
			html += 							'<span class="custom-control-indicator"></span>';
			html += 							'<span>'+resultList[i].stdCode + '.' + resultList[i].stdCodeName+'</span>';
			if (resultList[i].stdCodeName == '기타') {
				html += '							<input type="text" name="etcMethodText" class="form-control float-right margin-md-l" style="width:110px;height:18px;padding: 0 12px 0 12px;" />';
			}
			html += 						'</label>';
			html += '					</div>';
		}

		html += '				</div>';/*/col-md-8*/
		html += '			</div>'; /*/modal-body*/

		html += '			<hr class="m-t-0 m-b-0">';
		html += '			<div class="modal-footer">';
		html += '				<button id="evalTypeSaveBtn" class="btn btn-success padding-md-hr" data-dismiss="modal">저장</button>';
		html += '			</div><!-- /modal footer -->';

		html += '		</div>';/*/modal-content*/
		html += '	</div>';/*/modal dialog*/
		html += '</div>';/*/modal*/

		$('body').append(html);

		//체크박스를 클릭 이벤트
		$('input[name=evalTypeCheck]').click(function(){
			//Jhee 선택된 개수 체크
			$('#evalTypeSelectCheck').text('총 '+$('input[name=evalTypeCheck]:checked').length + '개 선택');
		});

		// 현재 저장된 내용이 있을 경우
		if (selectedEvalTypeValue != null && selectedEvalTypeValue.length != 0) {
			// 저장된 내용만큼 돌면서
			for (var i = 0; i < selectedEvalTypeValue.length; i++) {
				// input의 name이 evalTypeCheck 이면서 value값이 저장된 내용의 코드값인 checkbox를 check 시켜준다
				$('input[name=evalTypeCheck][value=' + selectedEvalTypeValue[i] + ']').prop('checked', true);
			}
			
			$('#evalTypeSelectCheck').text('총 '+$('input[name=evalTypeCheck]:checked').length + '개 선택');
		}

		// 기타내용이 있을 경우
		if (etcMethodName != null && etcMethodName != '') {
			// 기타저장칸에 저장시켜준다.
			$('input[name=etcMethodText]').val(etcMethodName);
		}

		$('#evalTypeSaveBtn').click(requestFnc); //저장버튼 클릭 이벤트
		$('#evalTypeSelectModal').modal({'backdrop' : 'static'});
	}

}



/////////////////////////////////////////////////////////////////////////////////////	여기부터 신규////////////////////////////////////////////


function jobManageSelect (requestFnc, selectedVal) {
	//모달이 그려져 있을 경우, 선택값을 유지하도록 설정
	if ($('body').find($('#jobManageSelectModal')).length != 0) {
		$('button[name=choicejobManageCode]').each(function() {
			$(this).removeClass('btn-outline');

			//선택된 값과 버튼의 값이 일치할 경우 class 추가
			if(selectedVal == $(this).val()) {
				$(this).addClass('btn-outline');
			}
		});
		$('#jobManageSelectModal').modal({'backdrop' : 'static'});
	} else {
		$.ajax({
			url : context + 'commonModal/jobManageSelectAjax',
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				var departList = '';
				var jobManageList = '';

				departList = data.departList;
				jobManageList = data.jobManageList;

				drawModal(departList,jobManageList,requestFnc, selectedVal);
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}

	function drawModal(departList,jobManageList,requestFnc, selectedVal) {
		var html = '';

		html += '<div id="jobManageSelectModal" class="modal fade" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="ncsTitleCloseBtn">×</button>';
		html += '				<h4 class="modal-title">직무선택</h4>';
		html += '			</div>';

		html += '			<div id="jobManageList" class="modal-body">';
		for (var i = 0; i < departList.length; i++) {
			html += '				<div class="panel panel-success';
			//홀수일 경우 어두운 배경색
			if (i%2 != 0) {
				html += ' panel-dark';
			}
			html += ' m-b-0 no-border-radius">';
			html += '					<div class="panel-heading text-center cursor-pointer" data-toggle="collapse" data-target="#'+departList[i].departCode+'">';
			html +=                     departList[i].departName;
			html += '					</div>';
			html += '					<div id="'+departList[i].departCode+'" class="panel-collapse';

			//첫번째 panel만 open, 나머지는 close처리
			if (i == 0) {
				html += ' in';
			} else {
				html += ' collapse';
			}
			html += '">';
			html += '						<div class="panel-body">';
			for (var j = 0; j < jobManageList.length; j++) {
				if(departList[i].departCode == jobManageList[j].departCode) {
					html += '							<button type="button" name="choicejobManageCode" class="btn padding-md-hr margin-sm-hr margin-sm-b';

					//jsp 저장된 값과 jobManageCode값이 동일할 경우, active class 추가
					if(selectedVal == jobManageList[j].jobManageCode) {
						html += ' btn-outline';
					}
					html += '	" data-dismiss="modal" value="'+jobManageList[j].jobManageCode+'">';
					html += 							jobManageList[j].jobManageName;
					html += 							'</button>';
				}
			}
			html += '						</div>';
			html += '					</div>';
			html += '				</div>';
		}
		html += '			</div>'; /* /modal body */
		html += '		</div>'; /* /modal content */
		html += '	</div>'; /*/modal dialog*/
		html += '</div>'; /*/ #jobManageSelectModal*/

		$('body').append(html);
		$('#jobManageList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용

		$('button[name=choicejobManageCode]').click(requestFnc); //버튼을 클릭했을 때, jsp에서 받은 함수 실행
		$('#jobManageSelectModal').modal({'backdrop' : 'static'});
	}
}
//***인하공전 특성 : 비ncs의 수업활동을 불러오기 위하여 subjectType을 전달
function setLessonActivity(requestFnc, selectedWeek, selectedEduType, subjectType) {

	$.ajax({
		url : context + 'commonModal/getLectPlanEduTypeAjax',
		data : {"subjectType" : subjectType},
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			drawModalLessonActivity(data.lectPlanEduType, requestFnc, selectedWeek, selectedEduType);
		}
		, error:function(request,status,error){

			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
			}

		}
	}).always(function() {
		loadingProgressHide();
	});

	function drawModalLessonActivity(lectPlanEduType, requestFnc, selectedWeek, selectedEduType) {
		var html = '';

		if ($('body').find($('#eduTypeSelectModal')).length != 0) {
			$('#eduTypeSelectModal').remove();
		}

		html += '<div id="eduTypeSelectModal" class="modal fade" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
		html += '				<h4 class="modal-title">';
		html += '				수업활동 선택';
		html += '				</h4>';
		html += '			</div>';

		html += '			<div id="evalTypeSelectList" class="modal-body padding-xlg">';
		html += ' 				<div class="col-md-10 col-md-offset-1">';
		html += '					<div id="evalTypeSelectCheck" class="col-md-12 text-bold" style="font-size:13px;">';
		html += parseInt(selectedWeek)+1 + '주차';
		html += '					</div>';
		html += '					<div class="col-md-12 padding-xs" style="border-bottom:2px solid #e4e4e4;"></div>';

		for (var i = 0; i < lectPlanEduType.length; i++) {
			html += '					<div class="col-md-6 p-y-2">';
			html += '						<label class="custom-control custom-checkbox checkbox-inline">';
			//***인하공전 특성 : 일반교과 8주차 중간고사 15주차 기말고사 설정(타 주차 설정 불가)
			if(subjectType == 'C' && (lectPlanEduType[i].stdCode == 'MT' || lectPlanEduType[i].stdCode == 'FT')){
				html += '							<input type="checkbox" name="eduTypeCheck" class="custom-control-input"';
				html += '								value = "' + lectPlanEduType[i].stdCode + '" disabled>';
			} else if(subjectType != 'C' && selectedWeek == 0 && (lectPlanEduType[i].stdCode == 'B' || lectPlanEduType[i].stdCode == 'Q')){
				//***인하공전 특성 : 일반교과가 아니면 1주차의 오리엔테이션,기타를 고정값으로 설정(타 주차 설정 가능)
				html += '							<input type="checkbox" name="eduTypeCheck" class="custom-control-input"';
				html += '								value = "' + lectPlanEduType[i].stdCode + '" disabled>';
			} else {
				html += '							<input type="checkbox" name="eduTypeCheck" class="custom-control-input"';
				html += '								value = "' + lectPlanEduType[i].stdCode + '">';
			}
			html += '							<span class="custom-control-indicator"></span>';
			html += '							<span>'+lectPlanEduType[i].stdCodeName+'</span>';
			html += '						</label>';
			html += '					</div>';
		}

		html += '				</div>';/*/col-md-8*/
		html += '			</div>'; /*/modal-body*/

		html += '			<hr class="m-t-0 m-b-0">';
		html += '			<div class="modal-footer">';
		html += '				<button id="eduTypeSaveBtn" class="btn btn-success padding-md-hr" data-dismiss="modal">저장</button>';
		html += '				<button class="btn btn-outline padding-md-hr" data-dismiss="modal">닫기</button>';
		html += '			</div><!-- /modal footer -->';

		html += '		</div>';/*/modal-content*/
		html += '	</div>';/*/modal dialog*/
		html += '</div>';/*/modal*/

		$('body').append(html);

		// 현재 저장된 내용이 있을 경우
		if (selectedEduType != null && selectedEduType.length != 0) {
			// 저장된 내용만큼 돌면서
			for (var i = 0; i < selectedEduType.length; i++) {
				// input의 name이 evalTypeCheck 이면서 value값이 저장된 내용의 코드값인 checkbox를 check 시켜준다
				$('input[name=eduTypeCheck][value=' + selectedEduType[i] + ']').prop('checked', true);
			}
		}

		$('#eduTypeSaveBtn').click(function(){
			requestFnc(selectedWeek); //저장버튼 클릭 이벤트
		});

		$('#eduTypeSelectModal').modal({'backdrop' : 'static'});
	}
}

var collegeList = [];
//Jhee openPage : 모달이 호출된 메뉴를 구분하기 위한 변수(currDev-교육과정 개발 : 본인소속 직무만 검색가능, eduCommission-위원회관리 : 전체 직무 검색가능)
// 180116 dy.kang 교육과정개발에서 직무추가 선택시 교육과정 개발중인 학과의 직무가 나오도록 수정
function mainJobManageSelect (requestFnc, selectedVal, openPage, currCode) {

	// 160216 dy.kang 기존값 유지하지 않도록 수정
	//모달이 그려져 있을 경우, 선택값을 유지하도록 설정
	if ($('body').find($('#mainJobManageSelectModal')).length != 0) {
		// 선택한 값을 입력하는 함수(초기셋팅으로 빈칸을 넣어준다)
		commonNcsCodeSetInitBtn('', '', '', '');
		// 입력된 내용에 따라 다음 버튼 보여주기(초기값이므로 초기값이 셋팅됨)
		commonNcsCodeSetNextBtnList();
		// 입력된 내용에 따라 이름 입력해주기(초기값이므로 - 가 셋팅됨)
		commonNcsCodeSetNcsNameView();
		$('button[name=choicejobManageCode]').each(function() {
			$(this).removeClass('btn-outline');

			//선택된 값과 버튼의 값이 일치할 경우 class 추가
			if(selectedVal == $(this).val()) {
				$(this).addClass('btn-outline');
			}
		});
		$('#mainJobManageSelectModal').modal({'backdrop' : 'static'});
	} else {
		// 180116 dy.kang 교육과정개발에서 직무추가 선택시 교육과정 개발중인 학과의 직무가 나오도록 수정
		$.ajax({
			url : context + 'commonModal/mainJobManageSelectAjax',
			type : 'POST',
			data : ({
				'openPage' : openPage,
				'currCode' : currCode
			}),
			dataType : 'json',
			success : function(data) {

				collegeList = [];
				collegeList = data.collegeList;
				firstDepthNcsCodeList = [];
				firstDepthNcsCodeList = data.ncsList;

				drawModal(requestFnc, selectedVal);
			}
			, error:function(request,status,error){

				if(request.status == '403') {
					alert("session 만료되었습니다.");
					location.href = '<c:url value="/login"/>';
				} else {
					alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
				}

			}
		}).always(function() {
			loadingProgressHide();
		});
	}

	function drawModal(requestFnc, selectedVal) {
		
		var html = '';

		html += '<div id="mainJobManageSelectModal" class="modal fade" tabindex="-1" role="dialog">';
		html += '	<div class="modal-dialog w50">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="ncsTitleCloseBtn">×</button>';
		html += '				<h4 class="modal-title">직무선택</h4>';
		html += '			</div>';
		
		html += '			<div class="modal-body">';
		html += '				<div>';
		html += '					<ul class="nav nav-yg nav-tabs bs-tabdrop-example">';
		html += '						<li class="active"><a href="#bs-tabdrop-tab1" data-toggle="tab">대학 선정 직무</a></li>';
		html += '						<li><a href="#bs-tabdrop-tab2" data-toggle="tab">NCS 직무(세분류)</a></li>';
		html += '					</ul>';
		html += '					<div class="tab-content tab-content-bordered">';
		html += '						<!-- tab1 -->';
		html += '						<div class="tab-pane active" id="bs-tabdrop-tab1">';
		html += '							<div class="table-flare col-sm-auto">';
		html += '								<!-- table-striped:1줄 간격으로 background설정, table-bordered:모든 행과 컬럼에 border설정, table-hover:행이 hover될 때 background-color변경 -->';
		html += '								<table id="example" class="table table-striped table-bordered table-hover w100">';
		html += '								</table>';
		html += '							</div>';
		html += '						</div><!-- / .tab1 -->';
		html += '						<!-- tab2 -->';
		html += '						<div class="tab-pane" id="bs-tabdrop-tab2">';
		html += '							<div class="table-flare col-sm-auto">';
		html += '								<table class="table table-bordered w100">';
		html += '									<thead>';
		html += '										<tr>';
		html += '											<th class="bg-dark-blue text-semibold">대분류</th>';
		html += '											<th class="bg-dark-blue text-semibold">중분류</th>';
		html += '											<th class="bg-dark-blue text-semibold">소분류</th>';
		html += '											<th class="bg-dark-blue text-semibold">세분류</th>';
		html += '										</tr>';
		html += '										<tr>';
		html += '											<th id="oneDepthNcsCode" class="td-light-blue"></th>';
		html += '											<th id="twoDepthNcsCode"></th>';
		html += '											<th id="threeDepthNcsCode"></th>';
		html += '											<th id="fourDepthNcsCode"></th>';
		html += '										</tr>';
		html += '									</thead>';
		html += '									<tbody>';
		html += '										<tr id="commonNcsCodeSelectBtnList">';
		html += '											<td colspan="4"></td>';
		html += '										</tr>';
		html += '									</tbody>';
		html += '								</table>';
		html += '							</div>';
		html += '						</div><!-- / .tab2 -->';
		html += '					</div>';
		html += '				</div>';

		html += '			</div>'; /* /modal body */
		html += '		</div>'; /* /modal content */
		html += '	</div>'; /*/modal dialog*/
		html += '</div>'; /*/ #jobManageSelectModal*/

		$('body').append(html);
		$('#jobManageList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용

		$('button[name=choicejobManageCode]').click(requestFnc); //버튼을 클릭했을 때, jsp에서 받은 함수 실행
		$('#mainJobManageSelectModal').modal({'backdrop' : 'static'});

		var dataSet = [];
		// 160729 dy.kang rowsgroup 을 사용하기 위해서 번호 선택을 따로 유지한다
		var index = 1;
		var beforeJobSeq = '';
		if (collegeList != null && collegeList.length != 0) {
			var temp = [];
			for (var i = 0; i < collegeList.length; i++) {
				temp = [];
				// 160729 dy.kang rowsgroup을 사용하기 위해서 번호 선택을 따로 유지한다
				if (beforeJobSeq != '' && beforeJobSeq != collegeList[i].jobSeq) {
					temp[0] = ++index;
				} else {
					temp[0] = index;
				}
				temp[1] = collegeList[i].collegeName;
				temp[2] = collegeList[i].departName;
				temp[3] = collegeList[i].firstName;
				temp[4] = collegeList[i].secondName;
				temp[5] = collegeList[i].thirdName;
				temp[6] = collegeList[i].fourthName;
				temp[7] = collegeList[i].jobName;

				dataSet[dataSet.length] = temp;
				beforeJobSeq = collegeList[i].jobSeq;
			}
		}

		$('#example2 tbody tr').removeClass('cursor-pointer'); //테이블 그리기 전, class remove
		var table = $('#example').DataTable({
           columns: [
               {
                   title: '#',
                   className: 'text-center cursor-pointer', //class부여
               },
               {
                   title: '계열',
                   className: 'cursor-pointer', //class부여
               },
               {
                   title: '학과',
                   className: 'cursor-pointer', //class부여
               },
               {
                   title: '대분류',
                   className: 'cursor-pointer', //class부여
               },
               {
                   title: '중분류',
                   className: 'cursor-pointer', //class부여
               },
               {
            	   title: '소분류',
            	   className: 'cursor-pointer', //class부여
               },
               {
            	   title: '세분류',
            	   className: 'cursor-pointer', //class부여
               },
               {
            	   title: '직무명',
            	   className: 'cursor-pointer', //class부여
               },
           ],
           data: dataSet,
           rowsGroup: [0, 1, 2, 7], //rowspan
           // 기본은 정렬을 사용하며 rowspan을 사용할 경우, 정렬에 문제가 발생하는 지 확인한 후 속성값을 변경한다
           "bPaginate": true,
           "bFilter": true,
	   // 160729 dy.kang rowsgroup 사용시 ordering이 false일 경우 페이징 처리에서 오류가 발생함
           "ordering": false
       });

		
		$(document).on("click", "#example.table tbody tr", function() {
			requestFnc('Y', $(this));
			$('#mainJobManageSelectModal').modal('hide');
		});

		fourthDepthEventSet = true;
		fourthEvent = function() {
			requestFnc('N', null);
			$('#mainJobManageSelectModal').modal('hide');
		};
		// 선택한 값을 입력하는 함수(초기셋팅으로 빈칸을 넣어준다)
		commonNcsCodeSetInitBtn('', '', '', '');
		// 입력된 내용에 따라 다음 버튼 보여주기(초기값이므로 초기값이 셋팅됨)
		commonNcsCodeSetNextBtnList();
		// 입력된 내용에 따라 이름 입력해주기(초기값이므로 - 가 셋팅됨)
		commonNcsCodeSetNcsNameView();
	}
}

//20160721 Jhee 자체 능력단위 선택 모달(직무모형 설정에서 사용됨)
//**마산대 특화 : 능력단위 버전 조건을 위하여 currYear변수를 받음
function setAbilModal(lastTrId, currCode, selectedVal, jobSeq, currYear) {

	$.ajax({
		url : context + 'commonModal/abilMasListAjax',
		type : 'POST',
		dataType : 'json',
		data : {
   			currCode : currCode,
   			currYear : currYear
   		},
		success : function(data) {
			drawAbilModal(lastTrId, selectedVal, jobSeq, data);
		}
		, error:function(request,status,error){
			if(request.status == '403') {
				alert("session 만료되었습니다.");
				location.href = '<c:url value="/login"/>';
			} else {
				alert("데이터를 불러오지 못하였습니다.\n다시 시도해 주세요.");
			}
		}
	}).always(function() {
		loadingProgressHide();
	});

	function drawAbilModal(lastTrId, selectedVal, jobSeq, data) {
		var html = '';
		var abilList = data.list;
		var unitList = data.unitList;
		
		if ($('body').find($('#abilModal')).length != 0) {
			$('#abilModal').remove();
		}

		html += '<div id="abilModal" class="modal fade" role="dialog">';
		html += '	<div class="modal-dialog">';
		html += '		<div class="modal-content">';
		html += '			<div class="modal-header">';
		html += '				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
		html += '				<h4 class="modal-title">';
		html += '				<spring:message code="message.collegencs"/> 능력단위 선택';
		html += '				</h4>';
		html += '			</div>';

		html += '			<div id="abilModalList" class="modal-body">';
		html += '				<div class="content-top">';
		html += '					<h5 class="float-left text-semibold">선택된 능력단위 개수 : <span id="selectedAbil">0개</span></h5>';
		html += '					<button id="saveJobBtn" class="btn btn-success float-right">선택하기</button>';
		html += '				</div>';
		html += '				<table id="abilModalTbl" class="table table-flare table-striped table-bordered table-hover w100"></table>';
		html += '			</div>'; /*/modal-body*/

		html += '		</div>';/*/modal-content*/
		html += '	</div>';/*/modal dialog*/
		html += '</div>';/*/modal*/

		$('body').append(html);
		$('#abilModalList').perfectScrollbar({ height: 500, alwaysVisible: true, color: '#888',allowPageScroll: true }); //스크롤 적용
		$('#abilModal').modal({'backdrop' : 'static'});
		
		var dataSet = [];
		
		if ( abilList != null && abilList.length != 0) {
			var temp = [];
			var chkYn = false; //기존에 선택된 값인지 체크하기 위한 변수
			
			for (var i = 0; i < abilList.length; i++) {
				temp = [];
				
				if(selectedVal != null && selectedVal.length != 0){
					for (var j = 0; j < selectedVal.length; j++) {
						//부모 테이블에 선택되어 있는 자체 능력단위 코드가 현재의 능력단위 코드와 같을 경우
						if(abilList[i].ncsCode == selectedVal[j]){
							chkYn = true; //체크박스를 체크하기 위한 변수를 true값으로 변경
							break;        //현재 i for문의 ncsCode는 한 개 뿐이므로, 동일값을 발견하면 for문을 중단한다
						}
					}
				}
				
				if(chkYn){
					temp[0] = '<label class="px-single"><input type="checkbox" name="abilChk" class="px" value="'+abilList[i].ncsCode+'_'+abilList[i].ncsVer+'" checked/><span class="lbl"></span></label>';
					chkYn = false; //변수 초기화
				} else {
					temp[0] = '<label class="px-single"><input type="checkbox" name="abilChk" class="px" value="'+abilList[i].ncsCode+'_'+abilList[i].ncsVer+'" /><span class="lbl"></span></label>';
				}
				
				temp[1] = i+1; //1번째 컬럼은 순번
				temp[2] = abilList[i].collegeName;
				temp[3] = abilList[i].departName;
				temp[4] = abilList[i].ncsCode +'_'+ abilList[i].ncsVer;
				temp[5] = abilList[i].ncsName;
				temp[6] = abilList[i].uDate;

				dataSet[dataSet.length] = temp;
			}
		}

		$('#abilModalTbl tbody tr').removeClass('cursor-pointer'); //테이블 그리기 전 class 중복 방지를 위해 remove
		
		var table = $('#abilModalTbl').DataTable({
			columns: [	 {
				             title: '<label class="px-single"><input type="checkbox" id="abilChk-all" class="px"/><span class="lbl"></span></label>',
				             className: 'text-center cursor-pointer',
				             width: '30px'
				         },
			             {
			                 title: '#',
			                 className: 'text-center cursor-pointer',
			                 width: '30px'
			             },
			             {
			                 title: '계열',
			                 className: 'cursor-pointer text-center',
			                 width: '100px'
			             },
			             {
			                 title: '학과',
			                 className: 'cursor-pointer text-center',
			                 width: '100px'
			             },
			             {
			                 title: '분류번호',
			                 className: 'cursor-pointer text-center',
			                 width: '150px'
			             },
			             {
			                 title: '능력단위',
			                 className: 'cursor-pointer minW100px'
			             },
			             {
			          	   title: '최종갱신일',
			          	   className: 'cursor-pointer text-center', 
			          	   width: '100px'
			             }
			         ],
			data: dataSet,
			dom: 'tp',
			"bPaginate": false,
			"ordering": true
		});
		
		$('.dataTables_filter input').attr('placeholder', '입력하세요'); //검색창에 placeholder 추가
		$('#abilModalTbl tbody tr').addClass('cursor-pointer');      //hover 시 cursor-pointer 변경
		
		//======================================= 체크박스 제어 evt ==========================================
		//부모 테이블에 선택된 능력단위가 있어 체크박스가 활성화된 경우, 해당 row에 class를 추가한다
		$('input[name="abilChk"]').each(function(){
			if($(this).is(":checked")){
				$(this).closest('tr').addClass('bg-light-info');
				$(this).closest('tr').children().addClass('bg-light-info');
			}
		});
		
		//활성화된 체크박스의 수와 전체 체크박스의 수가 동일할 때, 전체선택 체크박스를 활성화 한다
		if($('input[name="abilChk"]:checked').length == $('input[name="abilChk"]').length){
			$('#abilChk-all').prop('checked',true);
		} else {
			$('#abilChk-all').prop('checked',false);
		}
		
		$('#selectedAbil').text($('input[name="abilChk"]:checked').length+'개'); //선택된 체크박스 개수
		
		var tempAbilChk = '0'; //체크박스를 선택했을 때 행클릭 이번트가 동시에 발생하는 것 방지용
		//체크박스를 클릭했을 때의 evt
		$('input[name="abilChk"]').click(function(){
			var chk = $(this).is(":checked");
			
			if(chk){
				$(this).closest('tr').addClass('bg-light-info');
				$(this).closest('tr').children().addClass('bg-light-info');
			} else {
				$(this).closest('tr').removeClass('bg-light-info');
				$(this).closest('tr').children().removeClass('bg-light-info');
			}
			
			//체크박스의 개수와 선택된 체크박스의 개수가 같을 경우
			if($('input[name="abilChk"]:checked').length == $('input[name="abilChk"]').length){
				$('#abilChk-all').prop('checked',true);
			} else {
				$('#abilChk-all').prop('checked',false);
			}
			
			$('#selectedAbil').text($('input[name="abilChk"]:checked').length+'개'); //선택된 체크박스 개수
			tempAbilChk = '1';
		});
		
		//체크박스 전체선택 및 해제
		$('#abilChk-all').click(function(){
			var chk = $(this).is(":checked");
			
			if(chk){
				$('input[name="abilChk"]').prop("checked",true);
				
				//전체 선택 시 모든 tr bg-color변경
				$('#abilModalTbl tbody tr').addClass('bg-light-info');
				$('#abilModalTbl tbody tr').children().addClass('bg-light-info');
			}else{
				$('input[name="abilChk"]').prop("checked",false);
				
				//전체 선택해제 시 모든 tr bg-color삭제
				$('#abilModalTbl tbody tr').removeClass('bg-light-info');
				$('#abilModalTbl tbody tr').children().removeClass('bg-light-info');
			}

			$('#selectedAbil').text($('input[name="abilChk"]:checked').length+'개'); //선택된 체크박스 개수
		});
		
		//행 클릭시 발생하는 evt
		$('#abilModalTbl tbody tr').click(function(){
			if (tempAbilChk == '1') {
				tempAbilChk = '0';
				return;
			}
			//tr 클릭 시, checkbox 체크
			if ($(':checkbox', this).is(":checked")){
				$(':checkbox', this).prop("checked",false);
			} else {
				$(':checkbox', this).prop("checked",true);
			}
			//tr 클릭 시, bg color 변경
			if ( $(this).hasClass('bg-light-info') ) {
				$(this).removeClass('bg-light-info');
				$(this).children().removeClass('bg-light-info');
			} else {
				$(this).addClass('bg-light-info');
				$(this).children().addClass('bg-light-info');
			}
			
			//체크박스의 개수와 선택된 체크박스의 개수가 같을 경우
			if($('input[name="abilChk"]:checked').length == $('input[name="abilChk"]').length){
				$('#abilChk-all').prop('checked',true);
			} else {
				$('#abilChk-all').prop('checked',false);
			}
			
			$('#selectedAbil').text($('input[name="abilChk"]:checked').length+'개'); //선택된 체크박스 개수
		});
		//======================================== 체크박스 제어 evt 끝 ========================================
		
		
		//선택하기 버튼 클릭시, 선택된 row의 id값들을 배열에 담아 setParentJob fnc를 실행한다
		$('#saveJobBtn').click(function(){
			var chkNcsList = [];  //선택된 능력단위를 담을 배열(20180419 Jhee)
			var chkUnitList = []; //선택된 능력단위와 요소 리스트를 담을 배열
			
			//선택된 능력단위의 id값을 변수에 배열로 담는다
			$('input[name="abilChk"]:checked').each(function(){
				chkNcsList[chkNcsList.length] = $(this).val(); //선택된 능력단위(체크박스의 값) 배열담기(20180419 Jhee)
				for(var i=0; i<unitList.length; i++) {
					if($(this).val() == (unitList[i].ncsCode + '_' + unitList[i].ncsVer)) {
						chkUnitList[chkUnitList.length] = unitList[i];
					}
				}	
			});
			
			//[20180419 Jhee 기존 선택된 능력단위와 현재 modal에서 선택된 능력단위의 변화 확인 ---------------------
			chkNcsList.sort();  //두 배열의 정렬 맞추기
			selectedVal.sort(); //두 배열의 정렬 맞추기
			
			//두 배열의 길이가 상이한 경우 데이터가 변경된 것임으로 전역변수 변경
			if(chkNcsList.length > selectedVal.length || chkNcsList.length < selectedVal.length) {
				chgData = true; //jobModelList.jsp의 전역변수 변경
			} else {
				//두 배열의 길이가 동일한 경우 위에서 정렬을 맞추었음으로 i번째 능력단위가 동일하지 않으면 데이터가 변경된 것
				for(var i=0; i<chkNcsList.length; i++) {
					if(chkNcsList[i] != selectedVal[i]) {
						chgData = true; //jobModelList.jsp의 전역변수 변경
						break;
					}
				}
			}
			//20180419 Jhee 기존 선택된 능력단위와 현재 modal에서 선택된 능력단위의 변화 확인] ---------------------
			
			//선택된 능력단위가 있을경우에는 fnc를 실행하고 선택된 능력단위가 없을경우 모달을 닫는다
			if(chkUnitList != null && chkUnitList != '' && chkUnitList.length != 0) {
				setParentJob(lastTrId, chkUnitList);
			} else {
				//선택된 능력단위가 있었으나, 현재 선택한 능력단위가 없을경우에는 부모창에 그려진 자체능력단위를 삭제한다
				if(selectedVal != null && selectedVal.length != 0){
					//부모 테이블에 데이터가 없을 경우에는 데이터가 없습니다 row를 그려준다
					if($('#tbody'+lastTrId).hasClass('noData')) {
						$('#tbody'+lastTrId).empty();
						$('#tbody'+lastTrId).append('<tr><input type="hidden" class="ncsNum" value="0"><td colspan="4" class="no-border-hr">선택된 능력단위가 없습니다</td></tr>');
						$('#noDataYn'+lastTrId).val('');
						$('#noDataYn'+lastTrId).val('Y');
					}
					$('#tbody'+lastTrId+' .localTr').remove(); //능력단위 추가에서 추가된 row는 모두 삭제
				}
				$('.close').click();
			}
		});
	}
	
	//모달을 호출한 테이블에 능력단위 추가하기 위한 fnc
	function setParentJob(lastTrId, chkUnitList) {
		var html = '';
		
		var currOccuCode = lastTrId.replace(jobSeq, '');   // 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류   
		
		$('#tbody'+lastTrId+' .localTr').remove(); //능력단위 추가에서 추가된 row는 모두 삭제
		
		//부모 테이블에 데이터가 없을 경우에는 모든 내용을 삭제하고 다시 그리기 때문에 rowNum을 0으로 설정한다
		if($('#tbody'+lastTrId).hasClass('noData')) { 
			var rowNum = 0;
		} else {
			var rowNum = Number($('#last'+lastTrId).prev().children().eq(0).val()); //마지막 row의 번호
		}
		
		var beforeNcsCode = '';
		
		for(var i=0; i<chkUnitList.length; i++){
			if(i==0){
				rowNum++;
			} else {
				if(chkUnitList[i].ncsCode != chkUnitList[i-1].ncsCode) {
					rowNum++;
				}
			}
			
			var trNameCode = currOccuCode + '_' + jobSeq + '_' + chkUnitList[i].ncsCode + '_' + chkUnitList[i].ncsVer;   // 171010_직무모형설정_버전번경추가
			
			html += '<tr class="localTr" name="tr_' + trNameCode + '">';	 // 171010_직무모형설정_버전번경추가
			html += '	<td class="b-l-0">'+rowNum+'</td>';
			
			if (beforeNcsCode == chkUnitList[i].ncsCode) {
				html += '<input type="hidden" name="jobSeq" value="'+jobSeq+'" disabled/>';
				html += '<input type="hidden" name="ncsCode" value="'+chkUnitList[i].ncsCode+'" class="localNcs" disabled/>';
				html += '<input type="hidden" name="ncsVer" value="'+chkUnitList[i].ncsVer+'" disabled/>';
			} else {
				html += '<input type="hidden" name="jobSeq" value="'+jobSeq+'" />';
				html += '<input type="hidden" name="ncsCode" value="'+chkUnitList[i].ncsCode+'" class="localNcs" />';
				html += '<input type="hidden" name="ncsVer" value="'+chkUnitList[i].ncsVer+'" />';
			}
			html += '	<td class="bg-light-danger text-semibold">'+chkUnitList[i].ncsName+'</td>';
			/* 171010_직무모형설정_버전번경추가  [[  */
            		html += '	<td class="bg-light-danger text-semibold"><span class="text-normal">'+chkUnitList[i].ncsCode+ '_' + chkUnitList[i].ncsVer + '</span></td>';
			html += '	<td>';
			html += '		<button type="button" name="ncsVerBtn" class="btn btn-flare ml10 mt10 mb10" onclick="ncsVerBtnClick(this);" value="' + trNameCode + '" disabled >버전 변경</button>';
			html += '	</td>';	                            
			/* 171010_직무모형설정_버전번경추가  ]]  */ 			
			html += '	<td class="text-left">'+chkUnitList[i].abilUnitFacName+'<input type="hidden" value="'+chkUnitList[i].abilUnitFacCode+'" /></td>';
			html += '	<td class="no-border-r">'+chkUnitList[i].abilLevel+'</td>';
			html += '</tr>'
				
			beforeNcsCode = chkUnitList[i].ncsCode;
		}
		
		if($('#tbody'+lastTrId).hasClass('noData')) { //부모 테이블에 데이터가 없을 경우에는 tbody에 데이터를 삽입
			$('#tbody'+lastTrId).empty(); //선택된 능력단위가 없습니다 row를 삭제하기 위하여 tbody초기화
			$('#tbody'+lastTrId).append(html);
			
			$('#noDataYn'+lastTrId).val('');
			$('#noDataYn'+lastTrId).val('N');
			
			// 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류  [[ 
			mergeCell(document.getElementById('tbl'+lastTrId), '2', '3', '1', '0');  // 171010_직무모형설정_버전번경추가   // 번전변경 컬럼 병합
			mergeCell(document.getElementById('tbl'+lastTrId), '2', '2', '1', '0');  // 171010_직무모형설정_버전번경추가 
			mergeCell(document.getElementById('tbl'+lastTrId), '2', '1', '1', '0');
			mergeCell(document.getElementById('tbl'+lastTrId), '2', '0', '1');
			// 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류  ]]
		} else {       //데이터가 있을 경우에는 마지막 행 뒤에 데이터를 삽입
			var beforeTrLength = $('#tbody' + lastTrId).children().length + 1;   // 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류  
			$(html).insertBefore($('#last'+lastTrId));
			
			// 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류   [[
			mergeCell(document.getElementById('tbl'+lastTrId), beforeTrLength, '3', '1', '0');  // 171010_직무모형설정_버전번경추가   // 번전변경 컬럼 병합
			mergeCell(document.getElementById('tbl'+lastTrId), beforeTrLength, '2', '1', '0');  // 171010_직무모형설정_버전번경추가 
			mergeCell(document.getElementById('tbl'+lastTrId), beforeTrLength, '1', '1', '0');
			mergeCell(document.getElementById('tbl'+lastTrId), beforeTrLength, '0', '1');
			// 171010_직무모형설정_버전번경추가 : 171106_추가수정_자체능력단위 추가 오류   ]] 

		}
	
		//setKNum();
		
		$('.close').click();
	}
}
