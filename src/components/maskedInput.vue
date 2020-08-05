<template>
	<input type="text" ref="input" class="form-control form-control-lg"
		@keypress="onKeypress"
		@keydown="onKeydown"
		@focus="onFocus"
		:placeholder="mask"
		:disabled="disabled">
</template>

<script>
import { caretPos,  calcTime, caretSelectionRange } from '../utils.js'

export default {
	name: 'maskedInput'
	,props: {
		value: Object
		,disabled: Boolean
		,commandKeys: Array
	}
	,model: {
		prop: 'value'
		,event: 'input'
	}
	,data: function(){
		return {
			mask: '00:00:00'
			,arSeparatorPos: [2,5]
			,event: null
		};
	}
	,mounted: function(){
		if(this.value !== undefined)
			this.inputElement().value = this.value.toRawString()
	}
	,watch: {
		value: {
			deep: true,
			handler(){
				if(this.value !== undefined)
					this.inputElement().value = this.value.toRawString()
			}
		}
	}
	,methods: {
		inputElement:function(){
			return this.event ? this.event.target : this.$refs.input
		}
		,focus(){
			this.inputElement().focus()
		}
		/**
		 * Set or get the value from input element
		 */
		,inputValue: function(value = null){
			var inputElement = this.inputElement()
			if(value === null){
				value = inputElement ? new String(inputElement.value) : ''
				if(value.length < this.mask.length)
					value+= this.mask.substr(value.length)
				return value
			}
			if(inputElement && inputElement.value !== value){
				inputElement.value = value
				this.$emit('input',calcTime.parse(value))
			}
		}
		,inputCaretPos: function(value = null){
			return caretPos(this.inputElement(),value)
		}
		,inputRange: function(){
			return caretSelectionRange(this.inputElement())
		}
		,printChar(inputKey){
			let range = this.inputRange()
			if(range)
				this.backspaceChar()
			let value = this.inputValue()
				,cPos = this.inputCaretPos()
			if(this.arSeparatorPos.includes(cPos))
				cPos++
			if(cPos < this.mask.length){
				this.inputValue((cPos ? value.substr(0,cPos) : '')
					+ inputKey
					+ (cPos < this.mask.length ? value.substr(cPos + 1) : ''))
				this.inputCaretPos(cPos + 1)
			}
		}
		,backspaceChar(){
			let value = this.inputValue()
				,range = this.inputRange()
				,cPos
			if(range){
				this.inputValue(this.clearRange(value,range))
				this.inputCaretPos(range.start)
			}else if((cPos = this.inputCaretPos()) > 0){
				this.inputValue((cPos ? value.substr(0,cPos - 1) : '')
					+ this.mask.substr(cPos - 1,1)
					+ (cPos <= this.mask.length ? value.substr(cPos) : ''))
				this.inputCaretPos(cPos - 1)
			}
		}
		,deleteChar(){
			let value = this.inputValue()
				,range = this.inputRange()
				,cPos = this.inputCaretPos()
			if(range){
				this.inputValue(this.clearRange(value,range))
				this.inputCaretPos(range.pos)
			}else{
				if(this.arSeparatorPos.includes(cPos))
					cPos++
				var startPos = 0 // start of a text section
					,endPos = value.length // end of a text section
					,startValue = '' // text block before a text section
					,endValue = '' // text block after a text section
				// determine text section range
				for(let i = 0; i < this.arSeparatorPos.length; i++)
					if(cPos < this.arSeparatorPos[i]){
						endPos = this.arSeparatorPos[i]
						endValue = value.substr(endPos)
						break
					}else{
						startPos = this.arSeparatorPos[i] + 1
						startValue = value.substr(0,startPos)
					}
				this.inputValue(startValue
					+ (cPos - startPos > 0 ? value.substring(startPos,cPos) : '')
					+ (endPos - cPos + 1 > 0 ? value.substring(cPos + 1,endPos) : '')
					+ this.mask.substr(cPos,1) // replace deleted char with the one from the mask
					+ endValue)
				this.inputCaretPos(cPos)
			}
		}
		,printSeparator(){
			let cPos = this.inputCaretPos()
			for(let i = 0; i < this.arSeparatorPos.length; i++)
				if(cPos <= this.arSeparatorPos[i]){
					this.inputValue(this.inputValue())
					this.inputCaretPos(this.arSeparatorPos[i] + 1)
					break
				}
		}
		,clearRange(value,range){
			return (range.start ? value.substr(0,range.start) : '')
				+ this.mask.substring(range.start,range.end)
				+ (range.end <= this.mask.length ? value.substr(range.end) : '')
		}
		,onFocus(event){
			this.$emit('focus',event)
		}
		,onKeypress(event){
			this.event = event
			switch(event.key){
				case '0': case '1': case '2': case '3': case '4':
				case '5': case '6': case '7': case '8': case '9':
					this.printChar(event.key)
					break
				case ':': case ',': case '.': case ';':
					this.printSeparator()
					break
			}
			event.preventDefault()
		}
		,onKeydown(event){
			this.event = event
			switch(event.key){
				case 'Backspace':
					this.backspaceChar()
					event.preventDefault()
					break
				case 'Delete':
					this.deleteChar()
					event.preventDefault()
					break
				case 'PageUp':
				case 'PageDown':
					this.$emit('switchmode',event.key)
					break
				default:
					if(this.commandKeys.includes(event.key)){
						this.$emit('command',event.key)
						event.preventDefault()
					}
			}
		}
	}
}
</script>