<script lang="ts">
  import interact from "interactjs"
  import { onMount } from 'svelte';

  onMount(() => {
    interact('.resizable')
      .resizable({
        edges: { top: true, left: true, bottom: true, right: true },
        listeners: {
          move: function (event) {
            let { x, y } = event.target.dataset

            x = (parseFloat(x) || 0) + event.deltaRect.left
            y = (parseFloat(y) || 0) + event.deltaRect.top

            Object.assign(event.target.parentNode.style, {
              width: `${event.rect.width}px`,
              height: `${event.rect.height}px`,
              transform: `translate(${x}px, ${y}px)`
            })

            Object.assign(event.target.dataset, { x, y })
          }
        }

      })

    interact('.draggable').draggable({
      listeners: {
        start (event) {
          console.log(event.type, event.target, event.target.parentNode)
        },
        move (event) {
          let { x, y } = event.target.dataset

          x = (parseFloat(x) || 0) + event.dx
          y = (parseFloat(y) || 0) + event.dy

          event.target.parentNode.style.transform =
            `translate(${x}px, ${y}px)`

            Object.assign(event.target.dataset, { x, y })

        },
      }
})


  })
</script>

<main style="width: 100%; height: 100vh;">
  <div style="width: 600px; height: 600px; position: fixed; overflow: hidden;">
    <div class="draggable resizable" style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0); z-index: 100; position: absolute;"></div>
    <iframe title="frame_1" style="position: fixed; top: 0; z-index: 0" src="https://streamkit.discord.com/overlay/chat/826099393694400574/848810430683938876?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0" width="580px" height="215px" frameborder="0"></iframe>
  </div>
  <div style="width: 600px; height: 600px; position: fixed; overflow: hidden;">
    <div class="draggable resizable" style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0); z-index: 100; position: fixed;"></div>
    <iframe title="frame_2" style="display: fixed;" src="https://ko-fi.com/streamalerts/overlay/sa_6cd116dc-8c8b-4b44-a7cd-5e2371d32447" width="400px" height="400px" frameborder="0"></iframe>
  </div>
  <div style="width: 600px; height: 600px; position: fixed; overflow: hidden;">
    <div class="draggable resizable" style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0); z-index: 100; position: absolute;"></div>
    <iframe title="frame_3" style="display: fixed;" src="https://streamkit.discord.com/overlay/voice/826099393694400574/826106139859091536?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0" width="400px" height="400px" frameborder="0"></iframe>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

</style>
