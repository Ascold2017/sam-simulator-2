<template>
  <v-container class="mb-6" fluid>
    <v-card flat>
      <EditorToolbar />
      <v-card-text>
        <div class="d-flex align-content-start">
          <EditorMap />
          <v-divider vertical class="mx-3" />
          <EditorForm />
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import EditorToolbar from './EditorToolbar.vue';
import EditorMap from './EditorMap.vue';
import EditorForm from './EditorForm.vue'
</script>