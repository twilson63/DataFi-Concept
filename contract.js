const functions = { hello }

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  return ContractError('function not defined!')
}

function hello(state, action) {
  if (!action.input.name) {
    return ContractError('Name required for function hello!')
  }
  if (typeof action.input.name !== 'string') {
    return ContractError('Name should be string!')
  }
  state.count = state.count + 1,
    state.names = [...state.names, action.input.name]
  return { state }
}