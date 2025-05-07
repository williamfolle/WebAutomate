/*****************
* LLWebServer    *
* Version 1.2.0 **
* 2025/02/14     *
*******************/

/**
 * @namespace LLWebServer
 */
var LLWebServer = (function () {

const XHR_READY_STATE = {
	UNSENT: 0, 				// Client has been created. open() not called yet.
	OPENED: 1, 				// open() has been called.
	HEADERS_RECEIVED: 2, 	// send() has been called, and headers and status are available.
	LOADING: 3, 			// Downloading; responseText holds partial data.
	DONE: 4 				// The operation is complete.
};

const HTTP_STATUS = {
	OK: 200
};

var m_imgsVarsMap = {};
var m_nextAutoID = 0;
//ultima modifica 
// event on page loading
document.addEventListener('DOMContentLoaded', InitWriteControls, false);

const ATTR_NAME_SYM = "data-llweb-sym";
const ATTR_NAME_PAR = "data-llweb-par";
const ATTR_NAME_REMOTEPAR = "data-llweb-remotepar";
const ATTR_NAME_REFRESH = "data-llweb-refresh";
const ATTR_NAME_IMG = "data-llweb-img";
const ATTR_NAME_FORMAT = "data-llweb-format";

const URL_SYM			= "/api/sym?";
const URL_PAR			= "/api/par?";
const URL_REMOTE_PAR	= "/api/remotepar?";
const URL_PARLIST		= "/api/parlist";
const URL_MENULIST		= "/api/menulist";
const URL_SYMLIST		= "/api/symlist";
const URL_LIC_STATUS	= "/api/sys/licensestatus";
const URL_PLC_STATUS	= "/api/sys/status";
const URL_REG_LIC		= "/api/sys/licenseregister";
const URL_PRODUCTLIST	= "/api/sys/productlist";
const URL_SYSLOG		= "/api/sys/log";
const URL_START_PLC		= "/api/sys/start";
const URL_RESTART_PLC	= "/api/sys/restart";
const URL_STOP_PLC		= "/api/sys/stop";
const URL_SHUTDOWN		= "/api/sys/shutdown";
const URL_CHECK_SESSION = "/api/sys/admstate";
const URL_LOGIN			= "/api/sys/admlogin";
const URL_LOGOUT		= "/api/sys/admlogout";
const URL_CHANGE_PASS	= "/api/sys/changepass";
const LINESEP = "\r\n";

const IMG_FOLDER_NAME = "img";

const changeEvent = new Event('change2', { bubbles:true });

/**
 * Callback called when async functions are used, with the answer from the webserver
 * @callback ValuesCallback
 * @param {Array<object>} Array of values got from the webserver
 */


/**
 * Reads the values of one or more PLC symbols from the webserver
 * @param {Array.<string>} names Array with the list of symbol names to read
 * @param {boolean} async If true, the values will be read asynchronously, and the callbackFunc will be called with the values; if false, the request will be done synchronously, and the values will be returned by this function
 * @param {ValuesCallback} callbackFunc 
 * @returns {boolean|Array<object>} False if error; if !async, will return an array of values
 * @memberof LLWebServer
 * @instance
 */
function GetSymValues(names, async, callbackFunc)
{
	// in modalità asincrona deve per forza essere specificata la callback, altrimenti non si potrà avere i valori...
	if (async && !callbackFunc)
		return false;
	
	var xhttp = new XMLHttpRequest();
	
	var resultValues = null;
	xhttp.onreadystatechange = 
		function()
		{
			if (this.readyState == XHR_READY_STATE.DONE)
			{
				if (this.status == HTTP_STATUS.OK)
				{
					var values = this.responseText.split(LINESEP);
					
					if (values[values.length-1] == "")
						// rimuove ultimo elemento vuoto se presente; la stringa infatti tipicamente finisce con LINE_SEP, anche se ha un solo risultato
						values.pop();
						
					if (callbackFunc)
						callbackFunc(values);
					
					if (!async)
						// salva valore di ritorno se sincrona
						resultValues = values;
				}
				else
				{
					if (callbackFunc)
						callbackFunc(null);
				}
			}
		};
	
	xhttp.open("GET", URL_SYM + names.join("&"), async);
	try
	{
		xhttp.send();
	}
	catch (ex)
	{
		if (callbackFunc)
			callbackFunc(null);
		
		return false;
	}
	
	if (!async)
		return resultValues;
}

/**
 * Reads the values of one or more parameters from the webserver
 * @param {Array.<number>} parList Array with the list of IPA (index of paramters) to read; for a remote parameter request, it's an Array with a list of remote par expressions
 * @param {boolean} async If true, the values will be read asynchronously, and the callbackFunc will be called with the values; if false, the request will be done synchronously, and the values will be returned by this function
 * @param {ValuesCallback} callbackFunc 
 * @param {?boolean} remote indicates if the request is for a remote parameter value; default is false
 * @returns {boolean|Array<object>} False if error; if !async, will return an array of values
 * @memberof LLWebServer
 * @instance
 */
function GetParValues(parList, async, callbackFunc, remote)
{
	// in modalità asincrona deve per forza essere specificata la callback, altrimenti non si potrà avere i valori...
	if (async && !callbackFunc)
		return false;
	
	var xhttp = new XMLHttpRequest();
	
	var resultValues = null;
	xhttp.onreadystatechange = 
		function()
		{
			if (this.readyState == XHR_READY_STATE.DONE)
			{
				if (this.status == HTTP_STATUS.OK)
				{
					var values = this.responseText.split(LINESEP);
					
					if (values[values.length-1] == "")
						// rimuove ultimo elemento vuoto se presente; la stringa infatti tipicamente finisce con LINE_SEP, anche se ha un solo risultato
						values.pop();
						
					if (callbackFunc)
						callbackFunc(values);
					
					if (!async)
						// salva valore di ritorno se sincrona
						resultValues = values;
				}
				else
				{
					if (callbackFunc)
						callbackFunc(null);
				}
			}
		};

	let url = URL_PAR;
	if (remote !== undefined && remote === true)
		url = URL_REMOTE_PAR

	xhttp.open("GET", url + parList.join("&"), async);
	try
	{
		xhttp.send();
	}
	catch (ex)
	{
		if (callbackFunc)
			callbackFunc(null);
		
		return false;
	}
	
	if (!async)
		return resultValues;
}

/**
 * Writes the values of one or more PLC symbols to the webserver
 * @param {Object.<string, object>} values Map of name => value with PLC symbols to write
 * @param {boolean} async If true, the values will be written asynchronously; if false, the request will be done synchronously
 * @returns {boolean} False if error, otherwise true
 * @memberof LLWebServer
 * @instance
*/
function SetSymValues(values, async)
{
	var assignments = [];
	for (var name in values)
		assignments.push(name + "=" + encodeURIComponent(values[name]));
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", URL_SYM + assignments.join("&"), async);
	try
	{
		xhttp.send();
	}
	catch (ex)
	{
		return false;
	}
	
	return true;
}

/**
 * Writes the values of one or more parameters to the webserver
 * @param {Object.<number, object>} values Map of IPA => value with the parameters to write; for a remote parameter request, it's an Array with a list of remote par expressions
 * @param {boolean} async If true, the values will be written asynchronously; if false, the request will be done synchronously
 * @param {?boolean} remote indicates if the request is for a remote parameter value; default is false
 * @returns {boolean} False if error, otherwise true
 * @memberof LLWebServer
 * @instance
*/
function SetParValues(values, async, remote)
{
	if (async === undefined)
		async = true;
	
	var assignments = [];
	for (var ipa in values)
		assignments.push(ipa + "=" + encodeURIComponent(values[ipa]));
	
	var xhttp = new XMLHttpRequest();

	let url = URL_PAR;
	if (remote !== undefined && remote === true)
		url = URL_REMOTE_PAR

	xhttp.open("PUT", url + assignments.join("&"), async);
	try
	{
		xhttp.send();
	}
	catch (ex)
	{
		return false;
	}
	
	return true;
}

function InitWriteControls()
{
	let symCtrls = document.querySelectorAll("[" + ATTR_NAME_SYM + "], [" + ATTR_NAME_PAR + "], [" + ATTR_NAME_REMOTEPAR + "]");
	for (let ctrlKey in symCtrls)
	{
		let ctrl = symCtrls[ctrlKey];

		// writes the values and restarts the autorefresh
		if (ctrl.tagName === "INPUT")
		{
			if (ctrl.type === "text" || ctrl.type === "number")
			{
				ctrl.addEventListener("keydown", function (event)
				{
					const KEY_ENTER = 13;
					const KEY_TAB = 9;

					// sui dispositivi mobili i keyCode della tastiera virtuale non sono strettamente gli stessi di quella fisica
					// per questo, quando si preme invio, e' come se fosse un tab che va all'input successivo
					let mobileOrTablet = isDeviceMobileOrTablet();
					if (event.keyCode === KEY_ENTER || (mobileOrTablet && event.keyCode === KEY_TAB))
					{
						OnWriteVar(event, ctrl.value);
					}

					// se e' stato premuto tab, blocca il focus sull'input successivo
					if (mobileOrTablet && event.keyCode === KEY_TAB)
						event.preventDefault();
				});
			}
			else if (ctrl.type === "radio" || ctrl.type == "checkbox" || ctrl.type == "button")
			{
				ctrl.addEventListener("click", function (event)
				{
					let value = ctrl.value;

					if (ctrl.type == "checkbox")
						value = ctrl.checked;

					OnWriteVar(event, value);
				});
			}

			// oltre all'evento di keydown, scatenato dalla tastiera, uso un evento di change se il valore e' stato cambiato dalle freccine su/giu della input
			if (ctrl.type === "number") {
				ctrl.addEventListener("change", function (event)
				{
					// TODO faccio il focus per mettere in pausa il refresh sulla input. ma non funziona benissimo
					ctrl.focus();

					OnWriteVar(event, ctrl.value);
				});
			}
		}
		// per button uso il doppio EventListener per poterlo usare sia con un input di tipo button che un elemento button
		else if (ctrl.tagName === "BUTTON")
		{
			ctrl.addEventListener("click", function (event)
			{
				OnWriteVar(event, ctrl.value);
			});
		}
		else if (ctrl.tagName === "SELECT")
		{
			ctrl.addEventListener("change", function (event)
			{
				OnWriteVar(event, ctrl.value);
			});
		}
		else if (ctrl.tagName === "IMG")
		{
			// uso l'attributo data-readonly perche' l'immagine di default non ha un attributo readonly
			let readonlyAttr = ctrl.getAttribute("data-readonly");
			if (readonlyAttr === null || readonlyAttr === "false")
			{
				ctrl.addEventListener("click", function (event)
				{
					let imgsMap = GetImgValuesMap(ctrl);
					if (imgsMap) {
						// faccio in questo modo altrimenti ".src" mi restituisce il path assoluto
						let currSrC = ctrl.getAttribute("src");

						// valori degli enum (ovvero le chiavi dell'oggetto)
						let imgVarsKeys = Object.keys(imgsMap);

						// inizializzo col primo valore che trovo
						let currentVal = imgVarsKeys[0];

						// cerco quanto vale l'enum corrente
						for (let key in imgsMap)
						{
							if (IMG_FOLDER_NAME + "/" + imgsMap[key] == currSrC) {
								currentVal = key;
								break;
							}
						}

						// trovo quale sara' il valore successivo (la chiave successiva)
						let nextVal;
						for (let i = 0, j = imgVarsKeys.length; i < j; i++) {
							if (imgVarsKeys[i] == currentVal) {
								// se sono all'ultima chiave riparto da 0
								if (i+1 >= j)
									nextVal = imgVarsKeys[0];
								else
									nextVal = imgVarsKeys[i + 1];
								break;
							}
						}

						// scrivo il valore a mano perche' la gestione di OnWriteVar e' completamente differente
						WriteCtrlValue(ctrl, nextVal);
					}
				});
			}
		}
	}
}

/**
 * Scrive il valore del controllo HTML
 * @param {Event} event contiene il target che ha "scatenato" l'evento. Serve per prendere i data attribute e effettuare il blur dopo la scrittura
 * @param {*} value valore da scrivere
 */
function OnWriteVar(event, value)
{
	WriteCtrlValue(event.target, value);

	// blur per toglierlo dagli elementi attivi (e far ripartire il refresh)
	event.target.blur();
}

function WriteCtrlValue(ctrl, value)
{
	let format = ctrl.getAttribute(ATTR_NAME_FORMAT);

	if (format) {
		// formato speciale HH:MM
		if (format === "HH:MM") {
			let pos = value.indexOf(":");
			// nelle parseInt esplicita la base 10 per evitare problemi con l'ottale quando la stringa inizia con gli zeri (es. 08:08)
			if (pos != -1)
			{
				let isNeg = false;
				if (value.charAt(0) == "-")
				{
					value = value.substr(1);
					pos--;
					isNeg = true;
				}
				value = parseInt(value.substr(0,pos), 10) * 60 + parseInt(value.substr(pos+1), 10);
				if (isNeg)
					value = -value;
			}
			else
				value = parseInt(value, 10);
		}
		else {
			let fmtType = format ? format.slice(-1) : "";
			if (fmtType == "x" || fmtType == "X")
				// se formato hex (ovvero contiene x o X) converte in base 16
				value = parseInt(value, 16);
			else if (fmtType == "b")
				// se formato bin (ovvero contiene b, non standard ma implementato da sprintf) converte in base 2; rimuove "0b" se presente all'inizio
				value = parseInt(value.substr(0,2) == "0b" ? value.substr(2) : value, 2);
			else if (fmtType == "o")
				// se formato octal (ovvero contiene o) converte in base 8
				value = parseInt(value, 8);
			else if (fmtType == "D")
			{
				// formato speciale per intero con punto decimale spostato: %.3D
				let n = parseInt(format.slice(2,-1));
				value = Math.round(parseFloat(value) * Math.pow(10, n));
			}
		}
	}

	let symName = ctrl.getAttribute(ATTR_NAME_SYM);
	if (symName)
	{
		let symObj = {};
		symObj[symName] = value;
		SetSymValues(symObj, false);
	}
	else
	{
		let parAddr = ctrl.getAttribute(ATTR_NAME_PAR);
		if (parAddr)
		{
			let parObj = {};
			parObj[parAddr] = value;
			SetParValues(parObj, false);
		}
		else
		{
			let remoteParStr = ctrl.getAttribute(ATTR_NAME_REMOTEPAR);
			if (remoteParStr)
			{
				let parObj = {};
				parObj[remoteParStr] = value;
				SetParValues(parObj, false, true);
			}
		}
	}
}

function CompareNoCase(str1, str2)
{
	return str1.toLowerCase() == str2.toLowerCase();
}

function BoolToNum(str)
{
	if (CompareNoCase(str, "true"))
		return "1";
	else if (CompareNoCase(str, "false"))
		return "0";
	else
		return str;
}

function GetImgValuesMap(ctrl)
{
	let imgAttributesObj;
	// se l'ho gia' parsato lo prendo dalla mappa globale
	if (m_imgsVarsMap[ctrl.id])
	{
		imgAttributesObj = m_imgsVarsMap[ctrl.id];
	}
	// altrimenti vado a parsare il contenuto dell'attributo con le immagini
	else
	{
		// il campo per le immagini e' del tipo: "1:suzuki.png , 2:honda.png , 3:kawasaki.jpeg , 4:yamaha.png"
		let imgsAttribute = ctrl.getAttribute(ATTR_NAME_IMG);
		if (imgsAttribute)
		{
			// rimozione di tutti gli spazi bianchi anche interni
			imgsAttribute = imgsAttribute.replace(/ /g, "")

			// split delle singole coppie di valori separati da ","
			let imgAttributesArr = imgsAttribute.split(",");

			imgAttributesObj = {};
			imgAttributesArr.forEach(function (attr) {
				// split di valore e immagine asspciata separati da ":"
				let attribute = attr.split(":");
				let value = BoolToNum(attribute[0]);
				imgAttributesObj[value] = attribute[1];
			});

			// se l'oggetto non ha un id me lo invento
			if (!ctrl.id)
			{
				ctrl.id = "autoid_" + m_nextAutoID;
				m_nextAutoID++;
			}

			// pusho l'oggetto con le immagini nella mappa globale
			m_imgsVarsMap[ctrl.id] = imgAttributesObj;
		}
	}

	return imgAttributesObj;
}

function FormatValue(value, format)
{
	let result;
	if (format) {
		// formato speciale HH:MM
		if (format === "HH:MM") {
			let isNeg = false;
			if (value < 0)
			{
				isNeg = true;
				value = -value;
			}

			let hh = parseInt(value / 60);
			let mm = value % 60;
			result = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm;
			if (isNeg)
				result = "-" + result;
		}
		// formato speciale per intero con punto decimale spostato: %.3D
		else if (format.slice(0,1) === "%" && format.slice(-1) === "D") {
			let n = parseInt(format.slice(2,-1));
			result = (value / Math.pow(10, n)).toFixed(n);
		}
		// altrimenti usa la sprintf standard
		else
			result = sprintf(format, value);
	}
	else
		result = value;
	
	return result;
}

/**
 * Updates the values of the specified list of controls, that should be associated with values with specific attributes (data-llweb-sym or data-llweb-par)
 * @param {Array.<object>|Array.<string>} controls Array of HTML elements, or array of names. If not specified, all elements will be updated
 * @param {?number} periodMs If 0 (default), the read will be one-shot; otherwise, the number of ms for a periodic update
 * @param {?boolean} async If true (default), the values will be read asynchronously; if false, the request will be done synchronously
 * @returns {number} If periodMs != 0, the ID of the associated HTML timer will be returned (to be used with clearInterval)
 * @memberof LLWebServer
 * @instance
 */
function UpdateControls(controls, periodMs, async)
{
	function UpdateControlsWithValues(controls, values) // Funzione aggiornata da HVAC AEC per gestire il logger
	{
		for (var i = 0; i < controls.length; i++)
		{
			var ctrl = controls[i];

			// se ho un controllo attivo non lo refresho per non sovrascriverlo
			let activeCtrl = document.activeElement;
			if (activeCtrl == ctrl)
				continue;

			var newVal;
			let isChanged = false;
			if (values && values.length === controls.length)
				newVal = values[i];
			else
				newVal = "###";

			if (ctrl.tagName === "INPUT")
			{
				if (ctrl.type === "radio") {
					const value = newVal == ctrl.value;
					isChanged = value && (newVal != ctrl.checked);
					ctrl.checked = value;
				}
				else if (ctrl.type === "checkbox") {
					const value = ParseBoolean(newVal);
					isChanged = value != ctrl.checked;
					ctrl.checked = value;
				}
				else if (ctrl.type === "text" || ctrl.type === "number") {
					const value = FormatValue(newVal, ctrl.getAttribute(ATTR_NAME_FORMAT));
					isChanged = value != ctrl.value;
					ctrl.value = value;
				}
				else if (ctrl.type === "button") {
					const value = newVal == ctrl.value;
					isChanged = value && !ctrl.classList.includes('active');
					SetStyleToActiveButton(ctrl, value);
				}

				if(isChanged)
					ctrl.dispatchEvent(changeEvent);
			}
			else if (ctrl.tagName === "SELECT")
			{
				//newVal = "0";  //william 06/02/2024 - modificato perche azzerava tutte le volte il select. 
				const isChanged = ctrl.value !== newVal;
				ctrl.value = newVal;
				if(isChanged) {
					ctrl.dispatchEvent(changeEvent);
				}
			}
			else if (ctrl.tagName === "IMG")
			{
				let imgAttributesObj = GetImgValuesMap(ctrl);
				let imgfile = imgAttributesObj[BoolToNum(newVal)];
				if (imgfile)
					ctrl.src = IMG_FOLDER_NAME + "/" + imgfile;
				else
					ctrl.src = "";
			}
			else if (ctrl.tagName === "BUTTON") {
				SetStyleToActiveButton(ctrl, ctrl.value == newVal);
				ctrl.dispatchEvent(changeEvent);
			}
			else if (ctrl.datalist.includes('chat-msg')) {
				doSomenthing()
				ctrl.querySelector(".direct-chat-text").textContent = value
			}
			else {
				ctrl.innerHTML = newVal;
				ctrl.dispatchEvent(changeEvent);
			}

		}
	}

	function DoUpdate()
	{
		// l'url ha lunghezza massima di 8192 caratteri (su Webserver Mongoose)
		const MAX_URL_LENGTH = 8000;

		/**
		 * The function groups a list of request items (parameters or symbols) and their corresponding HTML controls into multiple
		 * arrays based on a maximum URL length.
		 * @param reqItems An array representing the items for a request.
		 * @param HTMLControls An array of HTML controls (e.g. input fields, buttons) that correspond to the
		 * request items.
		 * @returns an array of objects, where each object represents a group of request items and their
		 * corresponding HTML controls. Each object has two properties: "items" which is an array of request
		 * items, and "controls" which is an array of HTML controls.
		 */
		function GetReqGroups(reqItems, HTMLControls) {
			let tmpUrl = URL_SYM;

			let groupIdx = 0;
			let res = [];
			for (let i = 0; i < reqItems.length; i++) {
				const reqItem = reqItems[i];

				// se l'URL ha raggiunto la lunghezza massima aggiungo un nuovo gruppo
				if (tmpUrl.length > MAX_URL_LENGTH) {
					groupIdx++;
					tmpUrl = URL_SYM;
				}

				if (!res[groupIdx]) {
					res[groupIdx] = {
						items: [],
						controls: []
					};
				}

				tmpUrl += `&${reqItem}`;
				res[groupIdx].items.push(reqItem);
				res[groupIdx].controls.push(HTMLControls[i]);
			}

			return res;
		}

		if (symControls.length != 0) {
			let symNamesGroups = GetReqGroups(symNames, symControls);

			for (const group of symNamesGroups) {
				let symNames = group.items;
				let symControls = group.controls;

				GetSymValues(symNames, async, (values) => {
						UpdateControlsWithValues(symControls, values);
					}
				);
			}
		}

		if (parControls.length != 0) {
			let parGroups = GetReqGroups(parIpas, parControls);

			for (const group of parGroups) {
				let parIpas = group.items;
				let parControls = group.controls;

				GetParValues(parIpas, async, (values) => {
						UpdateControlsWithValues(parControls, values);
					}
				);
			}
		}

		if (remoteParControls.length != 0) {
			let remoteParGroups = GetReqGroups(remoteParStrList, remoteParControls);

			for (const group of remoteParGroups) {
				let remoteParStrList = group.items;
				let remoteParControls = group.controls;

				GetParValues(remoteParStrList, async, (values) => {
					UpdateControlsWithValues(remoteParControls, values);
				}, true);
			}
		}
	}

	function SetStyleToActiveButton(ctrl, active)
	{
		if (active)
			ctrl.classList.add("active");
		else
			ctrl.classList.remove("active");
	}

	// per default sempre richieste asincrone
	if (async === undefined)
		async = true;
	
	// per default lettura one-shot
	if (periodMs === undefined)
		periodMs = 0;

	if (controls === undefined)
		controls = document.querySelectorAll("[" + ATTR_NAME_SYM + "], [" + ATTR_NAME_PAR + "], [" + ATTR_NAME_REMOTEPAR + "]");

	var symControls = [];
	var symNames = [];
	var parControls = [];
	var parIpas = [];
	var remoteParControls = [];
	var remoteParStrList = [];

	for (var i = 0; i < controls.length; i++)
	{
		var ctrl = controls[i];
		if (typeof ctrl === "string")
		{
			// specificata stringa invece del controllo fisico, lo cerca ora
			ctrl = document.getElementById(ctrl);
			if (!ctrl)
				continue;
		}
		
		var symName = ctrl.getAttribute(ATTR_NAME_SYM);
		if (symName)
		{
			// associato simbolo PLC (nome var)
			symControls.push(ctrl);
			symNames.push(symName);
		}

		var parIpa = ctrl.getAttribute(ATTR_NAME_PAR);
		if (parIpa)
		{
			// associato parametro (IPA)
			parControls.push(ctrl);
			parIpas.push(parIpa);
		}

		var remoteParStr = ctrl.getAttribute(ATTR_NAME_REMOTEPAR);
		if (remoteParStr) {
			// associato parametro (stringa per lettura remota parametro)
			remoteParControls.push(ctrl);
			remoteParStrList.push(remoteParStr);
		}
	}
	
	if (periodMs === 0)
		// aggiornamento one-shot
		DoUpdate();
	else
		// aggiornamento periodico, ritorna in output l'ID del timer per poterlo fermare
		return setInterval(DoUpdate, periodMs);
}


var m_autoRefreshTimer = null;

/**
 * Starts automatic refresh of all controls, with the data-llweb-refresh attribute: This should be tipically called on onload()
 * @param {number} periodMs Number of ms for the periodic update
 * @memberof LLWebServer
 * @instance
 */
function AutoRefreshStart(periodMs)
{
	// mette in refresh tutti gli elementi con attributo data-llweb-refresh
	var controls = document.querySelectorAll("*[" + ATTR_NAME_REFRESH + " = 'true']");
	m_autoRefreshTimer = UpdateControls(controls, periodMs, true);
}

/**
 * Stops automatic refresh of all controls
 */
function AutoRefreshStop()
{
	if (m_autoRefreshTimer !== null)
	{
		clearInterval(m_autoRefreshTimer);
		m_autoRefreshTimer = null;
	}
}

/**
 * Gets the list of parameters included in the specified menuID (always makes the call synchronously)
 * @param {number} menuID ID of the menu; 0 to get all parameters
 * @returns {Array.<object>} Array of objects with the definition of the parameters, or undefined in case of errors
 * @memberof LLWebServer
 * @instance
 */
function GetParList(menuID)
{
	let data = {};
	data['id'] = menuID;

	let result = getDataSync(URL_PARLIST, data);

	return result;
}

/**
 * Gets the list of symbols (always makes the call synchronously)
 * @param {string} query Query string; please refer to the Webserver documentation for more informations
 * @returns {Array.<object>} Array of objects with the definition of the symbols, or undefined in case of errors
 * @memberof LLWebServer
 * @instance
 */
function GetSymList(query)
{
	let data = {};
	data['name'] = query;

	let result = getDataSync(URL_SYMLIST, data);

	return result;
}

/**
 * Gets the list (or tree) of menu children, starting from the specified menuID (always makes the call synchronously)
 * @param {number} menuID ID of the menu to query; 0 to get from the root
 * @param {boolean} recursive True to get all children recursively as a tree, False to get only the first-level children
 * @returns {Array.<object>} Array of objects with the definition of the menus, or undefined in case of errors
 * @memberof LLWebServer
 * @instance
 */
function GetMenuList(menuID, recursive)
{
	let data = {};
	data['id'] = menuID;
	data['recursive'] = (recursive ? 1 : 0);

	let result = getDataSync(URL_MENULIST, data);

	return result;
}

/**
 * Gets the license status of the specified product
 * @param {?string} productName name of the product to get the license status. If not specified, it's intended as the default product
 * @returns {Array.<object>} Array of objects with the product name, the license status value and the product hardware id
 * @memberof LLWebServer
 * @instance
 */
function GetLicenseStatus(productName)
{
	let data = {};
	data['product'] = productName;

	let result = getDataSync(URL_LIC_STATUS, data);

	return result;
}

/**
 * Gets the runtime status
 * @param {ValuesCallback} callbackFunc 
 * @returns {ResultCallback} Array of objects with the product name, the license status value and the product hardware id
 * @memberof LLWebServer
 * @instance
 */
function GetRuntimeStatus(callbackFunc)
{
	// la faccio asincrona dato che sara' chiamata in continuazione
	getDataAsync(URL_PLC_STATUS, null, function(res) {
		if (res && callbackFunc)
			callbackFunc(res);
	});
}

/**
 * Gets the products list on the current target
 * @returns {Array.<object>} Array of objects with the products list
 * @memberof LLWebServer
 */
function GetProductList()
{
	let result = getDataSync(URL_PRODUCTLIST);

	return result;
}

/**
 * Gets the products list on the current target
 * @param {?number} mask the exadecimal log print mask
 * @param {?number} startLine the line where logging starts (default = 0)
 * @param {?number} numLines Number of lines to print (default till the end of the log buffer)
 * @param {ValuesCallback} callbackFunc 
 * @memberof LLWebServer
 * @instance
 */
function GetSystemLog(mask, startLine, numLines, callbackFunc)
{
	let data = {};
	if (mask)
		data['mask'] = mask;
	if (startLine)
		data['startLine'] = startLine;
	if (numLines)
		data['numLines'] = numLines;

	// la faccio asincrona dato che sara' chiamata in continuazione
	getDataAsync(URL_SYSLOG, data, function(res) {
		if (res && callbackFunc)
			callbackFunc(res);
	});
}

/**
 * Registers the license status of the specified product
 * @param {!string} productName name of the product to register
 * @param {!string} productLicenseKey the license key for the specified product
 * @returns {boolean} False if error, otherwise true
 * @memberof LLWebServer
 */
function RegisterLicense(productName, productLicenseKey)
{
	let data = {};
	data["product"] = productName;
	data["license"] = productLicenseKey;

	let res = putDataSync(URL_REG_LIC, data);
	return res;
}

/**
 * Starts the PLC
 * @returns {Object} an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function StartPLC()
{
	let res = putDataSync(URL_START_PLC);
	return res;
}

/**
 * Stops the PLC
 * @returns {Object} an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function StopPLC()
{
	let res = putDataSync(URL_STOP_PLC);
	return res;
}

/**
 * Restarts the PLC
 * @returns {Object} an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function RestartPLC()
{
	let res = putDataSync(URL_RESTART_PLC);
	return res;
}

/**
 * Executes the shutdown of the runtime
 * @returns {Object} an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function ShutdownRuntime()
{
	let res = putDataSync(URL_SHUTDOWN);
	return res;
}

/**
 * Makes the login for the specified user
 * @param {string} username
 * @param {string} password
 * @param {?boolean} async If true, the request is made asynchronously, and the callbackFunc is called with the result; if false, the request is made synchronously, and the result is returned by this function
 * @param {?ResultCallback} callbackFunc 
 * @returns {Array.<object>} if !async, an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function Login(username, password, async, callbackFunc)
{
	let data = {
		password: password,
		username: username
	};

	if (!async)
		return putDataSync(URL_LOGIN, data);
	else
		putDataAsync(URL_LOGIN, data, callbackFunc);
}

/**
 * Makes the logout for the current user
 * @param {string} username
 * @param {?boolean} async If true, the request is made asynchronously, and the callbackFunc is called with the result; if false, the request is made synchronously, and the result is returned by this function
 * @param {?ResultCallback} callbackFunc 
 * @returns {Array.<object>} if !async, an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function Logout(async, callbackFunc)
{
	if (!async)
		return putDataSync(URL_LOGOUT);
	else
		putDataAsync(URL_LOGOUT, null, callbackFunc);
}

/**
 * Sets a new user passowrd
 * @param {!string} oldPassword
 * @param {!string} password
 * @param {?boolean} async If true, the request is made asynchronously, and the callbackFunc is called with the result; if false, the request is made synchronously, and the result is returned by this function
 * @param {?ResultCallback} callbackFunc 
 * @returns {Array.<object>} if !async, an object with the operation result
 * @memberof LLWebServer
 * @instance
 */
function ChangeUserPassword(oldPassword, password, async, callbackFunc)
{
	let data = {
		password: password,
		oldPassword: oldPassword
	};

	if (!async)
		return putDataSync(URL_CHANGE_PASS, data);
	else
		putDataAsync(URL_CHANGE_PASS, data, callbackFunc);
}

/**
 * Checks if the session for the logged user is valid
 * @returns {Array.<object>} Array of objects with the result of the request
 * @param {?boolean} async If true, the request is made asynchronously, and the callbackFunc is called with the result; if false, the request is made synchronously, and the result is returned by this function
 * @param {?ResultCallback} callbackFunc 
 * @memberof LLWebServer
 * @instance
 */
function CheckSessionIsValid(async, callbackFunc)
{
	if (!async)
		return getDataSync(URL_CHECK_SESSION);
	else
		getDataAsync(URL_CHECK_SESSION, null, callbackFunc);
}

/**
 * GET SINCRONA al server che restituisce una risposta JSON
 * ATTENZIONE: non puo' essere usata per le chiamate di parametri e simboli perche' la loro risposta NON e' un JSON
 * @param {!string} url URL a cui fare la GET
 * @param {?object} data  mappa di valori con i dati della richiesta tipo <br><code>{"name": "value", "foo": "bar"}</code>
 * @returns {object} oggetto JS valorizzato
 */
function getDataSync(url, data)
{
	let dataStr = getAJAXString(data);

	let getUrl = url + dataStr;

	let xhr = new XMLHttpRequest();

	var result;
	xhr.onreadystatechange = 
		function()
		{
			if (this.readyState == XHR_READY_STATE.DONE && this.status == HTTP_STATUS.OK)
				result = parseJSON(this.responseText);
		};

	xhr.open("GET", getUrl, false);
	try
	{
		xhr.send();
	}
	catch (ex)
	{
		return;
	}

	return result;
}

/**
 * GET ASINCRONA al server che restituisce una risposta JSON
 * ATTENZIONE: non puo' essere usata per le chiamate di parametri e simboli perche' la loro risposta NON e' un JSON
 * @param {!string} url URL a cui fare la GET
 * @param {?object} data mappa di valori con i dati della richiesta tipo <br><code>{"name": "value", "foo": "bar"}</code>
 * @param {!Function} callback funzione di callback che passa come argomento l'oggetto JS valorizzato
 */
function getDataAsync(url, data, callback)
{
	if (!callback) {
		console.error("Callback function is not valid");
		return;
	}

	let dataStr = getAJAXString(data);

	let getUrl = url + dataStr;

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = 
	function()
		{
			if (this.readyState == XHR_READY_STATE.DONE && this.status == HTTP_STATUS.OK) {
				let jsonData = parseJSON(xhr.responseText);
				callback(jsonData);
			}
		};

	xhr.open("GET", getUrl, true);
	try
	{
		xhr.send();
	}
	catch (ex)
	{
		callback(null);
	}
}

/**
 * PUT SINCRONA al server che restituisce una risposta JSON
 * ATTENZIONE: non puo' essere usata per le chiamate di parametri e simboli perche' la loro risposta NON e' un JSON
 * @param {!string} url URL a cui fare la PUT
 * @param {object} data mappa di valori con i dati della richiesta tipo <br><code>{"name": "value", "foo": "bar"}</code>
 * @returns {object} oggetto JS valorizzato con il risultato della PUT
 */
function putDataSync(url, data)
{
	let dataStr = getAJAXString(data);

	let putUrl = url + dataStr;

	let xhr = new XMLHttpRequest();

	var result;
	xhr.onreadystatechange = 
		function()
		{
			if (this.readyState == XHR_READY_STATE.DONE)
				result = parseJSON(this.responseText);
		};

	xhr.open('PUT', putUrl, false);
	try
	{
		xhr.send(dataStr);
	}
	catch (ex)
	{
		return;
	}

	return result;
}

/**
 * PUT ASINCRONA al server che restituisce una risposta JSON
 * ATTENZIONE: non puo' essere usata per le chiamate di parametri e simboli perche' la loro risposta NON e' un JSON
 * @param {!string} url URL a cui fare la PUT
 * @param {object} data mappa di valori con i dati della richiesta tipo <br><code>{"name": "value", "foo": "bar"}</code>
 * @param {!Function} callback funzione di callback che passa come argomento l'oggetto JS valorizzato
 */
function putDataAsync(url, data, callback)
{
	if (!callback)
		console.error("Callback function is not valid");

	let dataStr = getAJAXString(data);

	let putUrl = url + dataStr;

	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == XHR_READY_STATE.DONE && this.status == HTTP_STATUS.OK) {
			let jsonData = parseJSON(xhr.responseText);
			callback(jsonData);
		}
	};

	xhr.open('PUT', putUrl, true);
	try {
		xhr.send(dataStr);
	}
	catch (ex) {
		callback(null);
	}
}

