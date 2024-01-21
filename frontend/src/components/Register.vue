<template lang="">
  <div class="bg-slate-500 w-1/2 p-5 rounded-2xl">
    <h1 class="text-yellow-50 font-serif text-4xl tracking-wider text-center">
      Sign Up
    </h1>
    <form
      action=""
      method="post"
      class="p-5 box-border flex flex-col justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Username"
        class="input input-bordered w-full"
      />
      <input
        type="email"
        placeholder="Email"
        class="input input-bordered w-full"
      />
      <input
        type="password"
        placeholder="Password"
        class="input input-bordered w-full"
      />
      <button class="btn w-full btn-success">Sign Up</button>
      <div class="label">
        <span class="label-text-alt"></span>
        <span class="label-text-alt">Sign In</span>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  name: "Register",
};
</script>
<style lang=""></style>
