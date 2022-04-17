<script lang="ts">
  import { onDestroy, onMount } from "svelte"

  export let idx: string
  export let editMode: boolean
  export let url: string
  export let type: string
  export let deviceId: string
  export let widgetHeight: number = 500
  export let widgetWidth: number = 500
  export let iframeWidth: number = 400
  export let iframeHeight: number = 400
  export let x: number = 100
  export let y: number = 100
  export let resizeMode: boolean = false
  export let onFrameChange: (width: number, height: number) => void
  export let onPropsChange: (opts: any) => void
  export let onRemoveWidget: (id: string) => void

  const videoMode: boolean = type === "webcam"

  let urlInput: HTMLInputElement
  let frame
  let ro: ResizeObserver

  $: {
    onPropsChange({ url })
  }

  onMount(() => {
    ro = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect
        // console.log('Element:', entry.target)
        // console.log(`Element size: ${cr.width}px x ${cr.height}px`)
        // console.log(`Element padding: ${cr.top}px ; ${cr.left}px`)

        onFrameChange(cr.width, cr.height)
      }
    })

    ro.observe(frame)
  })

  onDestroy(() => {
    ro.disconnect()
  })

  $: if (videoMode) {
    navigator.getUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSourceId: deviceId,
          },
        },
      },
      (localMediaStream) => {
        frame.srcObject = localMediaStream
        frame.autoplay = true
      },
      (error) => console.log(error)
    )
  }
</script>

<div
  id={idx}
  class="fixed overflow-hidden"
  style="width: {widgetWidth}px; height: {widgetHeight}px; transform: translate({x}px,
  {y}px)"
>
  {#if resizeMode}
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 10; position: absolute;"
    />
  {/if}

  {#if editMode}
    <div
      class="bg-green-400"
      style="width: 100%; height: 100%; z-index: -1; position: absolute;"
    />
  {/if}

  {#if videoMode}
    <video height="100%" width="100%" autoplay bind:this={frame} />
  {:else}
    <iframe
      title="frame_1"
      class="zoom"
      style="resize: both; overflow: auto;"
      src={url}
      width="{iframeWidth}px"
      height="{iframeHeight}px"
      frameborder="0"
      bind:this={frame}
    />
  {/if}

  {#if editMode}
    <div class="z-20 absolute top-2 left-2">
      <button
        class="bg-red-400 px-2 py-1 rounded fixed"
        on:click={() => onRemoveWidget(idx)}
      >
        X
      </button>

      <div class="flex flex-col gap-2 mx-2 my-12">
        <div>
          <button
            class="bg-red-400 px-2 py-1 rounded"
            disabled={resizeMode}
            on:click={() => (resizeMode = !resizeMode)}
          >
            Resize & Move Widget
          </button>
          {#if resizeMode}
            <button
              class="z-20 ml-2 bg-red-400 px-2 py-1 rounded"
              on:click={() => (resizeMode = !resizeMode)}
            >
              Done
            </button>
          {/if}
        </div>

        <div>
          <input type="text" bind:this={urlInput} value={url} />
          <button
            class="bg-red-400 px-2 py-1 rounded"
            on:click={() => (url = urlInput.value)}
          >
            Apply URL
          </button>
        </div>
        <div>
          Width: <input type="number" class="w-16" bind:value={iframeWidth} />
          Height: <input type="number" class="w-16" bind:value={iframeHeight} />
        </div>
      </div>
    </div>
  {/if}
</div>
