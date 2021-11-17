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
      deviceId?: string
      type?: string
      resizeMode?: boolean
    }
  > = {}
  let videoInputDevices: MediaDeviceInfo[] = []
  let selecteVideoDevice: MediaDeviceInfo

  api.recieve("debug-mode", (args: [boolean]) => {
    editMode = args[0]
  })

  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      videoInputDevices = devices.filter(
        (device) => device.kind === "videoinput"
      )
      console.log({ videoInputDevices })
    })
    .catch((err) => console.log(err))

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
  })

  function restoreWidgetsData() {
    widgetsData = JSON.parse(localStorage.getItem("widgets") || "{}")
  }

  function updateWidgetsData({ id, x, y, w, h, fw, fh, url, type }: any) {
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
    if (type) {
      widgetsData[id].type = type
    }

    localStorage.setItem(localStorageKey, JSON.stringify(widgetsData))
  }

  function addNewWidget(overrides = {}) {
    const id = Math.random().toString(36).substring(2)

    widgetsData = {
      ...widgetsData,
      ...{
        [id]: {
          x: 100,
          y: 100,
          w: 600,
          h: 400,
          fw: 400,
          fh: 300,
          resizeMode: true,
          url: "https://google.com",
          type: "url",
          ...overrides,
        },
      },
    }

    localStorage.setItem("widgets", JSON.stringify(widgetsData))
  }

  function addNewWebcamWidget() {
    addNewWidget({
      type: "webcam",
      deviceId: selecteVideoDevice.deviceId,
    })
  }

  function onRemoveWidget(id) {
    delete widgetsData[id]

    localStorage.setItem("widgets", JSON.stringify(widgetsData))

    // Trigger Svelte reactive statements
    widgetsData = widgetsData
  }
</script>

<main class="w-full h-screen">
  {#if editMode}
    <div class="fixed top-10 left-10 w-full h-full text-lg">
      <h1 class="w-[200px] bg-green-400 p-4 text-3xl">Edit Mode</h1>
      <p class="mt-4">
        <button on:click={addNewWidget} class="bg-red-300 px-2 py-1 rounded"
          >Add new widget</button
        >
      </p>
      <p class="mt-4">
        <select class="px-2 py-2 rounded" bind:value={selecteVideoDevice}>
          {#each videoInputDevices as videoInputDevice}
            <option value={videoInputDevice}>
              {videoInputDevice.label}
            </option>
          {/each}
        </select>

        <button
          on:click={addNewWebcamWidget}
          class="bg-red-300 px-2 py-1 rounded">Add new webcam</button
        >
      </p>
    </div>
  {/if}

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
      type={data.type}
      deviceId={data.deviceId}
      onFrameChange={(width, height) => {
        updateWidgetsData({ id: idx, fw: width, fh: height })
      }}
      onPropsChange={(opts) => {
        if (opts.url) {
          updateWidgetsData({ id: idx, url: opts.url })
        }
      }}
      resizeMode={data.resizeMode}
      {onRemoveWidget}
      {editMode}
    />
  {/each}
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  /* .zoom {
    transform: scale(1.5);
    transform-origin: 0 0;
    -webkit-transform: scale(1.5);
    -webkit-transform-origin: 0 0;
  } */
</style>
