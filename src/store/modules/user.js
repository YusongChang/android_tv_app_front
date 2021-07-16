
const moduleUser = {
    namespaced: true,
    state: {
        user:'',
    },
    mutations: {
        setDB(state, user) {
            state.user = user
        },
    },
    actions: {
        login(context, user) {
            context.commit('setDB',user)
        },
        logout(context) {
            context.commit('setDB','')
        },
    },
    getters: {
        getUser(state) {
            console.log(state.user)
            return state.user
        },
    }
}
export default moduleUser;
