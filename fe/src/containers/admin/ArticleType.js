import React, { Component } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Alert from '../../components/Alert';
import formatForm from '../../utils/formatForm';
import { editOver } from '../../utils/actionOver';
import * as detailActions from '../../redux/modules/admin/articleType';
import Prompt from '../../components/Prompt';
import { push } from 'react-router-redux';
import globalLoading from '../../utils/globalLoading';

@asyncConnect([{
  promise: ({store: {dispatch}, location}) => {
    return globalLoading(dispatch(detailActions.load({params: {x: 'articleType', id: location.query.id}})), dispatch);
  }
}])
@connect(
  state => ({
    detail: state.adminArticleType
  }),
  { ...detailActions, push }
)
export default class ArticleType extends Component {
  state = {
    validateMsg: null
  }
  render() {
    let
      detail = this.props.detail;

    if (detail.loadData && detail.loadData.data) {
      let {xData} = detail.loadData.data;

      return (
        <div className="main">
          <table className="table1">
            <tbody>
            <tr>
              <td className="td1">&nbsp;</td>
              <td><h2>{xData._id ? '编辑' : '新增'}</h2></td>
            </tr>
            <tr>
              <td className="td1">名称：</td>
              <td><input type="text" ref="name" className="form-control" defaultValue={xData.name} /></td>
            </tr>
            <tr>
              <td className="td1">路径：</td>
              <td><input type="text" ref="path" className="form-control" defaultValue={xData.path} /></td>
            </tr>
            <tr>
              <td className="td1">是否启用：</td>
              <td>
                <select ref="enabled" defaultValue={xData.enabled} className="form-control">
                  <option value={true}>是</option>
                  <option value={false}>否</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="td1">&nbsp;</td>
              <td>
                <a href="javascript:void(0)" className="btn" onClick={this.handleSubmit.bind(this, xData._id)}>确定</a>&nbsp;&nbsp;
                <Prompt loadData={detail.editData} loading={detail.editing} loadError={detail.editError} loadingMsg="提交中..." className='inline'>
                  <Alert validateMsg={this.state.validateMsg} />
                </Prompt></td>
            </tr>
            </tbody>
          </table>
        </div>
      )
    } else {
      return null;
    }
  }
  handleSubmit(id) {
    let
      data = formatForm(this, [
        {
          name: 'name',
          rules: ['isRequired'],
          msgs: ['名称不能为空！']
        }, {
          name: 'path',
          rules: ['isRequired'],
          msgs: ['路径不能为空！']
        },{
            name: 'enabled'
        }
      ]),
      props = this.props;

    // 提交
    if (data) {
      if (id) {
        editOver(props.update({params: {x: 'articleType', id}, data}), this, ADMINPATH + 'articleTypeList');
      } else {
        editOver(props.create({params: {x: 'articleType'}, data}), this, ADMINPATH + 'articleTypeList');
      }
    }
  }
}
