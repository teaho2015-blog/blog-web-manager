import {queryBlogList, putBlog, deleteBlog, postImage, createBlog} from "../services/blog";

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
  },
};
