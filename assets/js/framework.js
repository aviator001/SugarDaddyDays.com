	var err_img = '"https://sugardaddydays.com/assets/avatars/a3.png"'
	var no_photo = 'https://sugardaddydays.com/assets/js/a000.png'
	var lat = getCookie('lat')
	var lng = getCookie('lng')
	var login
	var data_type
	var pass
	var password_confirmation
	var con_id = 1, k, n=1, p_n=0, ec
	var validate = true
	var ns
	var x6,cnt=0
	var m_to, me, you, t, s, objH
	var mobile
	var timx
	var op = 0
	var y_axis = 1
	var toast = []
	var dismissed = 0
	var msid
	var page, path
	var imgs = 'https://sugardaddydays.com/assets/images/box.png'
	var none='none'
	var ht, ct
	var old_msg = ''
	var block = 'block'
	var none = 'none'
	var g_msgs
	var tt
	var iMsgCont
	var dismissed = ''
	var ofp, opm, owb = 0
	var fp, pm, wb, lb
	var inc_a = 0.01
	var inc_b = 0.05
	var timer_a
	var usr_input = ''
	var v = ''
	var objPhrase
	var pass 
	var aes_user_token
	var str
	var image_job = ''
	var swt = true
	var img_arr
	var im = new Array
	var ObjUser = new Array
	var d = ''
	var cntAtt = 1
	var new_wh
	var curr_att = ''
	var ObjCtr = 0
	var ObjChild
	var tmr
	var blue='#0093D9'
	var black='#000'
	var red='red'
	var orange='orange'
	var gold='gold'
	var white='#FFF'
	var f0f0f0='#f0f0f0'
	var none='none'
	var folder='fa fa-chevron-circle-right'
	var folder_open='fa fa-chevron-circle-down'
	var photo_on=1
	var err_pic='assets/avatars/a7.jpg'
	var soon='Coming Soon'
	var sid, xxid
	var err_src='assets/avatars/a3.png'
	var pointer = 0
	var ptr = 0
	var a
	//START: jalert and wait
	var html = document.documentElement;
	var objText, objType, objStyle, objWait, spinner
	var alpha = document.getElementById('alpha')
	var toast = document.createElement('span');
	var jToastWn = document.createElement('div');
	var jModalWn = document.createElement('div');
	var jBoxCont = document.createElement('div');
	var spinner = document.createElement('div');
	var objWait = document.createElement('img');
	var objW = document.createElement('img');
	var objT = document.createElement('span');
	var x_gender='Sugar Baby'
	var x_age=50
	var x_miles=50
	var x_photos='No'
	var zip = ''
	var miles = ''
	var age = ''
	var gender = ''
	var photos=''
	var pclip = 'assets/images/pclip.png'
	var pclip_o = 'assets/images/pclip_o.png'
	var err_img = 'assets/images/a000.png';
	var dot2 = 'https://sugardaddydays.com/assets/images/dot4.png'
	var dot1='https://sugardaddydays.com/assets/images/dot1.png'
	var user_offline = 'User is Offline!'
	var x_validate=true

	jModalWn.id='jModalWn'
	objW.id='objW'
	objT.id='objT'
	spinner.style.cssText = "display:none;position:fixed;width:100%;height:100%;top:0px;bottom:0px;left:0px;right:0px;margin:auto;z-index:99999999999;background:;opacity:1"
	jModalWn.style.cssText = "display:none;position:fixed;width:100%;height:100%;top:0px;bottom:0px;left:0px;right:0px;margin:auto;z-index:999999999999999999999;background:;opacity:1"
	jToastWn.style.cssText = "text-align:center;padding:10px;display:none;position:fixed;z-index:99999999999999999999999;right:10px;top:10px;font-size:18px;color:white"
	toast.style.cssText = "text-align:center;padding:10px;display:none;position:fixed;z-index:999999999999999999990;right:10px; top: 10px; font-size:18px; color: white"
	objWait.style.cssText = "margin:auto;position:fixed;z-index:9999999999999999999991;left:0;right:0;top:0;bottom:0;width:100px;padding:20px;background:#fff;border-radius:8px;opacity:0.8;box-shadow:0px 0px 5px #333"
	objW.style.cssText = "margin:auto;position:fixed;z-index:9999999999999999999991;left:0;right:0;top:0;bottom:0;width:125px;padding:20px;padding-top:10px;background:#fff;border-radius:8px;opacity:0.9;box-shadow:0px 0px 5px #333"
	objT.style.cssText = "margin:auto;position:fixed;z-index:9999999999999999999992;left:0;right:0;top:0;bottom:0;width:125px;height:125px;padding:5px;padding-top:80px;font-size:14px;font-family:Ubuntu Condensed;text-align:center;word-wrap:break-word;background:none;text-shadow:1px 1px 0px #fff;border-radius:8px;opacity:1.0;"
	objWait.src='https://sugardaddydays.com/assets/img/wait.gif'
	objW.src='https://sugardaddydays.com/assets/img/wait.gif'
	
	toast.id='toast'
	spinner.id='spinner'
	html.appendChild(jModalWn)
	html.appendChild(jBoxCont)
	html.appendChild(jToastWn)
	html.appendChild(toast)
	html.appendChild(spinner)
	spinner.appendChild(objWait)

