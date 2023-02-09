<template>
  <div id="nav">
    <router-view/>
  </div>
  
</template>

<script>
    export default {
      head: {
        link: [
              {
                  rel: "icon",
                  href: require("@/assets/logos/logo1.png")
              },
            ]
        }
    }
</script>