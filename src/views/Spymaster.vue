<template>
  <v-layout align-center justify-center text-xs-center mb-5 v-if="!spymasterReveal">
    <v-flex sm8 xs12>
      <v-alert outline type="warning" :value="true">
        <b>Uwaga!</b>Maksymalnie dwóch SpyMasterów może grać.
      </v-alert>
      <v-btn block large color="success" @click="reveal_spymaster" id="spymaster-btn">Rozumiem. Zrób mnie SpyMasterem!</v-btn>
    </v-flex>
  </v-layout>
  <v-layout row wrap v-else>
    <v-flex xs12 fill-height>
      <game-board :role="role" v-if="spymasterReveal">
        <v-btn fab top right absolute small class="pa-2" v-if="gameWon" color="success" @click.native="newGame(true)">
          <v-icon>autorenew</v-icon>
        </v-btn>
        <v-btn fab top right absolute small class="pa-2" v-if="isFirstTurn && !gameWon" color="success" @click.native="newGame" id="shuffle-btn">
          <v-icon>shuffle</v-icon>
        </v-btn>
      </game-board>
    </v-flex>
  </v-layout>
</template>

<script>
import GameBoard from '@/components/GameBoard';
import { mapState, mapMutations, mapGetters } from 'vuex';

export default {
  name: 'spymaster',
  components: {
    GameBoard,
  },
  computed: {
    ...mapGetters(['gameWon']),
    ...mapState(['room', 'username', 'spymasterReveal', 'game', 'connected', 'spy']),
    role() {
      if (!this.spymasterReveal) {
        return null;
      }
      return this.$route.name;
    },
    isFirstTurn() {
      if (!this.connected) {
        return true;
      }
      if (this.game.board) {
        return Object.values(this.game.board).every(e => e === false);
      }
      return true;
    },
  },
  methods: {
    ...mapMutations(['set_room', 'set_username', 'reveal_spymaster', 'reset_room', 'set_spy']),
    newGame(reset) {
      // reset spymaster state and go to player view
      // emit message to start a new game
      const params = {
        room: this.room,
      };
    // if (reset === true) {
        this.reset_room()
        params['newGame'] = true
        this.$router.push({ path: `/${this.room}/player` })
    //}
      console.log('newGame', params);
      this.$socket.emit('regenerate', params);
    },
  },
  mounted() {
    if (!this.username) this.set_username('#spy');
    if (!this.room) this.set_room(this.$route.params.room);
    //this.set_username('spy');
    this.set_spy(true);
    const params = {
      username: this.username,
      room: this.room,
      spy: this.spy
    };
    console.log('mounted', params);
    this.$socket.emit('join', params);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
