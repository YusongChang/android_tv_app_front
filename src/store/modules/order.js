const moduleOrder = {
    namespaced: true,
    state: {
        orders: [],
    },
    mutations: {
        setDB() {
        },
        addOrder(state, item) {
            state.orders.push({
                orderid: state.orders.length + 1,
                Email: item[2].email,
                tel: item[2].tel,
                address: item[2].address,
                name: item[2].name,
                date: new Date().toDateString(),
                item: item[0],
                total: item[1],
                state: "送出訂單"
            })
        },
        cancelOrder(state, item) {
            const record = state.orders.find(p => p.id === item.id)
            record.state = "已取消"
        },
    },
    actions: {
        getDB(context) {
            context.commit('setDB')
        },
        addOrder(context, item) {
            context.commit('addOrder', item)
        },
        cancelOrder(context, item) {
            context.commit('cancelOrder', item)
        },
    },
    getters: {
        getOrders(state) {
            return state.orders
        }
    }
}
export default moduleOrder;
