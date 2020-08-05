<template>
	<section id="app" class="text-center p-3">
		<h3 class="my-4" style="font-size: 4rem">
			<font-awesome-icon icon="calculator" class="text-info"/> tcalc
		</h3>
		<tcalc/>
	</section>
</template>

<script>
import tcalc from './components/tcalc.vue'

export default {
	name: 'App',
	components: {
		tcalc
	}
}
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
</style>
