<template>
  <v-layout align-start justify-center text-xs-center row wrap>
    <v-flex lg4 md5 sm6 xs12>
      <v-avatar tile size="128">
        <img src="@/assets/logo-256x256.png" alt="codenames logo">
      </v-avatar>
      <h1 class="cn-text">Tajniacy</h1>
      <v-alert
        :value="false"
        type="warning"
        outline
      >
        Jeżeli masz problemy spróbuj odświeżyć stronę klawisz F5.
      </v-alert>
      <v-btn block color="secondary" large to="create" id="create-btn">Utwórz grę</v-btn>
      <join-form @change="chUserName"></join-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from 'vuex';
import CreateForm from '@/components/CreateForm';
import JoinForm from '@/components/JoinForm';

export default {
  name: 'Home',
  components: {
    CreateForm,
    JoinForm,
  },
  mounted() {
    this.reset_error();
  },
  methods: {
    ...mapMutations(['reset_error']),
    chUserName(usern) {
      console.log(usern);
    }
  },
};
</script>