/**
 * Try to parse the JSON string, and if it fails, return null
 * @param {!string} JSONStr The JSON string to parse
 * @returns the data object
 */
function parseJSON(JSONStr)
{
	try
	{
		let data = JSON.parse(JSONStr);
		return data;
	}
	catch (e)
	{
		console.error("Error parsing JSON: " + e);
		return null;
	}
}

// crea la stringa da usare nelle GET e nelle PUT partendo da un oggetto e appendendo i parametri da passare al server
function getAJAXString(data)
{
	// stratagemma usato per evitare la cache di IE...
	let date = new Date();
	let cacheStr = date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();
	if (data === undefined || data === null)
		data = {};
	data["_noCache"] = cacheStr;

	let dataArr = [];
	for (let key in data)
	{
		let value = data[key];
		if (value === undefined || value === null)
			continue;

		dataArr.push(key + "=" + encodeURIComponent(value));
	}

	let dataStr = "";
	if (dataArr.length > 0)
		dataStr = dataArr.join("&");

	const PARAMS_PREFIX = "?";
	if (dataStr !== "")
		dataStr = PARAMS_PREFIX + dataStr;

	return dataStr;
}


/**
 * Connects to the Axel server to get the license key
 * @param {*} productName name of the product to activate
 * @param {*} hardwareId hardware id of the product to activate
 * @param {*} productKey the purchased product key
 * @param {*} callbackFunc callback function that returns the license key (or an error)
 * @memberof LLWebServer
 * @instance
 */
