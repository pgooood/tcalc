/**
 * Returns or set a caret postion of focused input element
 */
function caretPos(oField,caretPos = null){
	if(document.activeElement !== oField)
		oField.focus();
	if(caretPos === null){
		if (oField.selectionStart || oField.selectionStart == '0')
			return oField.selectionDirection == 'backward'
				? oField.selectionStart : oField.selectionEnd
		return 0
	}
	if(oField.createTextRange){
		var range = oField.createTextRange()
		range.move('character',caretPos)
		range.select()
	}else{
		if(oField.selectionStart){
			oField.focus()
			oField.setSelectionRange(caretPos,caretPos)
		}else
			oField.focus()
	}
}

function caretSelectionRange(oField){
	if ((oField.selectionStart || oField.selectionStart == '0')
		&& oField.selectionStart != oField.selectionEnd
	){
		return {
			start: oField.selectionStart
			,end: oField.selectionEnd
			,pos: oField.selectionDirection == 'backward'
					? oField.selectionStart : oField.selectionEnd
		}
	}
}


class calcTime{
	_hours = null
	_mins = null
	_secs = null

	constructor(hours,mins,secs){
		this.init(hours,mins,secs)
	}
	init(hours,mins,secs){
		this.clear()
		if(hours !== undefined)
			this.hours = hours
		if(mins !== undefined)
			this.mins = mins
		if(secs !== undefined)
			this.secs = secs
	}
	get hours(){ return this._hours || 0 }
	set hours(v){
		if(isNaN(this._hours = parseInt(v)))
			this._hours = null;
	}
	get mins(){ return this._mins || 0 }
	set mins(v){
		if(isNaN(this._mins = parseInt(v)))
			this._mins = null;
	}
	get secs(){ return this._secs || 0 }
	set secs(v){
		if(isNaN(this._secs = parseInt(v)))
			this._secs = null;
	}
	get time(){ return this.secs + this.mins * 60 + this.hours * 3600 }
	set time(v){
		if(!isNaN(v = parseInt(v))){
			this.hours = Math.floor(v / 3600)
			this.mins = Math.floor((v % 3600) / 60)
			this.secs = v % 60
		}else
			this.clear()
	}
	isEmpty(){
		return this._hours === null
			&& this._mins === null
			&& this._secs === null
	}
	beLike(obCalcTime){
		this.hours = obCalcTime.hours
		this.mins = obCalcTime.mins
		this.secs = obCalcTime.secs
	}
	toString(){
		let v = this.time
		return this.isEmpty()
			? ''
			: new String(Math.floor(v / 3600)).padStart(2,'0')
				+':'+new String(Math.floor((v % 3600) / 60)).padStart(2,'0')
				+':'+new String(v % 60).padStart(2,'0')
	}
	toRawString(){
		return this.isEmpty()
			? ''
			: new String(this.hours).padStart(2,'0')
				+':'+new String(this.mins).padStart(2,'0')
				+':'+new String(this.secs).padStart(2,'0')
	}
	clear(){
		this.hours = this.mins = this.secs = null
	}
	static parse(strTime){
		var m = (new String(strTime)).match(/(\d+):(\d+):(\d+)/)
		if(m)
			return new calcTime(m[1],m[2],m[3])
	}
}


export {
	caretPos
	,calcTime
	,caretSelectionRange
}