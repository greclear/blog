import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/userList';
import { del } from '../../redux/modules/admin/user';
import { asyncConnect } from 'redux-connect';
import PageList from '../../components/PageList';
import Prompt from '../../components/Prompt';
import { deleteOver } from '../../utils/actionOver';
import globalLoading from '../../utils/globalLoading';
import { replace } from 'react-router-redux';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return globalLoading(dispatch(load({params: {...location.query, x: 'user'}})), dispatch);
  }
}])
@connect(
  state => ({
    list: state.adminUserList,
    detail: state.adminUser
  }),
  { del, load, replace }
)
export default class UserList extends Component {
  render() {
    let
      props = this.props,
      list = props.list,
      detail = props.detail;

    if (list.loadData && list.loadData.data) {
      let
        {xData, pageList} = list.loadData.data;

      return (
        <div className="main">
          <div className="table2_wrap">
            <table className="table2">
              <tbody>
              <tr>
                <th>序号</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th>评论数</th>
                <th>操作</th>
              </tr>
              {xData.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{(pageList.current - 1) * pageList.size + i + 1}</td>
                    <td>{x.name}</td>
                    <td>{x.email}</td>
                    <td><Link to={ADMINPATH + 'commentList'} query={{userId: x._id}}>{x.commentCount}</Link></td>
                    <td>
                      <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, x._id)}>删除</a>
                      </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
            <Prompt loadData={detail.deleteData} loading={detail.deleteing} loadError={detail.deleteError} loadingMsg="删除中..." />
          </div>
          <PageList {...pageList} path={ADMINPATH + 'userList'} />
        </div>
      )
    } else {
      return null
    }
  }
  handleDelete(id) {
    deleteOver(this.props.del({params: {x: 'user', id}}), this);
  }
};