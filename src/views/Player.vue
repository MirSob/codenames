<template>
  <game-board :role="role"></game-board>
</template>

<script>
import GameBoard from '@/components/GameBoard';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'player',
  components: {
    GameBoard,
  },
  computed: {
    ...mapState(['room', 'username', 'spy', 'ip']),
    role() {
      return this.$route.name;
    },
  },
  mounted() {
    if (!this.username) this.set_username(this.ip +'#player');
    if (!this.room) this.set_room(this.$route.params.room);
    this.set_spy(false);
    //this.set_username('player');
    const params = {
      username: this.username,
      room: this.room,
      spy: this.spy
    };
    this.$socket.emit('join', params);
  },
  methods: {
    ...mapMutations(['set_room', 'set_username', 'set_spy']),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
