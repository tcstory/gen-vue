<template>
  <div v-for="item in list" click.stop="@onClick(item)" data-nani="1">{{item}}</div>
</template>