function GetLicense(productName, hardwareId, productKey, callbackFunc)
{
	if (!hardwareId || !productKey || !productName)
		return;

	let data = {};
	data['hwi'] = hardwareId;
	data['pKey'] = productKey;
	data['pro'] = productName;

	const URL = "https://www.axelsw.it/reg/llexeckey.php";

	let dataStr = getAJAXString(data);

	let getUrl = URL + dataStr;

	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = 
	function()
		{
			if (this.readyState == XHR_READY_STATE.DONE) {
				if(this.status == HTTP_STATUS.OK)
					callbackFunc(xhr.responseText);
				else
					callbackFunc(null);
			}
		};

	xhr.open("GET", getUrl, true);
	xhr.setRequestHeader('X-REGLIC', 'pingpong');
	try
	{
		xhr.send();
	}
	catch (ex)
	{
		callbackFunc(null);
	}
}

/**
 * Utility function to parse a truthy or falsy value or a boolean string
 * @param {string|number|boolean} s value to parse
 * @returns {boolean} Corresponding boolean value
 * @memberof LLWebServer
 * @instance
 */
function ParseBoolean(s)
{
	if (s === "false" || s === "0" || s === "FALSE")
		return false;
	else if (s === "true" || s === "1" || s === "TRUE")
		return true;
	else if (s != '' && !isNaN(parseInt(s)) && parseInt(s) != 0)
		return true;
	else
		return false;
}

