<template>
  <main class="relative flex flex-col items-center justify-center min-h-screen">
  <a
    href="https://vercel.com/templates/next.js/blob-sveltekit"
    class="flex px-10 py-2 mt-20 space-x-1 text-sm font-medium text-gray-600 transition-all rounded-full shadow-sm group sm:mt-0 bg-white/30 ring-1 ring-gray-900/5 hover:shadow-lg active:shadow-sm"
  >
    Deploy your own to Vercel
  </a>
  <h1
    class="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
  >
    Blob on Vercel
  </h1>
  <div
    class="flex flex-col items-center w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg"
  >
  <form
      class="grid w-full gap-6"
      enctype="multipart/form-data"
      @submit.prevent="onSubmit"
    >
      <div>
        <div class="mb-4 space-y-1">
          <h2 class="text-xl font-semibold">Upload a file</h2>
          <p class="text-sm text-gray-500">
            Accepted formats: .png, .jpg, .gif, .mp4
          </p>
        </div>
        <label
          for="image-upload"
          class="relative flex flex-col items-center justify-center mt-2 transition-all bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer group h-72 hover:bg-gray-50"
        >
            <div v-if="!file" class="absolute z-[5] h-full w-full rounded-md">
              <div
                class="absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all bg-white opacity-100 hover:bg-gray-50"
              >
                <svg
                  class="text-gray-500 transition-all duration-75 scale-100 h-7 w-7 group-hover:scale-110 group-active:scale-95"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
                  />
                  <path d="M12 12v9" />
                  <path d="m16 16-4-4-4 4" />
                </svg>
                <p class="mt-2 text-sm text-center text-gray-500">
                  Click to upload.
                </p>
                <p class="mt-2 text-sm text-center text-gray-500">
                  Max file size: 50MB
                </p>
                <span class="sr-only">Photo upload</span>
              </div>
            </div>
            <p v-else>{{file.name}}</p>
        </label>
        <div class="flex mt-1 rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            accept="image/*"
            class="sr-only"
            @change="onChange"
          />
        </div>
      </div>

      <button
        :disabled="!file"
        class="flex items-center justify-center w-full h-10 text-sm transition-all border rounded-md buttonClass focus:outline-none"
      >
        <p class="text-sm">Confirm upload</p>
      </button>
        <div v-if="form && !file" class="p-2">
          <p class="font-semibold text-gray-900">File uploaded!</p>
          <p class="mt-1 text-sm text-gray-500">
            Your file has been uploaded to
            <a
              class="font-medium text-gray-900 underline"
              :href="form.uploaded"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{form.uploaded}}
            </a>
          </p>
        </div>
    </form>
  </div>
  <div
    class="flex justify-center w-full max-w-lg gap-1 mt-6 font-light text-center text-gray-600"
  >
    <a
      href="https://vercel.com/blob"
      class="font-medium underline transition-colors underline-offset-4 hover:text-black"
    >
      Vercel Blob
    </a>
    demo.
    <span>Built with</span>
    <a
      href="https://kit.svelte.dev/"
      class="flex items-center font-medium underline transition-colors underline-offset-4 hover:text-black"
    >
      <!-- <img src="svelte_logo.png" alt="svelte logo" class="h-6 mx-1" /> -->
      <p>SvelteKit</p>
    </a>
    .
  </div>
  <div class="flex justify-between w-full px-20 py-10 sm:absolute sm:bottom-0">
    <a href="https://vercel.com">
      <!-- <img src="/vercel.svg" alt="Vercel Logo" width="100" height="24" /> -->
    </a>
    <a
      href="https://github.com/vercel/examples/tree/main/storage/blob-sveltekit"
      class="flex items-center space-x-2"
    >
      <!-- <img src="/github.svg" alt="GitHub Logo" width="24" height="24" /> -->
      <p class="font-light">Source</p>
    </a>
  </div>
</main>
</template>


<script>
export default {
  data() {
    return {
      file: null,
      form: null,
    };
  },
  computed: {
    buttonClass() {
      return this.file
        ? "border-black bg-black text-white hover:bg-white hover:text-black"
        : "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400";
    },
  },
  methods: {
    onChange(event) {
      this.file = event.target.files?.[0] ?? null;
    },
    async onSubmit() {
      console.log("image-upload", this.file);
      const response = await $fetch('/api/upload', {
        method: 'POST',
        body: this.file,
      })
      console.log(response)
      // this.form = await response.json();
    },
  },
};
</script>