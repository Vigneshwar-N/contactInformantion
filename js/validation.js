// $Id: $
function zf_ValidateAndSubmit(){
		if(zf_CheckMandatory()){
			if(zf_ValidCheck()){
				if(isSalesIQIntegrationEnabled){
					zf_addDataToSalesIQ();
				}
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
		function zf_CheckMandatory(){
		var hasErrors = false;
		var firstErrorField = null;
		for(i = 0 ; i < zf_MandArray.length ; i ++) {
		  	var fieldObj=document.forms.form[zf_MandArray[i]];
		  	if(fieldObj) {
				  	if(fieldObj.nodeName != null ){
				  		if ( fieldObj.nodeName=='OBJECT' ) {
								if(!zf_MandatoryCheckSignature(fieldObj)){
									zf_ShowErrorMsg(zf_MandArray[i]);
									hasErrors = true;
									if(!firstErrorField) firstErrorField = fieldObj;
								}
							}else if (((fieldObj.value).replace(/^\s+|\s+$/g, '')).length==0) {
							 if(fieldObj.type =='file')
								{
								 zf_ShowErrorMsg(zf_MandArray[i]);
								 hasErrors = true;
								 if(!firstErrorField) firstErrorField = fieldObj;
								}
				   	   	  	  else {
				   	   	  	  	zf_ShowErrorMsg(zf_MandArray[i]);
				   	   	  	  	hasErrors = true;
				   	   	  	  	if(!firstErrorField) firstErrorField = fieldObj;
				   	   	  	  }
							}  else if( fieldObj.nodeName=='SELECT' ) {// No I18N
				  	   	   	 if(fieldObj.options[fieldObj.selectedIndex].value=='-Select-') {
								zf_ShowErrorMsg(zf_MandArray[i]);
								hasErrors = true;
								if(!firstErrorField) firstErrorField = fieldObj;
							   }
							} else if( fieldObj.type =='checkbox' || fieldObj.type =='radio' ){
								if(fieldObj.checked == false){
									zf_ShowErrorMsg(zf_MandArray[i]);
									hasErrors = true;
									if(!firstErrorField) firstErrorField = fieldObj;
			   					}
							}
				  	}else{
				  		var checkedValsCount = 0;
						var inpChoiceElems = fieldObj;
							for(var ii = 0; ii < inpChoiceElems.length ; ii ++ ){
						      	if(inpChoiceElems[ii].checked === true ){
						      		checkedValsCount ++;
						      	}
							}
							if ( checkedValsCount == 0) {
									zf_ShowErrorMsg(zf_MandArray[i]);
									hasErrors = true;
									if(!firstErrorField) firstErrorField = inpChoiceElems[0];
							 	}
					}
			}
		}
		if(hasErrors && firstErrorField) {
			firstErrorField.focus();
		}
		return !hasErrors;
	}
	function zf_ValidCheck(){
		var isValid = true;
		for(ind = 0 ; ind < zf_FieldArray.length ; ind++ ) {
			var fieldObj=document.forms.form[zf_FieldArray[ind]];
		  	if(fieldObj) {
		  		if(fieldObj.nodeName != null ){
			  		var checkType = fieldObj.getAttribute("checktype");
			  		if( checkType == "c2" ){// No I18N
			  			if( !zf_ValidateNumber(fieldObj)){
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
						}
			  		}else if( checkType == "c3" ){// No I18N
			  			if (!zf_ValidateCurrency(fieldObj) || !zf_ValidateDecimalLength(fieldObj,10) ) {
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
						}
			  		}else if( checkType == "c4" ){// No I18N
			  			if( !zf_ValidateDateFormat(fieldObj)){
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
						}
			  		}else if( checkType == "c5" ){// No I18N
			  			if (!zf_ValidateEmailID(fieldObj)) {
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
						}
			  		}else if( checkType == "c6" ){// No I18N
			  			if (!zf_ValidateLiveUrl(fieldObj)) {
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
							}
			  		}else if( checkType == "c7" ){// No I18N
			  			if (!zf_ValidatePhone(fieldObj)) {
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
							}
			  		}else if( checkType == "c8" ){// No I18N
			  			zf_ValidateSignature(fieldObj);
			  		}else if( checkType == "c9" ){// No I18N
						if( !zf_ValidateMonthYearFormat(fieldObj)){
							isValid = false;
							fieldObj.focus();
							zf_ShowErrorMsg(zf_FieldArray[ind]);
							return false;
						}
			  		}
			  	}
		  	}
		}
         	return isValid;
	}
	function zf_ShowErrorMsg(uniqName){
		var linkName = uniqName.split('_')[0];
		var errorElement = document.getElementById(linkName+"_error");
		if(errorElement) {
			errorElement.style.display = 'block';
		}
	}
	function zf_ValidateNumber(elem) {
	 	var validChars = "-0123456789";
	 	var numValue = elem.value.replace(/^\s+|\s+$/g, '');
	 	if (numValue != null && !numValue == "") {
	 		var strChar;
	 		var result = true;
	 		if (numValue.charAt(0) == "-" && numValue.length == 1) {
	 			return false;
	 		}
	 		for (i = 0; i < numValue.length && result == true; i++) {
	 			strChar = numValue.charAt(i);
	 			if ((strChar == "-") && (i != 0)) {
	 				return false;
	 			}
	 			if (validChars.indexOf(strChar) == -1) {
	 				result = false;
	 			}
	 		}
	 		return result;
	 	} else {
	 		return true;
	 	}
	 }
	 function zf_ValidateDateFormat(inpElem){
	 	var dateValue = inpElem.value.replace(/^\s+|\s+$/g, '');
	 	if( dateValue == "" ){
	 		return true;
	 	}else{
			return( zf_DateRegex.test(dateValue) );
		}
	 }
	 function zf_ValidateCurrency(elem) {
	 	var validChars = "0123456789.";
	 	var numValue = elem.value.replace(/^\s+|\s+$/g, '');
	 	if(numValue.charAt(0) == '-'){
	 		numValue = numValue.substring(1,numValue.length);
	 	}
	 	if (numValue != null && !numValue == "") {
	 		var strChar;
	 		var result = true;
	 		for (i = 0; i < numValue.length && result == true; i++) {
	 			strChar = numValue.charAt(i);
	 			if (validChars.indexOf(strChar) == -1) {
	 				result = false;
	 			}
	 		}
	 		return result;
	 	} else {
	 		return true;
	 	}
	 }
	 function zf_ValidateDecimalLength(elem,decimalLen) {
	 	var numValue = elem.value;
	 	if (numValue.indexOf('.') >= 0) {
	 		var decimalLength = numValue.substring(numValue.indexOf('.') + 1).length;
	 		if (decimalLength > decimalLen) {
	 			return false;
	 		} else {
	 			return true;
	 		}
	 	}
	 	return true;
	 }
	 function zf_ValidateEmailID(elem) {
        var check = 0;
        var emailValue = elem.value;
        if (emailValue != null && !emailValue == "") {
            var emailArray = emailValue.split(",");
            for (i = 0; i < emailArray.length; i++) {
                var emailExp = /^[\w]([\w\-.+&'/]*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
                if (!emailExp.test(emailArray[i].replace(/^\s+|\s+$/g, ''))) {
                    check = 1;
                }
            }
            if (check == 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
    function zf_ValidateLiveUrl(elem) {
    	var urlValue = elem.value;
		if(urlValue !== null && typeof(urlValue) !== "undefined") {
			urlValue = urlValue.replace(/^\s+|\s+$/g, '');
			if(urlValue !== "") {
      			var urlregex = new RegExp("^(((https|http|ftps|ftp)://[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*(\\.[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*)+(:\\d{1,5})?)|((w|W){3}(\\.[a-zA-Z\\d]+((_|-|@)[a-zA-Z\\d]+)*){2,}(:\\d{1,5})?)|([a-zA-Z\\d]+((_|-)[a-zA-Z\\d]+)*(\\.[a-zA-Z\\d]+((_|-)[a-zA-Z\\d]+)*)+(:\\d{1,5})?))(/[-\\w.?,:'/\\\\+=&;%$#@()!~]*)?$", "i"); // This regex is taken from LiveFieldsUtil.isValidWebSiteFieldURL() method. Changes: i) Add ^ at the beginning and $ at the end. ii) Remove ?i before https and adjust () around https. iii) Add "i" in the RegExp constructor. // No I18N
				return(urlregex.test(urlValue));
			}
        }
        return true;
    }
    function zf_ValidatePhone(inpElem){

        var ZFPhoneRegex = {
            PHONE_INTE_ALL_REG: /^[+]{0,1}[()0-9-. ]+$/,
            PHONE_INTE_NUMERIC_REG: /^[0-9]+$/,
            PHONE_INTE_CONT_CODE_ENABLED_REG: /^[(0-9-.][()0-9-. ]*$/,
            PHONE_USA_REG: /^[0-9]+$/,
            PHONE_CONT_CODE_REG: /^[+][0-9]{1,4}$/
        }
    	var phoneFormat = parseInt(inpElem.getAttribute("phoneFormat"));
    	var fieldInpVal = inpElem.value.replace(/^\s+|\s+$/g, '');
    	var toReturn = true ;
    	if( phoneFormat === 1 ){
    		if(inpElem.getAttribute("valType") == 'code'){
                var codeRexp = ZFPhoneRegex.PHONE_CONT_CODE_REG;
                if(fieldInpVal != "" && !codeRexp.test(fieldInpVal)){
		           return false;
				}
    		}else{
				var IRexp = ZFPhoneRegex.PHONE_INTE_ALL_REG;
				if(inpElem.getAttribute("phoneFormatType") == '2'){
					IRexp = ZFPhoneRegex.PHONE_INTE_NUMERIC_REG;
				}
	 			if (fieldInpVal != "" && !IRexp.test(fieldInpVal)) {
	 				toReturn = false;
	 				return toReturn;
	 			}
 		    }
 			return toReturn;
    	}else if( phoneFormat === 2 ){
    		var InpMaxlength = inpElem.getAttribute("maxlength");
    		var USARexp = ZFPhoneRegex.PHONE_USA_REG;
    		if  ( fieldInpVal != "" && USARexp.test(fieldInpVal) &&  fieldInpVal.length == InpMaxlength ) {
				toReturn = true;
			}else if( fieldInpVal == "" ){
				toReturn = true;
			}else{
				toReturn = false;
			}
			return toReturn;
    	}
    }

  function zf_ValidateSignature(objElem) {
  		var linkName = objElem.getAttribute("compname");
  		var canvasElem = document.getElementById("drawingCanvas-"+linkName);
  		var isValidSign = zf_IsSignaturePresent(objElem,linkName,canvasElem);
   		var hiddenSignInputElem = document.getElementById("hiddenSignInput-"+linkName);
		if(isValidSign){
			hiddenSignInputElem.value = canvasElem.toDataURL();
		}else{
			hiddenSignInputElem.value = "";// No I18N
		}
		return isValidSign;
  	}

  	function zf_MandatoryCheckSignature(objElem){
  		var linkName = objElem.getAttribute("compname");
  		var canvasElem = document.getElementById("drawingCanvas-"+linkName);
  		var isValid = zf_IsSignaturePresent(objElem,linkName,canvasElem);
		return isValid;
  	}

  	function zf_IsSignaturePresent(objElem,linkName,canvasElem){
   		var context = canvasElem.getContext('2d'); // No I18N
   		var canvasWidth = canvasElem.width;
   		var canvasHeight = canvasElem.height;
   		var canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
   		var signLen = canvasData.data.length;
   		var flag = false;
   		for(var index =0; index< signLen; index++) {
   	     	if(!canvasData.data[index]) {
   	       		flag =  false;
   	     	}else if(canvasData.data[index]) {
   		   		flag = true;
   		   		break;
   	     	}
   		}
		return flag;
  	}

	function zf_FocusNext(elem,event) {
	 	if(event.keyCode == 9 || event.keyCode == 16){
	      return;
	    }
	    if(event.keyCode >=37 && event.keyCode <=40){
	       return;
	    }
	    var compname = elem.getAttribute("compname");
	    var inpElemName = elem.getAttribute("name");
	 	if (inpElemName == compname+"_countrycode") {
	 		if (elem.value.length == 3) {
	 			document.getElementsByName(compname+"_first")[0].focus();
	 		}
	 	} else if (inpElemName == compname+"_first" ) {
	 		if (elem.value.length == 3) {
	 			document.getElementsByName(compname+"_second")[0].focus();
	 		}
	 	}
	}
	function zf_ValidateMonthYearFormat(inpElem){
		var monthYearValue = inpElem.value.replace(/^\s+|\s+$/g, '');
		if( monthYearValue == "" ){
			return true;
		}else{
		   return (zf_MonthYearRegex.test(monthYearValue));
	   }
	}
	
	function zf_SetDateAndMonthRegexBasedOnDateFormate(dateFormat){
		
		var dateAndMonthRegexFormateArray = new Array();
		var dateFormatRegExp;
        var monthYearFormatRegExp;
		if(dateFormat === "dd-MMM-yyyy"){
			
    	     dateFormatRegExp = "^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$";
    	     monthYearFormatRegExp = "^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[-](?:(?:19|20)[0-9]{2})$";// No I18N
    	  
    	  }else if(dateFormat === "dd-MMMM-yyyy"){// No I18N
    	     dateFormatRegExp = "^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-](January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";
    	     monthYearFormatRegExp = "^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";// No I18N
    	  
    	  }else if(dateFormat === "MMMM-dd-yyyy"){// No I18N
    	  	dateFormatRegExp = "^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](([0][1-9])|([1-2][0-9])|([3][0-1]))[-](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp ="^(January|February|March|April|May|June|July|August|September|October|November|December|JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)[-](?:(?:19|20)[0-9]{2})$";// No I18N
    	  
    	  }else if(dateFormat === "dd/MM/yyyy"){// No I18N
    	  	dateFormatRegExp ="^(([0][1-9])|([1-2][0-9])|([3][0-1]))[\/]([0][1-9]|1[012])[\/](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp ="^([0][1-9]|1[012])[\/](?:(?:19|20)[0-9]{2})$";
    	  
    	  }else if(dateFormat === "dd-MM-yyyy"){// No I18N
    	  	dateFormatRegExp = "^(([0][1-9])|([1-2][0-9])|([3][0-1]))[-]([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp = "^([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
    	  
    	  }else if(dateFormat === "MM/dd/yyyy"){// No I18N
    	  	dateFormatRegExp = "^([0][1-9]|1[012])[\/](([0][1-9])|([1-2][0-9])|([3][0-1]))[\/](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp = "^([0][1-9]|1[012])[\/](?:(?:19|20)[0-9]{2})$";
    	  
    	  }else if(dateFormat === "yyyy-MM-dd"){// No I18N
    	  	dateFormatRegExp = "^(?:(?:19|20)[0-9]{2})[-]([0][1-9]|1[012])[-](([0][1-9])|([1-2][0-9])|([3][0-1]))$";
    	    monthYearFormatRegExp = "^(?:(?:19|20)[0-9]{2})[-]([0][1-9]|1[012])$";
    	  
    	  }else if(dateFormat === "yyyy/MM/dd"){// No I18N
    	  	dateFormatRegExp = "^(?:(?:19|20)[0-9]{2})[\/]([0][1-9]|1[012])[\/](([0][1-9])|([1-2][0-9])|([3][0-1]))$";
    	    monthYearFormatRegExp = "^(?:(?:19|20)[0-9]{2})[\/]([0][1-9]|1[012])$";
    	  
    	  }else if(dateFormat === "dd.MM.yyyy"){// No I18N
    	  	dateFormatRegExp = "^(([0][1-9])|([1-2][0-9])|([3][0-1]))[.]([0][1-9]|1[012])[.](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp = "^([0][1-9]|1[012])[.](?:(?:19|20)[0-9]{2})$";
    	  
    	  }else if(dateFormat === "MM-dd-yyyy"){// No I18N
    	  	dateFormatRegExp = "^([0][1-9]|1[012])[-](([0][1-9])|([1-2][0-9])|([3][0-1]))[-](?:(?:19|20)[0-9]{2})$";
    	    monthYearFormatRegExp = "^([0][1-9]|1[012])[-](?:(?:19|20)[0-9]{2})$";
    	  }
    	  dateAndMonthRegexFormateArray.push(dateFormatRegExp);
    	  dateAndMonthRegexFormateArray.push(monthYearFormatRegExp);

// Function to hide error message for a field
function zf_HideErrorMsg(fieldName) {
	// Try direct field name first (e.g., Dropdown1_error, Email_error)
	var errorElement = document.getElementById(fieldName + "_error");
	if(errorElement) {
		errorElement.style.display = 'none';
		return;
	}
	
	// Fallback: use split approach for fields with underscores
	var linkName = fieldName.split('_')[0];
	errorElement = document.getElementById(linkName + "_error");
	if(errorElement) {
		errorElement.style.display = 'none';
	}
}

// Function to check if a field has a value
function zf_IsFieldFilled(fieldObj) {
	if(!fieldObj) return true;
	
	if(fieldObj.nodeName === 'OBJECT') {
		return true;
	} else if(fieldObj.nodeName === 'SELECT') {
		var selectedValue = fieldObj.options[fieldObj.selectedIndex].value;
		return selectedValue !== '-Select-' && selectedValue.trim() !== '';
	} else if(fieldObj.type === 'checkbox' || fieldObj.type === 'radio') {
		if(fieldObj.length !== undefined) {
			// Multiple checkboxes/radios
			for(var i = 0; i < fieldObj.length; i++) {
				if(fieldObj[i].checked) return true;
			}
			return false;
		} else {
			return fieldObj.checked;
		}
	} else if(fieldObj.type === 'file') {
		return fieldObj.value.length > 0;
	} else {
		return ((fieldObj.value).replace(/^\s+|\s+$/g, '')).length > 0;
	}
}

// Attach event listeners to hide errors when fields are filled
document.addEventListener("DOMContentLoaded", function() {
	// Attach listeners to each mandatory field
	for(var i = 0; i < zf_MandArray.length; i++) {
		var fieldName = zf_MandArray[i];
		attachFieldListener(fieldName);
	}
	
	// Additional listeners for select fields (Dropdown1, Dropdown2, Dropdown3)
	var selectFieldsToListen = ['Dropdown1', 'Dropdown2', 'Dropdown3'];
	for(var s = 0; s < selectFieldsToListen.length; s++) {
		var selectFieldName = selectFieldsToListen[s];
		var selectField = document.forms.form[selectFieldName];
		if(selectField) {
			selectField.addEventListener("change", function(e) {
				var fieldName = e.target.name;
				if(e.target.options[e.target.selectedIndex].value !== '-Select-') {
					zf_HideErrorMsg(fieldName + '_error');
				}
			});
		}
	}
	
	function attachFieldListener(fieldName) {
		var fieldObj = document.forms.form[fieldName];
		if(!fieldObj) return;
		
		if(fieldObj.length !== undefined) {
			// Multiple checkboxes/radios (NodeList)
			for(var j = 0; j < fieldObj.length; j++) {
				fieldObj[j].addEventListener("change", function() {
					checkAndHideError(fieldName);
				});
			}
		} else {
			// Single field
			if(fieldObj.type === 'checkbox' || fieldObj.type === 'radio') {
				fieldObj.addEventListener("change", function() {
					checkAndHideError(fieldName);
				});
			} else if(fieldObj.nodeName === 'SELECT') {
				fieldObj.addEventListener("change", function() {
					checkAndHideError(fieldName);
				});
			} else {
				fieldObj.addEventListener("input", function() {
					checkAndHideError(fieldName);
				});
			}
		}
	}
	
	function checkAndHideError(fieldName) {
		var fieldObj = document.forms.form[fieldName];
		if(zf_IsFieldFilled(fieldObj)) {
			zf_HideErrorMsg(fieldName);
		}
	}
});
    	  
    	  return dateAndMonthRegexFormateArray;
    	  
    	
    }
