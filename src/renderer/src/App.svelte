<script lang="ts">
  import { draggable } from 'svelte-drag';
</script>

<main style="width: 100%; height: 100vh;">
  <h1 use:draggable style="color: white;">Hello</h1>
  <div style="display:inline-block; padding: 50px" use:draggable><iframe style="display: fixed;" src="https://streamkit.discord.com/overlay/chat/826099393694400574/848810430683938876?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0" width="580px" height="215px" frameborder="0"></iframe></div>
  <div style="display:inline-block; padding: 50px" use:draggable><iframe style="display: fixed;" src="https://ko-fi.com/streamalerts/overlay/sa_6cd116dc-8c8b-4b44-a7cd-5e2371d32447" width="400px" height="400px" frameborder="0"></iframe></div>
  <div style="display:inline-block; padding: 50px" use:draggable><iframe style="display: fixed;" src="https://streamkit.discord.com/overlay/voice/826099393694400574/826106139859091536?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0" width="400px" height="400px" frameborder="0"></iframe></div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

</style>