/**
 * Checks if the current device is mobile or tablet
 * https://stackoverflow.com/a/36933436
 */
function isDeviceMobileOrTablet()
{
	return (/Android|webOS|iPhone|iPad/i.test(navigator.userAgent));
}

/*
 * JavaScript printf/sprintf functions.
 *
 * This code is unrestricted: you are free to use it however you like.
 * 
 * The functions should work as expected, performing left or right alignment,
 * truncating strings, outputting numbers with a required precision etc.
 *
 * For complex cases, these functions follow the Perl implementations of
 * (s)printf, allowing arguments to be passed out-of-order, and to set the
 * precision or length of the output based on arguments instead of fixed
 * numbers.
 *
 * See http://perldoc.perl.org/functions/sprintf.html for more information.
 *
 * Implemented:
 * - zero and space-padding
 * - right and left-alignment,
 * - base X prefix (binary, octal and hex)
 * - positive number prefix
 * - (minimum) width
 * - precision / truncation / maximum width
 * - out of order arguments
 *
 * Not implemented (yet):
 * - vector flag
 * - size (bytes, words, long-words etc.)
 * 
 * Will not implement:
 * - %n or %p (no pass-by-reference in JavaScript)
 *
 * @version 2007.04.27
 * @author Ash Searle
 */
