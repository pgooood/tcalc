<template>
	<b-input-group>
		<b-form-input @focus="onFocus" @input="inputValue" @mousedown="onFocus" @keydown="onKeydown" ref="inputHours" type="number" :disabled="disabled" v-model="value.hours" placeholder="hours" size="lg"/>
		<b-form-input @focus="onFocus" @input="inputValue" @mousedown="onFocus" @keydown="onKeydown" ref="inputMins" type="number" :disabled="disabled" v-model="value.mins" placeholder="minutes" size="lg"/>
		<b-form-input @focus="onFocus" @input="inputValue" @mousedown="onFocus" @keydown="onKeydown" ref="inputSecs" type="number" :disabled="disabled" v-model="value.secs" placeholder="seconds" size="lg"/>
	</b-input-group>
</template>

<script>
import { caretPos, calcTime } from '../utils.js'

export default {
	name: 'dividualInput'
	,props: {
		value: Object
		,disabled: Boolean
		,commandKeys: Array
	}
	,model: {
		prop: 'value'
		,event: 'input'
	}
	,data(){
		return {
			activeElement: null
		}
	}
	,watch: {
		value: {
			deep: true,
			handler(){}
		}
	}
	,methods: {
		onFocus(event){
			if(this.activeElement !== event.target){
				this.activeElement = event.target
				this.activeElement.focus()
				this.$emit('focus',event)
			}
		}
		,onKeydown(event){
			if(this.commandKeys.includes(event.key)){
				this.$emit('command',event.key)
				event.preventDefault()
			}
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
			let cTime = new calcTime(this.value.hours,this.value.mins,this.value.secs)
			switch(this.inputElement()){
				case this.$refs.inputHours.$el:
					cTime.hours = value
					break
				case this.$refs.inputMins.$el:
					cTime.mins = value
					break
				case this.$refs.inputSecs.$el:
					cTime.secs = value
					break
			}
			this.$emit('input',cTime)
		}
		,inputElement(){
			return this.activeElement || this.$refs.inputHours.$el;
		}
		,inputCaretPos: function(value = null){
			return caretPos(this.inputElement(),value)
		}
		,focus(){
			this.inputElement().focus()
		}
	}
}
</script>