<script lang="ts">
  import interact from "interactjs"
  import { onMount } from "svelte"
  import "twind/shim"
  import Widget from "./lib/Widget.svelte"

  const { api } = window as any

  let editMode = false
  let widgetsData: Record<
    string,
    {
      w: number
      h: number
      x: number
      y: number
      fw?: number
      fh?: number
      url: string
    }
  > = {}

  api.recieve("debug-mode", (args: [boolean]) => {
    editMode = args[0]
    console.log({ editMode })
  })

  onMount(() => {
    restoreWidgetsData()

    interact(".resizable").resizable({
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

    interact(".draggable").draggable({
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
            `kind: ${device.kind}: ${device.label} id=${device.deviceId}`
          )
        )
      )
      .catch((err) => console.log(err))

    navigator.getUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSourceId:
              "fd937501fe2a627073aa210396fa3b691508fb72b7d8fb9233b5e2688fb6f4cf",
          },
        },
      },
      (localMediaStream) => {
        var video = document.querySelector("video")
        video.srcObject = localMediaStream
        video.autoplay = true
      },
      (error) => console.log(error)
    )
  })

  function restoreWidgetsData() {
    widgetsData = JSON.parse(localStorage.getItem("widgets") || "{}")
  }

  function updateWidgetsData({ id, x, y, w, h, fw, fh, url }: any) {
    const localStorageKey = "widgets"
    const widgetsData = JSON.parse(
      localStorage.getItem(localStorageKey) || "{}"
    )

    widgetsData[id] ||= {}

    if (x) {
      widgetsData[id].x = x
    }
    if (y) {
      widgetsData[id].y = y
    }
    if (w) {
      widgetsData[id].w = w
    }
    if (h) {
      widgetsData[id].h = h
    }
    if (fw) {
      widgetsData[id].fw = fw
    }
    if (fh) {
      widgetsData[id].fh = fh
    }
    if (url) {
      widgetsData[id].url = url
    }

    localStorage.setItem(localStorageKey, JSON.stringify(widgetsData))
  }
</script>

<main class="w-full h-screen">
  {#if editMode}
    <h1 class="w-[100px] bg-green-400 fixed">Edit Mode ON</h1>
  {/if}
  <!--
  <div id="widget-5" class="w-[600px] h-[600px] fixed overflow-hidden">
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 100; position: absolute;"
    />
    {#if editMode}
      <div
        style="background-color: rgba(0, 100, 0, 1); width: 100%; height: 100%;
        z-index: -1; position: absolute;"
      />
    {/if}
    <video id="video" height="100%" width="100%" autoplay />
  </div> -->

  {#each Object.entries(widgetsData) as [idx, data] (idx)}
    <!-- <p class="bg-white">{id} -> {JSON.stringify(data)}</p> -->
    <Widget
      {idx}
      x={data.x}
      y={data.y}
      widgetWidth={data.w}
      widgetHeight={data.h}
      iframeWidth={data.fw}
      iframeHeight={data.fh}
      url={data.url}
      onFrameChange={(width, height) => {
        console.log("onFrameChange", { width, height })
        updateWidgetsData({ id: idx, fw: width, fh: height })
      }}
      onPropsChange={(opts) => {
        if (opts.url) {
          updateWidgetsData({id: idx, url: opts.url})
        }
      }}
      {editMode}
    />
  {/each}
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .zoom {
    transform: scale(1.5);
    transform-origin: 0 0;
    -webkit-transform: scale(1.5);
    -webkit-transform-origin: 0 0;
  }
</style>