/**
 * Utility function print a formatted string, like C library
 * @param {string} format Format string
 * @param {string} value1 Format value
 * @param {string} valueN Format value
 * @returns {string} Formatted string
 * @memberof LLWebServer
 * @instance
 */
function sprintf() 
{
	function pad(str, len, chr, leftJustify)
	{
		var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
		return leftJustify ? str + padding : padding + str;
	}

    function justify(value, prefix, leftJustify, minWidth, zeroPad)
	{
		var diff = minWidth - value.length;
		if (diff > 0) 
		{
			if (leftJustify || !zeroPad)
				value = pad(value, minWidth, ' ', leftJustify);
			else
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
		}
		return value;
    }

    function formatBaseX(value, base, prefix, leftJustify, minWidth, precision, zeroPad)
	{
		// Note: casts negative numbers to positive ones
		var number = value >>> 0;
		prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
    }

    function formatString(value, leftJustify, minWidth, precision, zeroPad)
	{
		if (precision != null)
			value = value.slice(0, precision);
		return justify(value, '', leftJustify, minWidth, zeroPad);
    }

    var a = arguments, i = 0, format = a[i++];
	
    return format.replace(sprintf.regex, function(substring, valueIndex, flags, minWidth, _, precision, type) {
	    if (substring == '%%') return '%';

	    // parse flags
	    var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false;
		
	    for (var j = 0; flags && j < flags.length; j++)
			switch (flags.charAt(j))
			{
				case ' ': positivePrefix = ' '; break;
				case '+': positivePrefix = '+'; break;
				case '-': leftJustify = true; break;
				case '0': zeroPad = true; break;
				case '#': prefixBaseX = true; break;
			}

	    // parameters may be null, undefined, empty-string or real valued
	    // we want to ignore null, undefined and empty-string values

	    if (!minWidth)
			minWidth = 0;
	    else if (minWidth == '*')
			minWidth = +a[i++];
	    else if (minWidth.charAt(0) == '*')
			minWidth = +a[minWidth.slice(1, -1)];
	    else
			minWidth = +minWidth;

	    // Note: undocumented perl feature:
	    if (minWidth < 0)
		{
			minWidth = -minWidth;
			leftJustify = true;
	    }

	    if (!isFinite(minWidth))
			throw new Error('sprintf: (minimum-)width must be finite');

	    if (!precision)
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : void(0);
	    else if (precision == '*')
			precision = +a[i++];
	    else if (precision.charAt(0) == '*')
			precision = +a[precision.slice(1, -1)];
	    else
			precision = +precision;

	    // grab value using valueIndex if required?
	    var value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

	    switch (type)
		{
		case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad);
		case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
		case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
		case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'i':
		case 'd': 
			{
				var number = parseInt(+value);
				var prefix = number < 0 ? '-' : positivePrefix;
				value = prefix + pad(String(Math.abs(number)), precision, '0', false);
				return justify(value, prefix, leftJustify, minWidth, zeroPad);
			}
		case 'e':
		case 'E':
		case 'f':
		case 'F':
		case 'g':
		case 'G':
			{
				var number = +value;
				var prefix = number < 0 ? '-' : positivePrefix;
				var method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
				var textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
				
				if (precision != undefined)
					value = prefix + Math.abs(number)[method](precision);
				else
					// l'implementazione della toPrecision() di Microsoft non accetta la precision undefined, per cui omette il parametro
					value = prefix + Math.abs(number)[method]();
					
				return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
			}
		default: return substring;
	    }
	});
}
sprintf.regex = /%%|%(\d+\$)?([-+#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;


// ---------- metodi pubblici
return {
	GetSymValues:			GetSymValues,
	SetSymValues:			SetSymValues,
	GetParValues:			GetParValues,
	SetParValues:			SetParValues,
	UpdateControls:			UpdateControls,
	AutoRefreshStart:		AutoRefreshStart,
	AutoRefreshStop:		AutoRefreshStop,
	GetParList:				GetParList,
	GetMenuList:			GetMenuList,
	GetSymList:				GetSymList,
	ParseBoolean:			ParseBoolean,
	sprintf:				sprintf,
	GetLicenseStatus:		GetLicenseStatus,
	GetRuntimeStatus:		GetRuntimeStatus,
	RegisterLicense:		RegisterLicense,
	GetProductList:			GetProductList,
	GetSystemLog:			GetSystemLog,
	RestartPLC:				RestartPLC,
	StopPLC:				StopPLC,
	StartPLC:				StartPLC,
	GetLicense:				GetLicense,
	ShutdownRuntime:		ShutdownRuntime,
	CheckSessionIsValid:	CheckSessionIsValid,
	Login:					Login,
	Logout:					Logout,
	ChangeUserPassword:		ChangeUserPassword
};

}) ();

