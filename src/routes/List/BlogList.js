import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar, Pagination, Table, Popconfirm  } from 'antd';
import {BlogModal} from '../../components/Modal';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BlogList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(state => ({
  blogList: { ...state.blogList, loading: state.loading.models.blogList }
}))
export default class BlogList extends PureComponent {

  componentDidMount() {
    this.props.dispatch({
      type: 'blogList/fetch',
      payload: 1,
    });
  }

  pageChangeHandler = (page) => {

    // dispatch(routerRedux.push({
    //   pathname: '/users',
    //   query: { page },
    // }));

    console.log(page);
    this.props.dispatch({
      type: 'blogList/fetch',
      payload: page,
    });

    this.props.dispatch(routerRedux.push({
      pathname: '/blog-list',
      query: { page },
    }));
  };
  // console.log('pageChangeHandler');

  editHandler = (id, values) => {
    console.log(id);
    console.log(values);
    this.props.dispatch({
      type: 'blogList/put',
      payload: {id, values},
    });
  };

  deleteHandler = (id) => {
    console.log(id);
    this.props.dispatch({
      type: 'blogList/delete',
      payload: id,
    });
  };

  // static paginRender = (page, type) => true;

  render() {
    const { blogList: {list, pageSize, currentPage, totalPageCount, loading} } = this.props;

    const columns = [
      // {
      //   title: 'Name',
      //   dataIndex: 'name',
      //   key: 'name',
      //   render: text => <a href="">{text}</a>,
      // },
      // {
      //   title: 'Email',
      //   dataIndex: 'email',
      //   key: 'email',
      // },
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'title',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'title_secondary',
        dataIndex: 'title_secondary',
        key: 'title_secondary',
      },

      {
        title: 'Operation',
        key: 'operation',
        render: (text, record) => (
          <span className={styles.operation}>
          <BlogModal record={record} onOk={this.editHandler.bind(null, record.id)}>
            <a>Edit</a>
          </BlogModal>
          <Popconfirm title="Confirm to delete?" onConfirm={this.deleteHandler.bind(null, record.id)}>
            <a href="">Delete</a>
          </Popconfirm>
        </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>

      {/*    <Card
            className={styles.listCard}
            bordered={false}
            title="博客列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >*/}
       {/* <Button type="dashed" style={{ width: '100%', marginBottom: 8 }} icon="plus">
          添加
        </Button>*/}
          {/*<List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={item => (
              <List.Item
                actions={[<a>编辑</a>, <MoreBtn />]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.subDescription}
                />
                <ListContent data={item} />
              </List.Item>
            )}
            />*/}

          <div className={styles.normal}>
            <div>
              <div className={styles.create}>
                <BlogModal record={{}} >
                  <Button type="primary">Create Blog</Button>
                </BlogModal>
              </div>
              <Table
                columns={columns}
                dataSource={list}
                loading={loading}
                rowKey={record => record.id}
                pagination={false}
              />
              <Pagination
                className="ant-table-pagination"
                total={totalPageCount*pageSize}
                current={currentPage}
                pageSize={pageSize}
                onChange={this.pageChangeHandler}
                // defaultCurrent={currentPage}
                showQuickJumper={true}
                itemRender={BlogList.paginRender}
              />
            </div>
          </div>


        </div>
      </PageHeaderLayout>
    );
  }
}
