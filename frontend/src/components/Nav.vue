<template>
  <nav class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">{{ msg }}</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li class="bg-slate-700 mx-2 hover:bg-gray-500"><a>Sign Up</a></li>
        <li class="bg-slate-700 mx-2 hover:bg-gray-500"><a>Sign In</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Nav",
  props: {
    msg: String,
  },
};
</script>