//Code for progress bar operation
function init() {
	const elements = document.getElementsByClassName('progress-input');
	for (let i = 0; i < elements.length; i++) {
	  setInterval(() => updateValues(elements[i].id), 1000);
	}
  }

  
  function updateProgressBar(value, min, max, progressBarMinId, progressBarValueId) {
	const percentage = (value - min) / (max - min) * 100;
	const progressBarMin = document.getElementById(progressBarMinId);
	const progressBarValue = document.getElementById(progressBarValueId);
	progressBarMin.style.height = '0%';
	progressBarValue.style.height = percentage + '%';
	if (percentage === 100) {
	  progressBarMin.style.backgroundColor = '#4caf50';
	  progressBarValue.style.backgroundColor = '#4caf50';
	} else {
	  progressBarMin.style.backgroundColor = '#ccc';
	  progressBarValue.style.backgroundColor = '#4caf50';
	}   
}
  
function updateValues(inputId) {
	const input = document.getElementById(inputId);
	const progressBarMinId = 'progressBarMin_' + inputId;
	const progressBarValueId = 'progressBarValue_' + inputId;
	const progressBarMin = document.getElementById(progressBarMinId);
	const progressBarValue = document.getElementById(progressBarValueId);

	const value = parseInt(input.value);
	const min = parseInt(input.min);
	const max = parseInt(input.max);

	updateProgressBar(value, min, max, progressBarMinId, progressBarValueId);
}

