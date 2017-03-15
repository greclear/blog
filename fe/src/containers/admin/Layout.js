import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { isLoaded, load } from '../../redux/modules/admin/blogInfo';
import { asyncConnect } from 'redux-connect';
import '../layout.scss';
import Loading from '../../components/Loading';
import Toast from '../../components/Toast';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    if (!isLoaded(getState())) {
      return dispatch(load());
    }
  }
}])
@connect(
  state => ({
    blogInfo: state.adminBlogInfo,
    global: state.global
  })
)
export default class Layout extends Component {
  render() {
    let
      props = this.props,
      blogInfoProps = props.blogInfo,
      global = props.global;

    if (blogInfoProps.loadData && blogInfoProps.loadData.data) {
      let
        {blogInfo} = blogInfoProps.loadData.data;
      return (
        <div className="admin">
          <Helmet title='后台管理'/>
          <header className="header">
            <div className="inner">
              <h1><Link to={String(ADMINPATH)} className="logo">{blogInfo.title} 后台管理</Link></h1>
              <div className="icon-menu"></div>
              <nav id="nav">
                <Link to={ADMINPATH + 'blogInfo'}>博客信息</Link>
                <Link to={ADMINPATH + 'articleList'}>文章</Link>
                <Link to={ADMINPATH + 'articleTypeList'}>文章类型</Link>
                <Link to={ADMINPATH + 'articleTagList'}>标签云</Link>
                <Link to={ADMINPATH + 'commentList'}>评论</Link>
                <Link to={ADMINPATH + 'singlePageList'}>单页面</Link>
                <Link to={ADMINPATH + 'userList'}>用户</Link>
                <Link to={ADMINPATH + 'adminList'}>管理员</Link>
                <Link to={ADMINPATH + 'linkList'}>友情链接</Link>
              </nav>
            </div>
          </header>
          {this.props.children}
          <footer className="footer" dangerouslySetInnerHTML={{__html: blogInfo.copyright}}></footer>
          <Loading loading={global.loading} />
          <Toast loading={global.loading} msg={global.toastMsg} />
        </div>
      )
    } else {
      return (
        <div className="welcome">
          <Helmet title='500 Error'/>
          <h1>网络错误，请稍后重试...</h1>
        </div>
      )
    }
  }
};
