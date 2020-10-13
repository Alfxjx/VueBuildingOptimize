<template>
	<div class="hello">
		{{ hello }}
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
	props: {
		hello: String,
	},
})
export default class Hello extends Vue {}
</script>

<style lang="scss"> 
$font-color: red;
.hello {
	color: $font-color;
}
</style>
