<script lang="ts">
  import interact from 'interactjs'
  import { onMount } from 'svelte'
  import 'twind/shim'
  import Widget from './lib/Widget.svelte'

  const { api } = window as any

  let editMode = false

  api.recieve('debug-mode', (args: [boolean]) => {
    editMode = args[0]
    console.log({ editMode })
  })

  onMount(() => {
    restoreWidgetsData()

    interact('.resizable').resizable({
      edges: { top: true, left: true, bottom: true, right: true },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.getBoundingClientRect()

          x = parseFloat(x) + event.deltaRect.left
          y = parseFloat(y) + event.deltaRect.top

          Object.assign(event.target.parentNode.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          })

          updateWidgetsData({
            id: event.target.parentNode.id,
            w: event.rect.width,
            h: event.rect.height,
            x,
            y,
          })
        },
      },
    })

    interact('.draggable').draggable({
      listeners: {
        start(event) {
          console.log(event.type, event.target, event.target.parentNode)
        },
        move(event) {
          let { x, y } = event.target.getBoundingClientRect()

          x = parseFloat(x) + event.dx
          y = parseFloat(y) + event.dy

          event.target.parentNode.style.transform = `translate(${x}px, ${y}px)`

          updateWidgetsData({
            id: event.target.parentNode.id,
            w: event.rect.width,
            h: event.rect.height,
            x,
            y,
          })
        },
      },
    })

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        devices.forEach((device) =>
          console.log(
            `kind: ${device.kind}: ${device.label} id=${device.deviceId}`,
          ),
        ),
      )
      .catch((err) => console.log(err))

    navigator.getUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSourceId:
              'fd937501fe2a627073aa210396fa3b691508fb72b7d8fb9233b5e2688fb6f4cf',
          },
        },
      },
      (localMediaStream) => {
        var video = document.querySelector('video')
        video.srcObject = localMediaStream
        video.autoplay = true
      },
      (error) => console.log(error),
    )
  })

  function restoreWidgetsData() {
    let widgetsData = JSON.parse(localStorage.getItem('widgets') || '{}')

    Object.entries(widgetsData).forEach(([id, data]) => {
      if (Object.keys(data).length == 0) {
        return
      }

      const widget = document.getElementById(id)

      const { x, y, w, h } = data as any

      if (widget?.style) {
        Object.assign(widget.style, {
          width: `${w}px`,
          height: `${h}px`,
          transform: `translate(${x}px, ${y}px)`,
        })
      }
    })
  }

  function updateWidgetsData({ id, x, y, w, h }) {
    const localStorageKey = 'widgets'
    const widgetsData = JSON.parse(
      localStorage.getItem(localStorageKey) || '{}',
    )

    widgetsData[id] = {
      x,
      y,
      w,
      h,
    }

    localStorage.setItem(localStorageKey, JSON.stringify(widgetsData))
  }
</script>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .zoom {
    transform: scale(1.5);
    transform-origin: 0 0;
    -webkit-transform: scale(1.5);
    -webkit-transform-origin: 0 0;
  }
</style>

<main class="w-full h-screen">
  {#if editMode}
    <h1 class="w-[100px] bg-green-400 fixed">Edit Mode ON</h1>
  {/if}
  <div id="widget-1" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: absolute;" />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;" />
    {/if}
    <iframe
      title="frame_1"
      class="zoom"
      style="position: fixed; top: 0; z-index: 0;"
      src="https://streamkit.discord.com/overlay/chat/826099393694400574/848810430683938876?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0"
      width="580px"
      height="215px"
      frameborder="0" />
  </div>
  <div id="widget-2" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: fixed;" />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;" />
    {/if}
    <iframe
      title="frame_2"
      style="display: fixed;"
      src="https://ko-fi.com/streamalerts/overlay/sa_6cd116dc-8c8b-4b44-a7cd-5e2371d32447"
      width="400px"
      height="400px"
      frameborder="0" />
  </div>
  <div id="widget-3" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: absolute;" />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;" />
    {/if}
    <iframe
      title="frame_3"
      style="display: fixed;"
      src="https://streamkit.discord.com/overlay/voice/826099393694400574/826106139859091536?icon=true&online=true&logo=white&text_color=%23ffffff&text_size=14&text_outline_color=%23000000&text_outline_size=0&text_shadow_color=%23000000&text_shadow_size=0&bg_color=%231e2124&bg_opacity=0.95&bg_shadow_color=%23000000&bg_shadow_size=25&invite_code=9arm&limit_speaking=false&small_avatars=false&hide_names=false&fade_chat=0"
      width="400px"
      height="400px"
      frameborder="0" />
  </div>
  <div id="widget-4" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: absolute;" />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;" />
    {/if}
    <iframe
      title="frame_4"
      style="display: fixed;"
      src="https://streamelements.com/overlay/xxxxxxx"
      width="600px"
      height="300px"
      frameborder="0" />
  </div>
  <div id="widget-5" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: absolute;" />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;" />
    {/if}
    <video id="video" height="100%" width="100%" autoplay />
  </div>
  <Widget idx={1} {editMode} url="https://google.com" />
</main>
