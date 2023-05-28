<template>
    <div>
      <vue-c3 :handler="handler"></vue-c3>
    </div>
</template>
  
<script>
    import Vue from 'vue'
    import VueC3 from 'vue-c3'

    export default {
        components: {
            VueC3
        },

        data () {
            return {
                handler: new Vue()
            }
        },

        mounted () {
            const options = {
                data: {
                columns: [
                    ['data1', 2, 4, 1, 5, 2, 1],
                    ['data2', 7, 2, 4, 6, 10, 1]
                ]
            }}

            this.handler.$emit('init', options)
            
        }
    }
</script>