function show_lightbox(filename_1) {
	document.getElementById('modal').style.zIndex='1000'
	document.getElementById('modal').style.display='block'
	document.getElementById('modal_bg').style.opacity='0.9'
	document.getElementById('modal_window').innerHTML="<img title='Click to close me'  onclick='document.all.modal.style.display=none' src='attach/"+filename_1+"' class='www_box2' style='max-width:400px;max-height:600px;border:10px solid #fff'>"
}		
function show_photo(filename_1) {
	document.getElementById('modal').style.zIndex='1000'
	document.getElementById('modal').style.display='block'
	document.getElementById('modal_bg').style.opacity='0.9'
	document.getElementById('modal_window').innerHTML="<img title='Click to close me'  onclick='document.all.modal.style.display=none' src='photos/"+filename_1+"' class='www_box2' style='max-width:400px;max-height:600px;border:10px solid #fff'>"
}		
function show_text(filename_1) {
	document.getElementById('modal').style.zIndex='1000'
	document.getElementById('modal').style.display='block'
	document.getElementById('modal_bg').style.opacity='0.9'
	document.getElementById('modal_window').innerHTML="<div contentEditable=true id='secure_password'>"
}		
function show(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += show(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	alert( dumped_text );
}

(function () {
			 function loadScript(url, callback) {
				 var script = document.createElement("script")
				script.type = "text/javascript";
				 if (script.readyState) { //IE
					script.onreadystatechange = function () {
						if (script.readyState == "loaded" || script.readyState == "complete") {
							script.onreadystatechange = null;
							callback();
						}
					};
				} else { //Others
					script.onload = function () {
						callback();
					};
				}
				 script.src = url;
				document.getElementsByTagName("head")[0].appendChild(script);
			}
			 loadScript("https://sugardaddydays.com/assets/js/jquery.js", function () {
			 loadScript("https://sugardaddydays.com/assets/jquery-confirm.min.js", function () {
			});
		 });
	})();
	
	function go_search() {
		if (document.getElementById("name_search").value) {
			var ns=document.getElementById("name_search").value
			setCookie('search_name',ns)
		} else {
			ns=''
				
			if(!document.getElementById("miles").value){
				document.getElementById("miles").value=getCookie('search_miles')
				miles=document.getElementById("miles").value
			} else {
				miles=document.getElementById("miles").value
				setCookie('search_miles',miles)
			}
			miles=getCookie('search_miles')
			if (document.getElementById("zip").value) {
				zip=document.getElementById("zip").value
				setCookie('search_zip',zip)
			} else {
				if (!getCookie('search_zip')) {
					setCookie('search_zip', getCookie('zip'))
				}
				zip = getCookie('search_zip')
				document.getElementById("zip").value=getCookie('search_zip')
			}

			if (document.getElementById("location").value == '') {
				if (getCookie('search_city_state')=='') {
					setCookie('search_city_state', getCookie('city') + ' ' + getCookie('state'))
				} 
				document.getElementById("location").value=getCookie('search_city_state')
			} else {
				setCookie('search_city_state', document.getElementById("location").value)
			}
			xcs=getCookie('search_city_state')
			if (getCookie('search_age')) age=getCookie('search_age')

			if (getCookie('search_gender')) gender=getCookie('search_gender')
			if (getCookie('search_photos')) photos=getCookie('search_photos')

			var xp = xcs.split(' ').length-1
			var xstate=xcs.split(' ')[xp].trim()
			if (xcs.split(' ').length>1) {
				if (xcs.split(' ').length==3) {
					var xcity=xcs.split(' ')[0].trim()+ ' ' +xcs.split(' ')[1].trim()
					var xstate=xcs.split(' ')[2].trim()
				} else if (xcs.split(' ').length==2) {
					var xcity=xcs.split(' ')[0].trim()
					var xstate=xcs.split(' ')[1].trim()
				}
			} else if (xcs.split(',').length>1) {
				var xcity=xcs.split(',')[0].trim()
				var xstate=xcs.split(',')[1].trim()
			}
			if (xcity !='') {
				var qs_cs='city='+xcity+'&state='+xstate
			}
		
			if (zip) {
				var qs_zip='&zip='+zip
			}
			if (miles) {
				var qs_miles='&miles='+miles
			}
			
			if (age) {
				var qs_age='&age='+age
			}
			
			if (gender) {
				var qs_gender='&gender='+gender
			}
			
			if (photos) {
				var qs_photos='&pics='+photos
			}
		}
		var rows=Math.round((window_height()/50),0)
		var url='browse.php?' + qs_cs + qs_zip + qs_miles + qs_gender + qs_age + qs_photos + '&x_rows=100&x_cols=1&rows=100&view=list&type=search&member_name='+ns
		location.href=url
	}

function show_map() {
	var g = document.getElementById('g_map')
	if (g.style.display=='none') g.style.display='block'
		else g.style.display='none'
}	
	
function find_ticket_x() {
	if (document.getElementById('tdv').style.display=='none') {
		document.getElementById('tdv').style.display='block'
		document.getElementById('ticket').style.display='block'
		document.getElementById('tt').style.display='block'
	} else {
		document.getElementById('tdv').style.display='none'
		document.getElementById('ticket').style.display='none'
		document.getElementById('tt').style.display='none'
	}
}
	
	function jwait(objTxt) {
		objT.innerHTML=objTxt
		jModalWn.appendChild(objWait)
		jModalWn.appendChild(objT)
		jModalWn.style.display='block'
	}

	function jhide() {
		document.getElementById('jModalWn').style.display=='none'
		jModalWn.style.display='none'
		objW.style.display='none'
		objT.style.display='none'
	}

	WebFontConfig = {
		google: { families: [ 'Open+Sans+Condensed:300:latin' ] }
	  };
	  (function() {
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	  })(); 

		function close_modal() {
			jModalWn.style.display='none'
			jBoxCont.style.display='none'
		}
		
		function close_modal_f() {
			jModalWn.style.display='none'
			jBoxCont.style.display='none'
			return false
		}
	//END: jalert and wait

	function jcs(str) {
		var t =	$.confirm({
			title: false,
			content: str,
			theme: 'dark',
			confirm: function(){
				return true
			},
			cancel: function(){
				return false
			},
			confirmButtonClass: 'btn-info',
			cancelButtonClass: 'btn-danger'
		});
		return t
	}	

	if (getCookie('mobile')) mobile = getCookie('mobile')
	var path = window.location.href.substring(window.location.href.lastIndexOf('/')+1)
	var page = path.substring(0,path.length-4)
	
	function init() {
		if (page=='profile') {
			getProfileData()
		}
	}

	function format_sms(objSMS) {
		return ' (' + objSMS.substr(1,3) + ') ' + objSMS.substr(4,3) + '-' + objSMS.substr(7,4)
	}

	function show_error(f,i) {
		if (document.getElementById(f.id + '_updated')) {
			document.getElementById(f.id + '_updated').style.display='block'
			if (document.getElementById(f.id + '_updated_img')) document.getElementById(f.id + '_updated_img').src='assets/images/e3.png'
		}
		if (document.getElementById(f.id+'_original')) {
			if (document.getElementById(f.id+'_original').value == f.value) return false
		}
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}
	
	function show_error_reg(f,i) { 
		if (document.getElementById(f.id + '_updated')) {
			document.getElementById(f.id + '_updated').style.display='block'
			document.getElementById(f.id + '_updated_img').src='assets/images/e3.png'
		}
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}
	function show_login_error(f,i) {
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}

	function clear_error(f) {
		if (document.getElementById(f.id + '_updated')) {
			if (document.getElementById(f.id + '_updated_img')) document.getElementById(f.id + '_updated_img').src='assets/images/e5.png'
			document.getElementById(f.id + '_updated').style.display='none'
		}
		x_validate=true
		validate = true
		var r = f.id + '_err'
		var t = r + '_txt'
		var p = f.value
		f.style.background = '#fff'
		f.style.color='grey'
		t = document.getElementById(t)
		t.innerHTML = ''
		if (document.getElementById('form_errors')) document.getElementById('form_errors').style.display='none'
	}

	function is_valid_mobile(f) {
		if (f.value.length >10) {
			show_error(f,'Invalid Mobile! Format: 10 Digits only. (123) 456-7890 or XXXYYYZZZZ or 123.456.7890')
			return false
		}
		var number = f.value
		var m = /^(\W|^)[(]{0,1}\d{3}[)]{0,1}[.]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}[\s.]{0,1}\d{4}(\W|$)/
		if(!m.test(number)) {
				validate = false
				show_error(f,'Invalid Mobile! Format: 10 Digits only.<br>NO Country Code(1);<br>(123) 456-7890 or XXXYYYZZZZ or 123.456.7890')
				return false
			}
	}

	function is_valid_age(f) {
		var number = f.value*1
		if (isNumber(number) && (number>=18) && (number<=80)) {
			return true 
		} else {
				validate = false
				show_error(f,'Invalid Age!')
				return false
		}
	}

	function is_valid_currency(f) {
		var obj = f.value
		var c=!jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		if((!c) || (c==false)) {
				validate = false
				show_error(f,'Invalid $ Amount!')
				return false
			} else {
				return true
			}
	}

	function is_valid_pswd(f) {
		var pswd = f.value
		if(pswd.trim().length) {
				return true
			} else 	{
				validate = false
				show_error(f,'Invalid Password!')
				return false
			}
	}
	var old_money=''
	var old_date_money=''
	
	function is_valid_email(f) {
	var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(email.test(f.value)) 
		{
			return true
		} else {
			validate = false
			show_error(f,'Invalid Email! Please re-enter')
			return false
		}
	}

	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function validate_money(f)	{
		if (f.value) {
			if (isNumber(f.value) == true) {
				if (old_money != f.value) update_field('system_status', f.value)
				old_money=f.value
				return true
			} else {
				show_error(f)
				return false	
			}
		}
	}
	function validate_date_money(f)	{
		if (f.value) {
			if (isNumber(f.value) == true) {
				if (old_date_money != f.value)  update_field('system_status_end', f.value)
				old_money=f.value
				return true
			} else {
				show_error(f)
				return false	
			}
		}
	}

	var digit_code
	
	function send_code() {
		if (document.getElementById('mobile_original').value == document.getElementById('mobile').value) return false
		var x = ''
		var mobile = document.getElementById('mobile')
		validate_field(mobile)
		if (validate == true) {
		document.getElementById('pay_modal').style.display='block'
		document.getElementById('wait').style.display='block'
		document.getElementById('spl_text').innerHTML='GENERATING VALIDATION CODE, PLEASE WAIT'
			var url = 'send_code.php?cell=' + document.getElementById('mobile').value
			var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
					if (msg.trim() != '') {
						document.getElementById('wait').style.display='none'
						document.getElementById('co').style.display='block'
						document.getElementById('c1').focus()
						digit_code = msg.trim()	
					} else {
						jalert(msg)
						return false
					}
				}
			})
		} else {
			return false
		}
	}
		
	
	function screen_dimensions() {
		var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		return new Array(w, h)
	}
	
	var winH, winW

	function window_height() {
		if (document.body) {
		 winH = document.body.offsetHeight;
		}

		if (document.compatMode=='CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetHeight ) {
			winH = document.documentElement.offsetHeight;
			return winH
		}

		if (window.innerHeight && window.innerHeight) {
			 winH = window.innerHeight;
			 return winH;
		}
	}		
		
	function window_width() {
		if (document.body) {
		 winW = document.body.offsetWidth;
		}

		if (document.compatMode=='CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetWidth ) {
			winW = document.documentElement.offsetWidth;
			return winW
		}

		if (window.innerWidth && window.innerWidth) {
			 winW = window.innerWidth;
			 return winW;
		}
	}		
			
	function send_password() {
		pm.style.zIndex = '11111'
		var fw = document.getElementById('wait')
		var user_mobile = document.getElementById('mobile').value
		var url = 'php/x_sms_api.php?sms=' + user_mobile
		fw.style.display='block'
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				fw.style.display='none'
				wb.innerHTML = 'PASSWORD SENT. PLEASE CHECK YOUR PHONE'
				wb.style.width = '320px'
				fb.style.display='none'
				fp.style.display='block'
				lt.style.display='block'
				pm.style.display='none'
				lb.style.width = '30%'
				lb.style.height = '440px'
				fp.focus()
			}
		})
	}

	function jalert(objAlert) {
		$.dialog({
			title: 'Click to Dismiss',
			content: objAlert,
		});		
	}

	function jn(txtObj, a, b) {
			$.confirm({
			title: false,
			closeIcon: true,
			confirmButton: false,
			cancelButton: false,
			theme: 'light',
			columnClass: 'col-md-3',
			content:txtObj,
			confirm: function(){
				if (a) eval(a)
			},
			cancel: function(){
				if (b) eval(b)
			},
			confirmButtonClass: 'btn-info',
			cancelButtonClass: 'btn-danger'				
		});
	}	

	function jc(txtObj, a, b) {
		$.confirm({
			title: false,
			closeIcon: true,
			theme: 'light',
			columnClass: 'col-md-3',
			content:txtObj,
			confirm: function(){
				if (a) eval(a)
			},
			cancel: function(){
				if (b) eval(b)
			},
			confirmButtonClass: 'btn-info',
			cancelButtonClass: 'btn-danger'				
		});
	}	

	function jnm(txtObj, a, b) {
			$.confirm({
			title: false,
			closeIcon: true,
			confirmButton: false,
			cancelButton: false,
			theme: 'holodark',
			columnClass: 'col-md-3',
			content:txtObj,
			confirm: function(){
				if (a) eval(a)
			},
			cancel: function(){
				if (b) eval(b)
			},
			confirmButtonClass: 'btn-info',
			cancelButtonClass: 'btn-danger'				
		});
	}	

	function jcm(txtObj, a, b) {
			$.confirm({
			title: false,
			closeIcon: true,
			theme: 'holodark',
			columnClass: 'col-md-3',
			content:txtObj,
			confirm: function(){
				if (a) eval(a)
			},
			cancel: function(){
				if (b) eval(b)
			},
			confirmButtonClass: 'btn-info',
			cancelButtonClass: 'btn-danger'				
		});
	}	

	function send_password_new() {
		var user_mobile = getCookie('mobile')
		if (!user_mobile) {
			user_mobile=prompt('Please enter your mobile phone number')
			send_pass_api_new(user_mobile.trim())
		}
	}
	
	function send_pass_api_new(user_mobile) {
		jwait('Sending Password...')
		var url = 'send_code.php?type=password&cell=' + user_mobile
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				jhide()
				jalert('Password sent to mobile number')
			}
		})
	}

	function send_password_modal() {
		var fw = document.getElementById('wait')
		var user_mobile = document.getElementById('mobile').value
		var url = 'php/x_sms_api.php?sms=' + user_mobile
		fw.style.display='block'
		lb.style.display='none'
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				location.href='login.php?mob=' + getCookie('mobile')
			}
		})
	}

	function whats_this(data) {
		var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		var mm = /^(\W|^)[(]{0,1}\d{3}[)]{0,1}[.]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}[\s.]{0,1}\d{4}(\W|$)/
		if(email.test(data)) {
			data_type = 'email'
		} else {
			if(mm.test(data)) {
				data_type = 'mobile'
			} else {
				data_type = 'login'
			}
		}
		return data_type
	}

	function delCookie(cname) {
		var d = new Date();
		d.setTime(d.getTime());
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + "" + "; " + expires;
	 }

	function setCookie(cname,cvalue,exdays)	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	 }

	function getCookie(cname)	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	function getProfileData() {
		var url = "php/x_profile_data.php?mobile=" + mobile;
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				if (msg) {
					var profile_data = msg.split('|')
					document.getElementById('email').value = profile_data[1]
					document.getElementById('up_password').value = profile_data[2]
					document.getElementById('name').value = profile_data[0].trim()
					document.getElementById('up_mobile').value = getCookie('mobile')
				} else {
					jalert('Profile not found!')
				}
			}
		})
	}

	function show_hide() {
		if (document.getElementById('five').innerHTML == 'Hide Photo') {
				document.getElementById('two').style.display = 'none'
				document.getElementById('two').style.display = 'none'
				document.getElementById('three').style.display = 'none'
				document.getElementById('four').style.display = 'none'
				document.getElementById('five').innerHTML = 'Show Photo'
		} else {
				document.getElementById('one').style.display = ''
				document.getElementById('two').style.display = ''
				document.getElementById('three').style.display = ''
				document.getElementById('four').style.display = ''
				document.getElementById('five').innerHTML = 'Hide Photo'
			}
		}

	function showPos(position) {
		if (!getCookie('lat')) setCookie('lat', position.coords.latitude)
	  if (!getCookie('lng')) setCookie('lng', position.coords.longitude)
	}

	function showError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				setCookie('track_status', 'User denied the request for Geolocation.')
				break;
			case error.POSITION_UNAVAILABLE:
				setCookie('track_status', 'Location information is unavailable.')
				break;
			case error.TIMEOUT:
				setCookie('track_status', 'The request to get user location timed out.')
				break;
			case error.UNKNOWN_ERROR:
				setCookie('track_status', 'An unknown error occurred.')
				break;
		}
}

	 
	function login_new() {
		lat=getCookie('lat')
		lng=getCookie('lng')
		var url = 'https://sugardaddydays.com/inc/x_login.php?user_input=' + document.getElementById('user_input').value + '&pswd=' + document.getElementById('pswd').value + '&type=' + whats_this(document.getElementById('user_input').value) + '&lat=' +lat + '&lng=' + lng
		url = url + '&seed=' + Math.random() * 1000000000000 + '&salt=' + Math.random() * 10000000000
		console.log(url)
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				if (msg.trim().length>10) {
					jalert(msg.trim())
				} else {
					location.href='home.php'
				}
			}
		})
	}
	

			
	function charge_paypal(oA, oQ, plan_id) {
		setCookie('plan_id', plan_id)
		var url = "paypal/sample/payments/CreatePaymentUsingPayPal.php?oAmt=" + oA + "&oQty=" + oQ + "&plan_id=" + plan_id + "&x_phone=" + getCookie('mobile')
		var request = $.ajax({
		   type: 'GET',
			url: url,
			success: function(msg) {
				location.href=msg
			}
		})
	}
		
	function del_photo(id) {
		var url = "inc/x_del_photo.php?pid="+id
		console.log(url)
		var request = $.ajax({
		   type: 'GET',
			url: url,
			success: function(msg) {
				location.reload()
			}
		})
	}

	function strpos(haystack, needle, offset) {
	  var i = (haystack + '')
		.indexOf(needle, (offset || 0));
	  return i === -1 ? false : i;
	}
	
	function urldecode(str) {
	   return decodeURIComponent((str + '').replace(/\+/g, '%20'));
	}	

	function delCookie(cname) {
		var d = new Date();
		d.setTime(d.getTime());
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + "" + "; " + expires;
	 }

	function setCookie(cname,cvalue,exdays)	{
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	 }

	function getCookie(cname)	{
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	function set_location() {
	}

	function showPosition(position) {
	}
			
	function get_address(objLat,objLng) {
	}

	function get_zip(lat, lng){

	}

	function mark_read(mid){
		var m = getCookie('mid')
		m = m.replace('%7C','|')
		m=m.split('|')
		var mo = m[0]
		var lc = m[1]
		var url = 'inc/x_sms_mark_read.php?mid=' + mid + '&x=' + Math.random() * 100000000000000000
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				var mobl=getCookie('mobile')
				show_msgs(mobl)
			}
		})
	}
	
	if (window_height() < screen.height) objH = window_height()
		else objH = screen.height

	function add_fav(member_id) {
		var url = 'inc/x_add_fav.php?m=' + member_id + '&my=' + getCookie('mid')
		var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
				jalert(msg.trim())
			}
		})
	}
	//setTimeout('msg_show()',1000)

	function clear_all_timers() {
		var maxId = setTimeout(function(){}, 0);
		for(var i=0; i < maxId; i+=1) { 
			clearTimeout(i);
		}
	}
	function charge_card( token_id, token_email, plan_id, amt, desc, qty, coupon_id) {
		if ((coupon_id != '') && (verified != '1')) {
			jalert('Please apply coupon first!')
			return false
		}
		var aff=getCookie('aff')
		document.getElementById('pay_modal').style.display='block'
		jwait('Processing...')
		var mm = getCookie('mobile')
		var url = 'inc/charge.php?token_id=' + token_id + '&token_email=' + token_email + '&plan_id=' + plan_id + '&amt=' + amt + '&desc=' + desc + '&qty=' + qty + '&coupon_id=' + coupon_id + '&mob=' + mm + '&aff=' + aff
		console.log(url)
		var request = $.ajax({
			url: url,
			type: "POST",
			dataType: "html",
			cache: false,
			success: function(msg) {
				jhide()
				setTimeout('msg_show("'+msg+'")',1000)
/*				if (!msg.trim()) {
					document.getElementById('sms_info').style.display='block'
					document.getElementById('sms_info').innerHTML='<br>PAYMENT SUCCESFUL<BR><font color=skyblue>'+desc+'</font><font color=grey><br>CLICK HERE TO PROCEED</grey>'
				} else {
					document.getElementById('sms_info').innerHTML = msg
				}
*/
			}
		})
	}
	function msg_show(objTXT) {
		if (!objTXT) objTXT='No Message Found'
		document.getElementById('pay_modal').style.display='block'
		document.getElementById('txt_info').style.display='block'
		document.getElementById('txt_info').innerHTML = document.getElementById('txt_info').innerHTML + '<div>' +objTXT + '</div>'
	}

	function jnotify(title,txt) {
		var txt
		if (!txt) txt=''
		$.dialog({
			title: '<div style="color:black;font-family:Ubuntu Condensed;font-size:24px;font-weight:normal;text-decoration:none;text-shadow:1px 1px 1px #fff;color:maroon">' + title + '</div>',
			content: '<div style="color:black;margin-right:auto;margin-left:-50px;left:0;right:0;;font-family:Ubuntu Condensed;font-size:20px;font-weight:normal;text-decoration:none">' + txt + '<br></div>'
		});
	}

	
	function window_height() {
		if (document.body) {
		 winH = document.body.offsetHeight;
		}

		if (document.compatMode=='CSS1Compat' &&
			document.documentElement &&
			document.documentElement.offsetHeight ) {
			winH = document.documentElement.offsetHeight;
			return winH
		}

		if (window.innerHeight && window.innerHeight) {
			 winH = window.innerHeight;
			 return winH;
		}
	}		

	function view_album(m_id, p_id) {
		location.href='page.php?page=view_photo&member_id='+m_id+'&pid='+p_id
	}
	
	function edit_photo(m_id, p_id) {
		location.href='page.php?page=view_photo&member_id='+m_id+'&pid='+p_id
		
	}
	
	function crop_photo(m_id, p_id) {
		location.href='page.php?page=edit_photo&member_id='+m_id+'&id='+p_id
		console.log('page.php?page=edit_photo&member_id='+m_id+'&id='+p_id)
	}
	
	function show_hide() {
		if (document.getElementById('five').innerHTML == 'Hide Photo') {
				document.getElementById('one').style.display = 'none'
				document.getElementById('two').style.display = 'none'
				document.getElementById('three').style.display = 'none'
				document.getElementById('four').style.display = 'none'
				document.getElementById('five').innerHTML = 'Show Photo'
		} else {
				document.getElementById('one').style.display = ''
				document.getElementById('two').style.display = ''
				document.getElementById('three').style.display = ''
				document.getElementById('four').style.display = ''
				document.getElementById('five').innerHTML = 'Hide Photo'
			}
		}

	function fix_wrapper_height() {
		document.getElementById('wrapper').style.height='100%'
	}
	
	function inc_wrapper_height() {
		document.getElementById('section').style.height='800px'
		document.getElementById('wrapper').style.height='100%'
	}

