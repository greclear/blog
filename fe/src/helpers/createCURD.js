function createMenthod(method, types, prefix) {
  return function({ params, data } = {}) {
    //返回一个自定义的action对象
    return {
      types: types,
      promise: (client) => client[method](prefix, { params, data })
    };
  }
}

function createMenthodsAndConstants(prefix, actions, action, constants, methods, name, pageName) {
  pageName = pageName ? '-' + pageName : '';

  if (~actions.indexOf(action)) {
    let types = [
      `${prefix}${pageName}/${name}`,
      `${prefix}${pageName}/${name}_SUCCESS`,
      `${prefix}${pageName}/${name}_FAIL`
    ];
    // 常量
    Object.assign(constants, {
      [name]: types[0],
      [name + '_SUCCESS']: types[1],
      [name + '_FAIL']: types[2]
    });
    // 方法
    if (action === 'C') {
      methods.create = createMenthod('post', types, prefix);
    } else if (action === 'U') {
      methods.update = createMenthod('put', types, prefix);
    } else if (action === 'R') {
      methods.load = createMenthod('get', types, prefix);
    } else if (action === 'D') {
      methods.del = createMenthod('del', types, prefix);
    }
  }
}

export default function createCURD(prefix, actions, pageName) {
  const constants = {};
  const methods = {};
  const actionsMap = {
    'C': 'CREATE',
    'U': 'UPDATE',
    'R': 'LOAD',
    'D': 'DELETE'
  }

  actions.toUpperCase().split('').forEach((action) => {
    createMenthodsAndConstants(prefix, actions, action, constants, methods, actionsMap[action], pageName);
  })

  const createReducer = function(state, action) {
    switch (action.type) {
      case constants.LOAD:
        return {
          ...state,
          loading: true
        };
      case constants.LOAD_SUCCESS:
        return {
          ...state,
          loading: false,
          loaded: true,
          loadData: action.result,
          loadError: null
        };
      case constants.LOAD_FAIL:
        return {
          ...state,
          loading: false,
          loaded: false,
          loadData: null,
          loadError: action.error
        };
      case constants.CREATE:
      case constants.UPDATE:
        return {
          ...state,
          editing: true
        };
      case constants.CREATE_SUCCESS:
      case constants.UPDATE_SUCCESS:
        return {
          ...state,
          editing: false,
          edited: true,
          editData: action.result,
          editError: null
        };
      case constants.CREATE_FAIL:
      case constants.UPDATE_FAIL:
        return {
          ...state,
          editing: false,
          edited: false,
          editData: null,
          editError: action.error
        };
      case constants.DELETE:
        return {
          ...state,
          deleteing: true
        };
      case constants.DELETE_SUCCESS:
        return {
          ...state,
          deleteing: false,
          deleted: true,
          deleteData: action.result,
          deleteError: null
        };
      case constants.DELETE_FAIL:
        return {
          ...state,
          deleteing: false,
          deleted: false,
          deleteData: null,
          deleteError: action.error
        };
    }
  }

  return { methods, createReducer };
}
