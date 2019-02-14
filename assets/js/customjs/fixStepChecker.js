/**
 *	잠금시 저장안되도록 확인하는 코드
 *	생성일자 : 2016.02.01
 *	작성자: dy.kang
 *
 *   
 */
	function setFixStepCheck(currCode, stepCode, subStepCode) {
		// 170103 dy.kang 화면상의 버튼 제어가 들어가면 안되는 부분에 대해서(해당 페이지에서 바로 버튼 제어가 들어가는 경우) subStepCode가 -1일 경우 상태값 비교 안하도록 수정
		if (subStepCode != '-1') {
			$('.btn-tempSaveBtn').hide();
			$('.btn-saveBtn').hide();
			$('.btn-delBtn').hide();
		}
		
		// 180206 dy.kang 프로파일 작성과 같이 return 한 뒤에 체크하는 경우 return 시킬 변수 선언
		var returnText = '';
		// 160803 dy.kang STEP 프로파일 저장 개수 가져올 때 일반 교과목 제외시키는 변수 (포함하려면 TRUE값을 넘김)
		var subjectCSave = SUBJECT_C_SAVE;
		$.ajax({
			url : context + "currDev.commonStep/getStepStatusDataAjax",
			data : {
				'currCode' : currCode,
				'stepCode' : stepCode,
				'subStepCode' : subStepCode,
				'subjectCSave' : subjectCSave
			},
			type : 'POST',
			// 180206 dy.kang ajax 통신 동기화 시켜서 해당 ajax가 끝나야 다음 함수 타도록 수정
			async: false,
			dataType : 'json',
			success : function(data) {
				var devCurr = data.devCurr;
				if (devCurr != null && devCurr[0] != null) {
					//화면 상단 학과 정보 세팅
					$('#subjectHeadInfo').text(devCurr[0].year + '년도 ' + devCurr[0].departName + ' ' + devCurr[0].majorName);
					//화면 상단 학과 정보 세팅 끝
				}

				var serverDate = data.serverDate;               //server 날짜
				var currSdate = data.currDevSchedule.startDate; //교육과정개발 시작일
				var currEdate = data.currDevSchedule.endDate;   //교육과정개발 종료일
				
				// 160729 dy.kang 화면상의 버튼 제어가 들어가면 안되는 부분에 대해서(해당 페이지에서 바로 버튼 제어가 들어가는 경우) subStepCode가 -1일 경우 상태값 비교 안하도록 수정
				if (subStepCode == '-1' && stepCode != '7') {
					return;
				}
				// 20180202 추가 : fixStepChecker에서 버튼제어 안하고 해당 소스에서 해야될때 기간 상태값 리턴받아서 처리.  [[
				// 180206 dy.kang 프로파일에서 체크하는것이므로 != '7'이 아닌 == '7'이 되어야함
				else if (subStepCode == '-1' && stepCode == '7') {
					if(serverDate < currSdate || serverDate > currEdate) {
						//yellowAlert('교육과정개발 기간이 아닙니다');
						returnText = 'notPeriod';
					}
					return;
				}
				// 20180202 추가 : fixStepChecker에서 버튼제어 안하고 해당 소스에서 해야될때 기간 상태값 리턴받아서 처리.  ]]

				var resultList = data.resultList;
				var beforeStatus = 'S';
				var status = 'S';
				var nextStatus = 'S';
				if (resultList != null && resultList.length != 0) {
					for (var i = 0; i < resultList.length; i++) {
						if (stepCode == resultList[i].stepCode && (subStepCode == resultList[i].subStepCode || subStepCode == '0' || subStepCode == 'S')) {
							// stepCode가 1이고 subStepCode가 1이면 이전 스텝을 비교할 필요가 없음
							if (stepCode == '1' && subStepCode == '1') {
								beforeStatus = 'E';
							} else {
								beforeStatus = resultList[i - 1].status;
							}
							status = resultList[i].status;
							nextStatus = resultList[i + 1].status;
						}
					}
				} else {
					beforeStatus = 'X';
					status = 'X';
					nextStatus = 'X';
				}

				//20161004 Jhee 교육과정개발 작성기간 제어
				if(serverDate < currSdate || serverDate > currEdate) {
					yellowAlert('교육과정개발 기간이 아닙니다');
					
					$('.btn-saveBtn').hide();
					$('.btn-tempSaveBtn').hide();
					$('.btn-delBtn').hide();
					$('.btn-fixedBtn').hide();
					$('.btn-resetBtn').hide();
					$('.btn-unFixedBtn').hide();
					$('input[type=text]').prop('disabled', true);
					$('input[type=radio]').prop('disabled', true);
					$('input[type=checkbox]').prop('disabled', true);
					$('input[type=number]').prop('disabled', true);
					$('textarea').prop('disabled', true);
					$('select').prop('disabled', true);
					$('.btn-stepDisable').prop('disabled', true);
					$('.btn-stepHide').hide();
					$('button[name=ncsVerBtn]').prop('disabled', true);   /* 171010_직무모형설정_버전번경추가  */
					$('button[id^=modifyBtn').hide();   /* 교과목도출-과목정보 수정 기능 추가 */
					
				}  else {
					// 160803 dy.kang STEP 교과목 도출의 경우 상태값에 따라서 반응이 다르다
					if (stepCode == '6') {
						if (status == 'X') {
							redAlert('오류가 발생하였습니다. 다시 시도해 주세요');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('.btn-fixedBtn').hide();
							$('.btn-resetBtn').hide();
							$('.btn-unFixedBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[id^=modifyBtn').hide();   /* 교과목도출-과목정보 수정 기능 추가 */
						} else if (beforeStatus != 'E' && beforeStatus != 'F') {
							yellowAlert('저장불가능', '이전 단계가 완료되지 않았습니다. 저장이 불가능합니다.');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('.btn-fixedBtn').hide();
							$('.btn-resetBtn').hide();
							$('.btn-unFixedBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[id^=modifyBtn').hide();   /* 교과목도출-과목정보 수정 기능 추가 */
						} else if (status == 'E') {
							yellowAlert('수정/삭제 불가능', '수정하시려면 마감해제를 선택하여 주세요.');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('.btn-fixedBtn').hide();
							$('.btn-resetBtn').hide();
							$('.btn-unFixedBtn').show();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[id^=modifyBtn').hide();   /* 교과목도출-과목정보 수정 기능 추가 */
						} else if (status == 'I') {
							$('.btn-saveBtn').show();
							$('.btn-delBtn').show();
							$('.btn-fixedBtn').show();
							$('.btn-resetBtn').show();
							$('.btn-unFixedBtn').hide();
							$('.btn-stepDisable').prop('disabled', false);
							$('.btn-stepHide').show();							
						} else if(subStepCode == 'S') {
							//20180411 Jhee 교과목 도출이 미작성 상태이나 도출관련 데이터가 있는경우 바로 마감이 가능하도록 수정
							$('.btn-saveBtn').show();
							$('.btn-delBtn').show();
							$('.btn-fixedBtn').show();
							$('.btn-resetBtn').hide();
							$('.btn-unFixedBtn').hide();
							$('.btn-stepDisable').prop('disabled', false);
							$('.btn-stepHide').show();
						} else {
							$('.btn-saveBtn').show();
							$('.btn-delBtn').show();
							$('.btn-fixedBtn').hide();
							$('.btn-resetBtn').hide();
							$('.btn-unFixedBtn').hide();
							$('.btn-stepDisable').prop('disabled', false);
							$('.btn-stepHide').show();
						}
					// 160803 dy.kang STEP 교과목 도출의 경우 상태값에 따라서 반응이 다르다
					} else if (stepCode == '2' || stepCode == '3') {
						if (status == 'X') {
							redAlert('오류가 발생하였습니다. 다시 시도해 주세요');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
						} else if (beforeStatus != 'E' && beforeStatus != 'F') {
							yellowAlert('저장불가능', '이전 단계가 완료되지 않았습니다. 저장이 불가능합니다.');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
						} else if (nextStatus == 'I' || nextStatus == 'E' || nextStatus == 'F') {
							// 171214 dy.kang 마산대 요청(1211쯤) 삭제불가 팝업 제거
//							yellowAlert('삭제 불가능', '다음 단계가 저장되어 삭제가 불가능합니다.<br/>삭제 필요 시 다음 단계를 삭제하여 주세요.');
							$('.btn-saveBtn').show();
							$('.btn-tempSaveBtn').show();
							$('.btn-delBtn').hide();
						} else if (status == 'E' || status == 'F') {
							$('.btn-tempSaveBtn').hide();
							$('.btn-saveBtn').show();
							$('.btn-delBtn').show();
						} else if (status == 'S') {
							$('.btn-saveBtn').show();
							$('.btn-tempSaveBtn').show();
							$('.btn-delBtn').hide();
						} else {
							$('.btn-saveBtn').show();
							$('.btn-tempSaveBtn').show();
							$('.btn-delBtn').show();
						}
					} else {
						if (status == 'X') {
							redAlert('오류가 발생하였습니다. 다시 시도해 주세요');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[name=ncsVerBtn]').prop('disabled', true);   /* 171010_직무모형설정_버전번경추가  */
						} else if (beforeStatus != 'E' && beforeStatus != 'F') {
							yellowAlert('저장불가능', '이전 단계가 완료되지 않았습니다. 저장이 불가능합니다.');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[name=ncsVerBtn]').prop('disabled', true);   /* 171010_직무모형설정_버전번경추가  */
						} else if (nextStatus == 'I' || nextStatus == 'E' || nextStatus == 'F') {
							yellowAlert('수정/삭제 불가능', '다음 단계가 저장되어 수정/삭제가 불가능합니다.<br/>수정/삭제 필요 시 다음 단계를 삭제하여 주세요.');
							$('.btn-saveBtn').hide();
							$('.btn-tempSaveBtn').hide();
							$('.btn-delBtn').hide();
							$('input[type=text]').prop('disabled', true);
							$('input[type=radio]').prop('disabled', true);
							$('input[type=checkbox]').prop('disabled', true);
							$('input[type=number]').prop('disabled', true);
							$('textarea').prop('disabled', true);
							$('select').prop('disabled', true);
							$('.btn-stepDisable').prop('disabled', true);
							$('.btn-stepHide').hide();
							$('button[name=ncsVerBtn]').prop('disabled', true);   /* 171010_직무모형설정_버전번경추가  */
						} else if (status == 'E' || status == 'F') {
							$('.btn-tempSaveBtn').hide();
							$('.btn-saveBtn').show();
							$('.btn-delBtn').show();
						} else if (status == 'S') {
							$('.btn-saveBtn').show();
							$('.btn-tempSaveBtn').show();
							$('.btn-delBtn').hide();
						} else {
							$('.btn-saveBtn').show();
							$('.btn-tempSaveBtn').show();
							$('.btn-delBtn').show();
						}
					}
				}
			},
			error: function (request, status, error) {
				/* alert("code:" + request.status + "\n" + "message:"
				+ request.responseText + "\n" + "error:"
				+ error); */
				//alert("데이터를 가져오는데 실패 하였습니다.\n다시 시도해 주세요.")
				//history.back();
			}
		});

		// 180206 dy.kang 위에서 설정된 문구 return
		return returnText;
	}

	function stepSavedCheckStatus(currCode, stepCode, subStepCode, status) {

		// 160803 dy.kang STEP 프로파일 저장 개수 가져올 때 일반 교과목 제외시키는 변수 (포함하려면 TRUE값을 넘김)
		var subjectCSave = SUBJECT_C_SAVE;
		$.ajax({
			url : context + "currDev.commonStep/saveStepStatusAjax",
			data : {
				'currCode' : currCode,
				'stepCode' : stepCode,
				'subStepCode' : subStepCode,
				'status' : status,
				'subjectCSave' : subjectCSave
			},
			type : 'POST',
			dataType : 'json',
			success : function(data) {
			},
			error: function (request, status, error) {
				/* alert("code:" + request.status + "\n" + "message:"
				+ request.responseText + "\n" + "error:"
				+ error); */
				//alert("데이터를 가져오는데 실패 하였습니다.\n다시 시도해 주세요.")
				//history.back();
			}
		});
	}
	//'아니오' 선택시 타임라인으로 나가는 함수
	function goTimeLine() {
		location.href = context + 'currDev.timeLine/list';
	}
	
	function checkNumber($input){
		if($input.val() != '' && !strUtil.isNumber($input.val())){
			alert('숫자만 입력가능합니다.');
			$input.val("0");
			$input.select();
			sum($input.parent().parent());
			return false;
		}
		
		var val = parseInt($input.val());
		if(val > limit){
			$input.val("0");
			alert('척도를 초과할 수 없습니다.');
			$input.select();
			sum($input.parent().parent());
			return false;
		}	
	}
