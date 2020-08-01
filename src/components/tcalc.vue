<template>
	<b-card class="w-50 mx-auto">
		<b-form-group>
			<b-input-group>
				<masked-input v-model="maskedInputValue" ref="maskedInput" v-if="isTimeMode"
					@input="timeValue($event,'maskedInputValue')"
					@focus="focus($refs.maskedInput)"
					@command="push"
					@switchmode="onToggleInputMode"
					:command-keys="commandKeys"></masked-input>
				<number-input v-model="iInput" ref="numberInput" v-else
					@focus="focus($refs.numberInput)"
					@command="push"
					@switchmode="onToggleInputMode"
					:command-keys="commandKeys"></number-input>
				<b-input-group-append>
					<b-button variant="info" @click="onToggleInputMode">
						<span v-if="isTimeMode"><font-awesome-icon icon="clock"/> time</span>
						<span v-else>numbers</span>
					</b-button>
				</b-input-group-append>
			</b-input-group>
		</b-form-group>
		<b-form-group>
			<dividual-input v-model="dividualInputValue" ref="dividualInput"
				@input="timeValue($event,'dividualInputValue')"
				@focus="focus($refs.dividualInput)"
				@command="push"
				:command-keys="commandKeys"></dividual-input>
		</b-form-group>
		<b-row class="mb-4">
			<b-col>

			</b-col>
			<b-col>

			</b-col>
			<b-col>

			</b-col>
			<b-col>
				<b-button variant="info" class="w-100 tcalc-btn" @click="reset">AC</b-button>
			</b-col>
		</b-row>
		<b-row class="mb-4">
			<b-col>
				<!--b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('7')">7</b-button-->
				<button type="button" class="btn btn-outline-secondary w-100 tcalc-btn" @click="calcKeyPress('7')">7</button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('8')">8</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('9')">9</b-button>
			</b-col>
			<b-col>
				<b-button variant="info" class="w-100 tcalc-btn" @click="push('/')">÷</b-button>
			</b-col>
		</b-row>
		<b-row class="mb-4">
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('4')">4</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('5')">5</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('6')">6</b-button>
			</b-col>
			<b-col>
				<b-button variant="info" class="w-100 tcalc-btn" @click="push('*')">×</b-button>
			</b-col>
		</b-row>
		<b-row class="mb-4">
			<b-col>
				<b-button variant="outline-secondary" class="w-100" @click="calcKeyPress('1')">1</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100" @click="calcKeyPress('2')">2</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100" @click="calcKeyPress('3')">3</b-button>
			</b-col>
			<b-col>
				<b-button variant="info" class="w-100" @click="push('-')">−</b-button>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('0')">0</b-button>
			</b-col>
			<b-col>
				<b-button variant="outline-secondary" class="w-100 tcalc-btn" @click="calcKeyPress('.')">.</b-button>
			</b-col>
			<b-col>
				<b-button variant="info" class="w-100 tcalc-btn" @click="push('=')">=</b-button>
			</b-col>
			<b-col>
				<b-button variant="info" class="w-100 tcalc-btn" @click="push('+')">+</b-button>
			</b-col>
		</b-row>
		<!--
		<br>
		value: {{ inputValue }}<br>
		arStack: {{ arStack }}<br>
		-->
	</b-card>
</template>

<script>
import { caretPos, calcTime } from '../utils.js'
import maskedInput from './maskedInput.vue'
import dividualInput from './dividualInput.vue'
import numberInput from './numberInput.vue'

export default {
	name: 'tcalc'
	,components: {
		maskedInput
		,dividualInput
		,numberInput
	}
	,data: function(){
		return {
			obInput: new calcTime
			,maskedInputValue: new calcTime
			,dividualInputValue: new calcTime
			,iInput: ''
			,sLastKeyPressed: ''
			,sLastAction: ''
			,arStack: []
			,inputMode: 'time'
			,activeInput: null
			,commandKeys: ['+','-','/','*','=','Enter']
		};
	}
	,computed: {
		inputNumber(){
			let v = parseFloat(this.iInput);
			return isNaN(v) ? 0 : v;
		}
		,isTimeMode(){
			return this.inputMode == 'time'
		}
		,isNumberMode(){
			return this.inputMode == 'number'
		}
		,inputValue(){
			return this.isTimeMode ? this.obInput.time : this.inputNumber
		}
		,isInputValueEmpty(){
			return this.isTimeMode ? this.obInput.isEmpty() : this.iInput === ''
		}
	}
	,methods: {
		onToggleInputMode(){
			this.inputMode = this.isTimeMode ? 'number' : 'time';
			this.$nextTick(() => {
				this.activeInput = this.isTimeMode ? this.$refs.maskedInput : this.$refs.numberInput
				this.activeInput.focus()
			})
		}
		,timeValue(cTime = null,sourceModel = 'maskedInputValue'){
			if(cTime === null)
				return this.obInput
			this.obInput.beLike(cTime)
			this[sourceModel].beLike(cTime)
			/*
			switch(sourceModel){
				case 'maskedInputValue':
					this.dividualInputValue.clear()
					break
				case 'dividualInputValue':
					this.maskedInputValue.clear()
					break
			}
			*/
		}
		,focus(component){
			switch(component.$options._componentTag){
				case 'dividual-input':
					this.obInput.beLike(this.dividualInputValue)
					break
				case 'masked-input':
					this.obInput.beLike(this.maskedInputValue)
					break
			}
			this.activeInput = component
		}
		,calcKeyPress(key){
			(this.activeInput || this.$refs.maskedInput).printChar(key)
		}
		/**
		 * Adds calculation action into the stack
		 */
		,push(action){
			if('Enter' === action || '=' === action){
				// добавляем значение из поля ввода в стэк операций
				this.arStack.push({action: this.sLastAction,value: this.inputValue})
				// считаем результат, форматируем и сохраняем строку со временем в переменную]
				let result = this.calc()
				// сбрасываем стэк операций и введенные данные
				this.reset()
				// переключаем поле ввода в режим ввода времени
				this.inputMode = 'time'
				// устанавливаем в поле ввода рссчитанное значение
				this.obInput.time = result
				this.maskedInputValue.time = result
				this.dividualInputValue.time = result
				this.sLastAction = null
			}
			if('+-*/'.includes(action)){
				// индекс последней операции в массиве стека операций
				let lastStackIndex = this.arStack.length - 1;
				// если была нажата команда без ввовдв значения в поле ввода, значит заменяем последнюю команду на вновь введенную
				if(this.isInputValueEmpty)
					this.arStack[lastStackIndex].action = action
				else
					this.arStack.push({action: this.sLastAction,value: this.inputValue})
				this.clear()
				this.sLastAction = action
			}
		}
		,clear(){
			this.obInput.clear()
			this.maskedInputValue.clear()
			this.dividualInputValue.clear()
			this.iInput = ''
		}
		,reset(){
			this.clear()
			this.sLastAction = null
			this.arStack.length = 0
		}
		,calc(){
			let res,op
			for(let i = 0; i < this.arStack.length; i++){
				op = this.arStack[i]
				if(i) eval('res = res '+op.action+' op.value;')
				else res = op.value
			}
			return res
		}
	}
};
</script>