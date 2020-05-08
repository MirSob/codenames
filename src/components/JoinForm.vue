<template>
  <v-fade-transition appear>
    <v-card>
      <v-card-text>
        <v-form @submit="joinGame">
          <v-text-field label="Username" v-model="username" required @change="chUserName"></v-text-field>
          <v-alert type="error" :value="showInputError" transition="slide-y-reverse-transition">
            ID pokoju wymagane do dołączenia.
          </v-alert>
          <v-text-field label="Podaj ID Pokoju" v-model="room_num" :rules="[rules.required]" mask="AAAAA" solo light hide-details></v-text-field>
          <v-btn block color="primary" large @click.stop="joinGame">Dołącz do GRY</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-fade-transition>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "create-form",
  data() {
    return {
      username: '',
      room_num: null,
      showInputError: false,
      rules: {
        required: value => !!value || "Required."
      }
    };
  },
  computed: {
    room_id() {
      return this.room_num.toUpperCase();
    }
  },
  methods: {
    ...mapMutations(["set_username", "set_room", "set_spy"]),
    chUserName (){
      this.set_username(this.username);
    },
    joinGame() {
      this.set_username(this.username);
      this.set_spy(false);
      this.showInputError = false;
      if (this.room_num) {
        this.set_room(this.room_id);
				this.$router.push({ name: "Player", params: { room: this.room_id, username: this.username, spy:this.spy} });
      } else {
        this.showInputError = true;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
