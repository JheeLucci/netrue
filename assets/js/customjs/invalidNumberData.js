
/**
  * 160416
  * dy.kang
  * 숫자만 사용하는 경우 숫자 체크하는 공통 함수 추가
  * input 에서 onkeyup 함수에 해당 함수를 사용
  * input type이 number 일 경우 사용 불가능(text만 사용가능)
  */
  
function setInvalidNumberData(controller) {
	if (controller.value != controller.value.replace(/[^0-9.]/gi, "")) {
		controller.value = controller.value.replace(/[^0-9.]/gi, "");
	}
}