import createCURD from '../../../helpers/createCURD';

const { methods: { create, update, load, del }, createReducer } = createCURD('admin/article', 'CURD');

export default function reducer(state = {}, action = {}) {
  return createReducer(state, action) || state;
}

export { create, update, load, del }