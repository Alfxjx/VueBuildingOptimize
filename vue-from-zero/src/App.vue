<template>
	<div id="app">
		<Hello :hello="msg" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Hello from "./components/Hello.vue";

@Component({
	components: { Hello },
})
export default class App extends Vue {
	msg = "hello world";
}
</script>

<style lang="scss">
// @import './app.scss';
$font-big:24px;
#app{
	font-size: $font-big;
}
</style>