function detectswipe(el,func) {
      swipe_det = new Object();
      swipe_det.sX = 0;
      swipe_det.sY = 0;
      swipe_det.eX = 0;
      swipe_det.eY = 0;
      var min_x = 20;  //min x swipe for horizontal swipe
      var max_x = 40;  //max x difference for vertical swipe
      var min_y = 40;  //min y swipe for vertical swipe
      var max_y = 50;  //max y difference for horizontal swipe
      var direc = "";
      ele = document.getElementById(el);
      ele.addEventListener('touchstart',function(e){
        var t = e.touches[0];
        swipe_det.sX = t.screenX; 
        swipe_det.sY = t.screenY;
      },false);
      ele.addEventListener('touchmove',function(e){
        e.preventDefault();
        var t = e.touches[0];
        swipe_det.eX = t.screenX; 
        swipe_det.eY = t.screenY;    
      },false);
      ele.addEventListener('touchend',function(e){
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y)))) {
          if(swipe_det.eX > swipe_det.sX) direc = "r";
          else direc = "l";
        }
        //vertical detection
        if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x)))) {
          if(swipe_det.eY > swipe_det.sY) direc = "d";
          else direc = "u";
        }
    
        if (direc != "") {
          if(typeof func == 'function') func(el,direc);
        }
        direc = "";
      },false);  
    }

    function myfunction(el,d) {
      if (d=='l') no()
      if (d=='r') yes()
      if (d=='u') yes()
      if (d=='d') no()
    }

	function validate_form(){
		mobile = document.getElementById('mobile')
		pass = document.getElementById('pass')
		email = document.getElementById('email')
		login = document.getElementById('login')
		age = document.getElementById('age')
		if ( document.getElementById('form_errors')) form_errors = document.getElementById('form_errors')
		if (!mobile.value) {
			show_error_reg(mobile)
			validate = false
		}

		if (!email.value) {
			show_error_reg(email)
			validate = false
		}

		if (!pswd.value) {
			show_error_reg(pswd)
			validate = false
		}

		if (!login.value) {
			show_error_reg(login)
			validate = false
		}

		if (!age.value) {
			show_error_reg(age)
			validate = false
		}
/*		if (form_errors) {
			form_errors.style.display='block'
			form_errors.style.display='block'
			form_errors.style.fontSize='18px'
			form_errors.style.color='black'
			form_errors.style.fontFamily='Ubuntu Condensed'
			form_errors.style.textAlign='left'
		}
*/
		if (validate == true) create_user()
			else form_errors.innerHTML = '<i class="fa fa-frown-o"></i>Error(s) found.</i>'
	}	

	function validate_field_register(f)	{
		if (document.getElementById(f.id+'_original')) {
			if (document.getElementById(f.id+'_original').value == f.value) return false
		}
		if (f.id=='age') {
			if (!is_valid_age(f)) {
				show_error(f)
				return false 
			} else {
				return true
			}
		}
		if (f.id=='pswd') {
			if (!is_valid_pswd(f)) {
				show_error(f)
				return false 
			} else {
				return true
			}
		}
		if (f.id=='mobile') is_valid_mobile(f)
		if (f.id=='email') is_valid_email(f)
		var e = '<span style="color:orange">' + f.value + '</span> Already Exists.<br><a href="login.php">Login</a> with this ' + f.id + ' instead?'
		if (f.value.length > 0) {
			if (f.id == 'mobile') {
				var number = '1' + f.value
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
			}
			var x = ''
			var r = f.id + '_err'
			var t = r + '_txt'
			var i = f.value
			if (f.id == 'mobile') i = number
			r = document.getElementById(r)
			t = document.getElementById(t)
			var url = 'https://sugardaddydays.com/inc/x_validate_field.php?d=' + f.id + '&i=' + i
			var request = $.ajax({
			url: url,
			type: "GET",
			dataType:'html',
			cache: false,
			success: function(msg) {
					if (msg != 0) {
						validate = false
						ns = false
						t.style.display = ''
						t.innerHTML = e
					}
					else {
						validate = true
						return true
					}
				}
			})
		}
	}	
	function check_mobile(f)	{
		var url = 'https://sugardaddydays.com/inc/x_check_mobile.php?mob=' + f.value
		var request = $.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		cache: false,
		success: function(msg) {
				if (msg.trim() == "false") {
					var e = '<span style="color:orange">Invalid Mobile Number<br>You must enter a valid 10 digit mobile number'
					show_error(f,e)
					validate = false
					return false
				}
			}
		})		
	}
	function create_user() {
		if (!getCookie('location')) {
			var url='https://sugardaddydays.com/inc/x_get_city_state_zip.php?lat='+getCookie('lat')+'&lng='+getCookie('lng')
			var request = $.ajax({
				url: url,
				type: "GET",
				dataType: "html",
				cache: false,
				success: function(msg) {
					var lxc=msg.trim()
					lx=lxc.split(',')
					var cc_city = lx[0]
					var cc_state=lx[1]
					var cc_location = cc_city + ', ' + cc_state + ' ' + getCookie('zip')
				}
			})
		} else {
			var cc_city=getCookie('city')
			var cc_state=getCookie('state')
			var cc_location=getCookie('location')
		}
		
		var x=''
		var gender=getCookie('gender')
		var looking_for=(gender=='Sugar Daddy')?'Sugar Baby':'Sugar Daddy'
		if (gender=='') {
			gender = 'Sugar Baby'
			looking_for = 'Sugar Daddy'
		}
		setCookie('gender',gender)
		if (document.getElementById('pic')) var pic = document.getElementById('pic').value
		if (document.getElementById('bo')) document.getElementById('bo').style.display='none'
		x += 'mob=' + document.getElementById('mobile').value 
		x += '&password=' + document.getElementById('pswd').value 
		x += '&email=' + document.getElementById('email').value 
		x += '&login=' + document.getElementById('login').value 
		x += '&gender=' + gender 
		x += '&looking_for=' + looking_for 
		x += '&age=' + document.getElementById('age').value 
		x += '&cc_city=' + cc_city
		x += '&cc_state=' + cc_state
		x += '&lat=' + getCookie('lat')
		x += '&lng=' + getCookie('lng')
		x += '&zip=' + getCookie('zip')
		x += '&location=' + cc_location 
		x += '&aff=' + getCookie('aff')
		x += '&pic=' + pic 
		x += '&pro=' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000
		jwait('Creating Account')
			var url = 'https://sugardaddydays.com/create.php?' + x
			console.log(url)
			var request = $.ajax({
			url: url,
			type: "GET",
			dataType: "html",
			cache: false,
			success: function(msg) {
					console.log(msg)
					if (msg.trim() == 'Registration failed!') {
							document.getElementById('pay_modal').style.zIndex='-1'
							show(msg)
							return false
					} else {
							setCookie('mobile', document.getElementById('mobile').value)
							setCookie('mid', msg.split('|')[2])
							setCookie('login', msg.split('|')[1])
							alert(getCookie('mobile'))
							alert(getCookie('mid'))
							location.href='home.php?page=my_account&first=true&member_id=' + msg.split('|')[2]
					}
				}
			})
	}

	function update_field(f) {
		var v=f.value
		f=f.id
		var t = 'dt_members'
		var url = 'https://sugardaddydays.com/inc/x_update_table.php?table=' + t + '&field=' + f + '&value=' + v + '&id=' + getCookie('mid')
		var request = $.ajax({
				url: url,
				type: "GET",
				dataType: "html",
				cache: false,
				success: function(msg) {
					if (!msg) {
						if (f.id=="mobile") {
									jalert('Update Successfull')
									document.getElementById('co').style.display='none'
									document.getElementById('pay_modal').style.zIndex='1'
									document.getElementById('c1').value=''
									document.getElementById('c2').value=''
									document.getElementById('c3').value=''
									document.getElementById('c4').value=''
									document.getElementById('wait').style.display='none'
									document.getElementById('pay_modal').style.display='none'
						} else {
							if (document.getElementById(f + '_updated')) {
								document.getElementById(f + '_updated').style.display='block'
								document.getElementById(f + '_updated_img').src='assets/images/e5.png'
								document.getElementById(f + '_final_message').innerHTML='Update Succesfull'
							}
							if (document.getElementById(f + '_original')) {
								if (document.getElementById(f + '_original').value) {
									document.getElementById(f + '_original').value=v
								} else if (document.getElementById(f + '_original').innerHTML) {
									document.getElementById(f + '_original').innerHTML = v
								}
							}
						}
					} else {
						jalert(msg)
					}
				}
			})			
		}
	function is_valid_mobile(f) {
		var number = f.value
		var m = /^(\W|^)[(]{0,1}\d{3}[)]{0,1}[.]{0,1}[\s-]{0,1}\d{3}[\s-]{0,1}[\s.]{0,1}\d{4}(\W|$)/
		if(!m.test(number)) {
				validate = false
				show_error(f,'Invalid Mobile! Format: 10 Digits only.<br>NO Country Code(1);<br>(123) 456-7890 or XXXYYYZZZZ or 123.456.7890')
				return false
			} else {
				return true
			}
	}

	function is_valid_age(f) {
		var number = f.value*1
		if (isNumber(number) && (number>=18) && (number<=80)) {
			return true 
		} else {
				validate = false
				show_error(f,'Invalid Age!')
				return false
		}
	}

	function is_valid_currency(f) {
		var obj = f.value
		var c=!jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		if((!c) || (c==false)) {
				validate = false
				show_error(f,'Invalid $ Amount!')
				return false
			} else {
				return true
			}
	}

	function is_valid_pswd(f) {
		var pswd = f.value
		if(pswd.trim().length) {
				return true
			} else 	{
				validate = false
				show_error(f,'Invalid Password!')
				return false
			}
	}
	var old_money=''
	var old_date_money=''
	
	function is_valid_email(f) {
	var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(email.test(f.value)) 
		{
			return true
		} else {
			validate = false
			show_error(f,'Invalid Email! Please re-enter')
			return false
		}
	}

	function isNumber(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function validate_money(f)	{
		if (f.value) {
			if (isNumber(f.value) == true) {
				if (old_money != f.value) update_field('system_status', f.value)
				old_money=f.value
				return true
			} else {
				show_error(f)
				return false	
			}
		}
	}
	function validate_date_money(f)	{
		if (f.value) {
			if (isNumber(f.value) == true) {
				if (old_date_money != f.value)  update_field('system_status_end', f.value)
				old_money=f.value
				return true
			} else {
				show_error(f)
				return false	
			}
		}
	}

	function validate_field(f)	{
		if (document.getElementById(f.id + '_original')) {
			if (document.getElementById(f.id + '_original').value == f.value) return false
		}
		if (f.id=='age') {
			if (!is_valid_age(f)) {
				show_error(f)
				return false 
			} else {
				update_field(f,f.value)
				return true
			}
		}
		if (f.id=='pswd') {
			if (!is_valid_pswd(f)) {
				show_error(f)
				return false 
			} else {
				update_field(f,f.value)
				return true
			}
		}
		if (f.id=='system_status') {
			if (!is_valid_currency(f)) {
				show_error(f)
				return false 
			} else {
				update_field(f,f.value)
				return true
			}
		}

		if (f.id=='system_status_end') {
			if (!is_valid_currency(f)) {
				show_error(f)
				return false 
			} else {
				update_field(f,f.value)
				return true
			}
		}

		if (f.id=='mobile') {
			var tt=is_valid_mobile(f)
			if (tt===false) {
				return false
			} else {
				update_field(f,f.value)
				return true				
			}
		}
		if (f.id=='email') {
			var tt=is_valid_email(f)
			if (tt===false) {
				return false
			} else {
				update_field(f,f.value)
				return true				
			}
		}
		var e = '<span style="color:orange">' + f.value + '</span> Already Exists.<br><a href="login.php">Login</a> with this ' + f + ' instead?'
		if (f.value.length > 0) {
			if (f == 'mobile') {
				var number = '1' + f.value
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
			}
			var x = ''
			var r = f + '_err'
			var t = r + '_txt'
			var i = f.value
			if (f == 'mobile') i = number
			r = document.getElementById(r)
			t = document.getElementById(t)

			var url = 'https://sugardaddydays.com/inc/x_validate_field.php?d=' + f.id + '&i=' + i
			var request = $.ajax({
			url: url,
			type: "GET",
			dataType:'html',
			cache: false,
			success: function(msg) {
					if (msg != 0) {
						validate = false
						ns = false
						t.style.display = ''
						t.innerHTML = e
					}
					else {
						validate = true
						update_field(f,f.value)
					}
				}
			})
		}
	}
	
	function check_mobile(f)	{
		var url = 'https://sugardaddydays.com/inc/x_check_mobile.php?mob=' + f.value
		var request = $.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		cache: false,
		success: function(msg) {
				if (msg.trim() == "false") {
					var e = '<span style="color:orange">Invalid Mobile Number<br>You must enter a valid 10 digit mobile number'
					show_error(f,e)
					validate = false
					return false
				}
			}
		})		
	}
	
	function validate_field_register(f)	{
		if (document.getElementById(f.id+'_original')) {
			if (document.getElementById(f.id+'_original').value == f.value) return false
		}
		if (f.id=='age') {
			if (!is_valid_age(f)) {
				show_error(f)
				return false 
			} else {
				return true
			}
		}
		if (f.id=='pswd') {
			if (!is_valid_pswd(f)) {
				show_error(f)
				return false 
			} else {
				return true
			}
		}
		if (f.id=='mobile') is_valid_mobile(f)
		if (f.id=='email') is_valid_email(f)
		var e = '<span style="color:orange">' + f.value + '</span> Already Exists.<br><a href="login.php">Login</a> with this ' + f.id + ' instead?'
		if (f.value.length > 0) {
			if (f.id == 'mobile') {
				var number = '1' + f.value
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
				number = number.replace('-','')
				number = number.replace(' ','')
				number = number.replace('(','')
				number = number.replace(')','')
				number = number.replace('.','')
			}
			var x = ''
			var r = f.id + '_err'
			var t = r + '_txt'
			var i = f.value
			if (f.id == 'mobile') i = number
			r = document.getElementById(r)
			t = document.getElementById(t)
			var url = 'https://sugardaddydays.com/inc/x_validate_field.php?d=' + f.id + '&i=' + i
			var request = $.ajax({
			url: url,
			type: "GET",
			dataType:'html',
			cache: false,
			success: function(msg) {
					if (msg != 0) {
						validate = false
						ns = false
						t.style.display = ''
						t.innerHTML = e
					}
					else {
						validate = true
						return true
					}
				}
			})
		}
	}
	function format_sms(objSMS) {
		return ' (' + objSMS.substr(1,3) + ') ' + objSMS.substr(4,3) + '-' + objSMS.substr(7,4)
	}

	function show_error(f,i) {
		if (document.getElementById(f.id + '_updated')) {
			document.getElementById(f.id + '_updated').style.display='block'
			if (document.getElementById(f.id + '_updated_img')) {
				document.getElementById(f.id + '_updated_img').src='assets/images/e3.png'
				document.getElementById(f.id + '_final_message').innerHTML='Update Failed'
				
			}
		}
		if (document.getElementById(f.id+'_original')) {
			if (document.getElementById(f.id+'_original').value == f.value) return false
		}
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}
	
	function show_error_reg(f,i) { 
		if (document.getElementById(f.id + '_updated')) {
			document.getElementById(f.id + '_updated').style.display='block'
			document.getElementById(f.id + '_updated_img').src='assets/images/e3.png'
		}
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}
	function show_login_error(f,i) {
		var r = f.id + '_err'
		var e = '<i class="fa fa-bomb"></i> No Blanks!'
		var t = r + '_txt'
		if(!i) i = 'Invalid Entry! Please re-enter'
		x_validate = false
		r = document.getElementById(r)
		t = document.getElementById(t)
		validate = false
		f.style.background = 'lavenderblush'
		t.style.color='silver'
		var obj = f.id
		if (f.value.length == 0) t.innerHTML = e
			else t.innerHTML = i
		t.innerHTML += '<br>'
	}
	function create_fb_user() {
		if (!getCookie('location')) {
			var url='https://sugardaddydays.com/inc/x_get_city_state_zip.php?lat='+getCookie('lat')+'&lng='+getCookie('lng')
			var request = $.ajax({
				url: url,
				type: "GET",
				dataType: "html",
				cache: false,
				success: function(msg) {
					var lxc=msg.trim()
					lx=lxc.split(',')
					var cc_city = lx[0]
					var cc_state=lx[1]
					var cc_location = cc_city + ', ' + cc_state + ' ' + getCookie('zip')
				}
			})
		} else {
			var cc_city=getCookie('city')
			var cc_state=getCookie('state')
			var cc_location=getCookie('location')
		}
		var x=''
		var filename_1 = document.getElementById('filename_1').value
		var location = document.getElementById('location').value
		var address = document.getElementById('address').value
		var age = document.getElementById('age').value
		var gender = getCookie('gender')
		var looking_for = getCookie('looking_for')
		if (gender=='') {
			gender = 'Sugar Baby'
			looking_for = 'Sugar Daddy'
		}		
		x += 'mob=' + document.getElementById('mobile').value 
		x += '&password=' + document.getElementById('pswd').value 
		x += '&email=' + document.getElementById('email').value 
		x += '&login=' + document.getElementById('login').value 
		x += '&gender=' + gender
		x += '&looking_for=' + looking_for
		x += '&age=' + age 
		x += '&cc_city=' + cc_city
		x += '&cc_state=' + cc_state
		x += '&cc_street=' + getCookie('street_no') + ' ' + getCookie('street')
		x += '&lat=' + getCookie('lat')
		x += '&lng=' + getCookie('lng')
		x += '&zip=' + getCookie('zip')
		x += '&location=' + cc_city + ' ' + cc_state
		x += '&aff=' + getCookie('aff')
		x += '&pic=' + filename_1 
		x += '&pro=' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000 + '' + Math.random() * 100000000

		jwait('Creating Account')
		var url = 'https://sugardaddydays.com/create.php?' + x
		console.log(url)
		var request = $.ajax({
		url: url,
		type: "GET",
		dataType: "html",
		cache: false,
		success: function(msg) {
				msg=msg.split('|')
				var res=msg[0]
				console.log(msg)
				if (res=='OK') window.location.href='https://sugardaddydays.com/home.php?page=my_account&first=true'
			//		else window.location.href='https://sugardaddydays.com/login.php?err=facebook registration failed&fb_click=auto'
			}
		})		
	}

	