import {queryBlogList, putBlog, deleteBlog, postImage, createBlog, queryArticle} from "../services/blog";

export default {
  namespace: 'blogList',

  state: {
    list: [],
    pageSize: null,
    currentPage: null,
    totalPageCount: null,

  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // yield put({
      //   type: 'changeLoading',
      //   payload: true,
      // });
      const response = yield call(queryBlogList, payload);
      yield put({
        type: 'appendList',
        payload: response,
      });
      // yield put({
      //   type: 'changeLoading',
      //   payload: false,
      // });
    },
    *put({ payload }, { call, put }) {
      const response = yield call(putBlog, payload);
      yield put({ type: 'reload' });
    },
    *'delete'({ payload }, { call, put }) {

      const response = yield call(deleteBlog, payload);
      yield put({ type: 'reload' });
    },
    *uploadImage({ payload }, { call, put }) {
      const response = yield call(postImage, payload);
      yield put({ type: 'reload' });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(createBlog, payload);
      yield put({ type: 'reload' });
    },
    *fetchArticle({ payload }, { call, put }) {
      const response = yield call(queryArticle, payload);
      yield put({
        type: 'queryArticleContent',
        payload: response,

      });
    },
    *reload(action, { put, select }) {
      //function select used to get value from state
      const page = yield select(state => state.blogList.currentPage);
      yield put({ type: 'fetch', payload: page  });
    },
  },

  reducers: {
    appendList(state,  { payload: { data: list, pageSize, currentPageNum, totalPageCount } }) {
      return {
        ...state,
        list: Array.isArray(list) ? list : [],
        pageSize: pageSize,
        currentPage: currentPageNum,
        totalPageCount: totalPageCount,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    queryArticleContent(state, action) {

    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/blog-list') {
          dispatch({
            type: 'fetch',
            payload: 1,
          });
        }
      });
    },
  },
};
