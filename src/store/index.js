import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import router from '../router/index.js'
const actions = { goto({ commit, dispatch }, payload) { router.push({ path: payload.Redirect }) }, }

Vue.use(Vuex);

const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: {
      getItem: key => Cookies.get(key),
      // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
      setItem: (key, value) => Cookies.set(key, value, { expires: inFifteenMinutes }),
      removeItem: key => Cookies.remove(key)
    }
  })],
  state: {
    connected: false,
    dictionaries: [],
    game: {},
    room: '',
    username: '',
    error: null,
    turn: '',
    spymasterReveal: false,
    popupHides: 0,
    spy: false,
    spymasters: 0,
    newGame: false,
    players: [],
    ip: ''
  },
  getters: {
    words(state) {
      if (state.game.solution) {
        return Object.keys(state.game.solution);
      }
      return [];
    },
    tileCounts(state) {
      if (state.game.solution) {
        const flippedCounts = {};
        const totalCounts = {
          R: 0,
          B: 0,
          G: 0,
          X: 0,
        };
        // compile the counts for each team + assassin
        Object.keys(state.game.solution).forEach((word) => {
          if (state.game.solution[word] !== 'O') {
            flippedCounts[state.game.solution[word]] = flippedCounts[state.game.solution[word]] || 0;
            if (state.game.board[word]) {
              flippedCounts[state.game.board[word]] += 1;
            }
            totalCounts[state.game.solution[word]] = totalCounts[state.game.solution[word]] || 0;
            totalCounts[state.game.solution[word]] += 1;
          }
        });
        return {
          total: totalCounts,
          flipped: flippedCounts,
        };
      }
      return false;
    },
    gameWon(state, getters) {
      if (getters.tileCounts) {
        return getters.tileCounts.flipped.X > 0 ||
          getters.tileCounts.flipped.R === getters.tileCounts.total.R ||
          getters.tileCounts.flipped.B === getters.tileCounts.total.B ||
          getters.tileCounts.flipped.G === getters.tileCounts.total.G;
      }
      return false;
    },
  },
  mutations: {
    SOCKET_CONNECT(state) {
      state.connected = true;
      //console.log('SOCKET_CONNECT', message);
    },
    SOCKET_DISCONNECT(state) {
      state.connected = false;
      //console.log('SOCKET_DISCONNECT', message);
    },
    SOCKET_MESSAGE(state, message) {
      state.game = message;
      state.players = message.players;
      state.error = null;
      state.spymasters = message.spymasters;
      state.turn = message.starting_color;
      state.room = message.game_id;
      state.newGame = message.newGame;
      if (message.newGame == true) {
        //router.push({ path: `/${state.room}/player` })
        console.log('SOCKET_MESSAGE', `/${state.room}/player`);
      }
      console.log('SOCKET_MESSAGE', message);
    },
    SOCKET_JOIN_ROOM(state, message) {
      state.error = null;
      state.room = message.room;
      state.spymasters = message.spymasters;
      console.log('SOCKET_JOIN_ROOM', message);
    },
    SOCKET_LIST_DICTIONARIES: (state, message) => {
      state.dictionaries = message.dictionaries;
      console.log('SOCKET_LIST_DICTIONARIES', message);
    },
    SOCKET_ERROR(state, message) {
      state.error = message.error;
      //console.log('SOCKET_ERROR', message);
    },
    set_turn(state, team) {
      state.turn = team;
    },
    set_game(state, game) {
      state.game = game;
    },
    set_room(state, room) {
      state.room = room;
    },
    set_spy(state, spy) {
      state.spy = spy;
    },
    set_username(state, username) {
      console.log('store set_username ' + username);
      state.username = username;
    },
    reset_error(state) {
      state.room = null;
      state.error = null;
    },
    reveal_spymaster(state) {
      state.spymasterReveal = true;
    },
    reset_room(state) {
      state.game = {};
      state.spymasterReveal = false;
    },
    incrementPopupHides(state) {
      state.popupHides++;
    },
    set_ip(state, ip) {
      state.ip = ip;
    },
  },
});
