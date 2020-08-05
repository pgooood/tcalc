<template>
	<input type="number" ref="input" class="form-control form-control-lg" placeholder="0"
		@focus="$emit('focus',$event)"
		@input="$emit('input',inputElement().value)"
		@keydown="onKeydown"
		:disabled="disabled">
</template>

<script>
import { caretPos, calcTime } from '../utils.js'

export default {
	name: 'numberInput'
	,props: {
		value: String
		,disabled: Boolean
		,commandKeys: Array
	}
	,model: {
		prop: 'value'
		,event: 'input'
	}
	,mounted(){
		if(this.value !== undefined)
			this.inputElement().value = this.value
	}
	,watch:{
		value(values){
			this.inputElement().value = this.value
		}
	}
	,methods: {
		inputElement(){
			return this.$refs.input
		}
		,focus(){
			this.inputElement().focus()
		}
		,inputCaretPos: function(value = null){
			return caretPos(this.inputElement(),value)
		}
		,printChar(inputKey){
			let value = this.inputValue()
				,cPos = this.inputCaretPos()
			this.inputValue((cPos ? value.substr(0,cPos) : '')
				+ inputKey
				+ (cPos < value.length ? value.substr(cPos) : ''))
			this.inputCaretPos(cPos + 1)
		}
		,inputValue: function(value = null){
			var inputElement = this.inputElement()
			if(value === null)
				return inputElement ? new String(inputElement.value) : ''
			if(inputElement && inputElement.value !== value){
				inputElement.value = value
				this.$emit('input',value)
			}
		}
		,onKeydown(event){
			switch(event.key){
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