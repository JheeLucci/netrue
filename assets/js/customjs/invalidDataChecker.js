	function InvalidDataCheckerWithId(id) {
		var value = $('#' + id).val();
		return InvalidDataCheckerWithValue(value);
	}
	
	function InvalidDataCheckerWithName(name) {
		var bool = true;
		$('input[name=' + name + ']').each(function() {
			var value = $(this).val();
			bool = InvalidDataCheckerWithValue(value);
			console.log(bool);
			if (!bool) {
				return bool;
			}
		});
		return bool;
	}
	
	function InvalidDataCheckerWithValue(val) {
		if (val == null || val.length == 0) {
			return false;
		}
		if (val.trim().length == 0) {
			return false;
		}
		if (val.indexOf('ㄱ') != -1 || val.indexOf('ㄴ') != -1 || val.indexOf('ㄷ') != -1 || val.indexOf('ㄹ') != -1 || val.indexOf('ㅁ') != -1
				|| val.indexOf('ㅂ') != -1 || val.indexOf('ㅅ') != -1 || val.indexOf('ㅇ') != -1 || val.indexOf('ㅈ') != -1 || val.indexOf('ㅊ') != -1
				|| val.indexOf('ㅋ') != -1 || val.indexOf('ㅌ') != -1 || val.indexOf('ㅍ') != -1 || val.indexOf('ㅎ') != -1 || val.indexOf('ㄲ') != -1
				|| val.indexOf('ㄸ') != -1 || val.indexOf('ㅃ') != -1 || val.indexOf('ㅆ') != -1 || val.indexOf('ㅉ') != -1 || val.indexOf('ㄳ') != -1
				|| val.indexOf('ㄵ') != -1 || val.indexOf('ㄶ') != -1 || val.indexOf('ㄺ') != -1 || val.indexOf('ㄻ') != -1 || val.indexOf('ㄼ') != -1
				|| val.indexOf('ㄽ') != -1 || val.indexOf('ㄾ') != -1 || val.indexOf('ㄿ') != -1 || val.indexOf('ㅀ') != -1 || val.indexOf('ㅄ') != -1) {
			return false;
		}
		if (val.indexOf('ㅏ') != -1 || val.indexOf('ㅑ') != -1 || val.indexOf('ㅓ') != -1 || val.indexOf('ㅕ') != -1 || val.indexOf('ㅗ') != -1
				|| val.indexOf('ㅛ') != -1 || val.indexOf('ㅜ') != -1 || val.indexOf('ㅠ') != -1 || val.indexOf('ㅡ') != -1 || val.indexOf('ㅣ') != -1
				|| val.indexOf('ㅐ') != -1 || val.indexOf('ㅔ') != -1 || val.indexOf('ㅒ') != -1 || val.indexOf('ㅖ') != -1 || val.indexOf('ㅢ') != -1
				|| val.indexOf('ㅘ') != -1 || val.indexOf('ㅙ') != -1 || val.indexOf('ㅝ') != -1 || val.indexOf('ㅞ') != -1) {
			return false;
		}
		//console.log(val);
		return true;
	}