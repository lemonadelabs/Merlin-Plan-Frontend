export default function adminUsers(state = { modalMode: '' }, action) {
  switch (action.type) {
    case 'SET_MODAL_MODE':
      return Object.assign({},state, { modalMode: action.mode })
    default:
      return state;
  }
}