<script lang="ts">
  export let idx: number
  export let editMode: boolean
  export let url: string
  export let widgetHeight: number = 500
  export let widgetWidth: number = 500
  export let iframeWidth: number = 400
  export let iframeHeight: number = 400

  let urlInput: HTMLInputElement
  let resizeMode: boolean = false
</script>

<div
  id="w-{idx}"
  class="fixed overflow-hidden"
  style="width: {widgetWidth}px; height: {widgetHeight}px;">
  {#if resizeMode}
    <div
      class="draggable resizable"
      style="width: 100%; height: 100%; background-color: rgba(100, 0, 0, 0);
      z-index: 10; position: absolute;" />
  {/if}

  {#if editMode}
    <div
      class="bg-green-400"
      style="width: 100%; height: 100%; z-index: -1; position: absolute;" />
  {/if}

  <iframe
    title="frame_1"
    class="zoom"
    style="resize: both; overflow: auto;"
    src={url}
    width="{iframeWidth}px"
    height="{iframeHeight}px"
    frameborder="0" />

  {#if editMode}
    <div class="flex flex-col gap-2 m-2">
      <div>
        <button
          class="bg-red-400 px-2 py-1 rounded"
          disabled={resizeMode}
          on:click={() => (resizeMode = !resizeMode)}>
          Resize & Move Widget
        </button>
      </div>

      {#if resizeMode}
        <div class="z-20 absolute bottom-2 right-2">
          <button
            class="bg-red-400 px-2 py-1 rounded"
            on:click={() => (resizeMode = !resizeMode)}>
            Done
          </button>
        </div>
      {/if}

      <div>
        <input type="text" bind:this={urlInput} value={url} />
        <button
          class="bg-red-400 px-2 py-1 rounded"
          on:click={() => (url = urlInput.value)}>
          Apply URL
        </button>
      </div>
    </div>
  {/if}
</div>
