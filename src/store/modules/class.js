const moduleClass = {
    namespaced: true,
    state: {
        class: '',
        chooseClass:'',
    },
    mutations: {
        setDB(state, item) {
            state.class = item
        },
        setClass(state, item) {
            state.chooseClass = item
        },
    },
    actions: {
        getDB(context, item) {
            context.commit('setDB', item)
        },
        setClass(context, item){
            context.commit('setClass', item)
        }
    },
    getters: {
        getClass(state) {
            console.log(state.class)
            return state.class
        },
        getChooseClass(state) {
            return state.chooseClass
        },
        getAClass(state,id) {
            return state.class[id-1]
        },
        getClassById: (state) => (id) => {
            return state.class[id-1]
        }
    }
}
export default moduleClass;