//Code for filter alarms to work
document.addEventListener('DOMContentLoaded', () => {
const filterBtn = document.getElementById('filter-btn');
const listItems = document.querySelectorAll('#list li');
let isFiltered = false;

filterBtn.addEventListener('click', () => {
  isFiltered = !isFiltered;
  listItems.forEach((item) => {
	const textInputs = item.querySelectorAll('input[type="text"]');
	const alarmStatusInput = item.querySelector('input[name="alarmStatus"]');
	let isVisible = false;

	// Check if any text input is equal to "true"
	textInputs.forEach((textInput) => {
	  if (textInput.value.trim().toLowerCase() === 'true') {
		isVisible = true;
	  }
	});

	// Check if the alarmStatus input value is "active"
	if (alarmStatusInput && alarmStatusInput.value === 'active') {
	  isVisible = true;
	}

	item.style.display = isFiltered ? (isVisible ? 'list-item' : 'none') : 'list-item';
  });
});
});

//Code for filter alarms to work
document.addEventListener('DOMContentLoaded', () => {
const input = document.getElementById('nome-filtro');
const listItems = document.getElementsByClassName('list-item');

// Listen for input event
input.addEventListener('input', () => {
  const inputValue = input.value.toLowerCase();

  // Iterate through list items
  for (let i = 0; i < listItems.length; i++) {
	const listItem = listItems[i];
	const filterElement = listItem.getElementsByClassName('filter')[0];
	const filterText = filterElement.innerText.toLowerCase();

	// Show or hide list item based on filter
	if (filterText.includes(inputValue)) {
	  listItem.style.display = 'list-item';
	} else {
	  listItem.style.display = 'none';
	}
  }
});
});

