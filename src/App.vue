<template>
	<div id="app" class="container">
		<header class="container my-4 text-center" style="font-size: 4rem">
			<font-awesome-icon icon="calculator" class="text-info"/> tcalc
		</header>
		<main class="text-center">
			<tcalc/>
		</main>
		<footer class="container text-muted my-4 text-center">
			<a href="https://pgood.space">pgood.space</a>
		</footer>
	</div>
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
//@import 'node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss';
//@import "node_modules/@fortawesome/fontawesome-free/scss/solid.scss"


</style>
