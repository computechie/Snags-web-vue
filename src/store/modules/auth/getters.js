export default {
  userId(state) {
    return state.userId;
  },
  token(state) {
    return state.token;
  },
  isAuthenticated(state) {
    return !!state.token;
  },
  getUserFullName(state) {
    return state.userFullname;
  },
  getUserType(state) {
    return state.userType;
  },
  getUserLocale(state) {
    return state.userLocale;
  },
  didAutoLogout(state) {
    return state.didAutoLogout;
  },
};