// alarm filter 
document.addEventListener('DOMContentLoaded', () => {
// Get the list element
const list = document.getElementById('list');

// Execute the updateAlarmStatus function for each list item
const listItems = list.getElementsByTagName('li');
for (let i = 0; i < listItems.length; i++) {
  updateAlarmStatus(listItems[i]);
}

// Execute the updateAlarmStatus function whenever an image is loaded
const images = document.querySelectorAll('img[data-llweb-img]');
images.forEach((img) => {
  img.onload = () => {
	const listItem = img.closest('li');
	if (listItem) {
	  updateAlarmStatus(listItem);
	}
  };
});

// Define the updateAlarmStatus function
function updateAlarmStatus(listItem) {
  const alarmStatusInput = listItem.querySelector('input[name="alarmStatus"]');
  const imgElement = listItem.querySelector('img[data-llweb-img]');

  if (imgElement) {
	const src = imgElement.src;

	if (src.includes('inactive.png')) {
	  alarmStatusInput.value = 'inactive';
	} else if (src.includes('active.png')) {
	  alarmStatusInput.value = 'active';
	} else if (src.includes('resettable.png')) {
	  alarmStatusInput.value = 'resettable';
	}
  }
}

// Call the updateAlarmStatus function initially
updateAlarmStatus(listItems[0]);
});
