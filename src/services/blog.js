import { stringify } from 'qs';
import request from '../utils/request';


export async function queryBlogList(params) {
  return request(`/api/v1/blog/page/${params}`);
}

export async function putBlog({id, values}) {
  return request(`/api/v1/blog/article/${id}`, {
    method: 'PUT',
    body: values,
  });
}

export async function deleteBlog(id) {
  return request(`/api/v1/blog/article/${id}`, {
    method: 'DELETE',
  });
}


