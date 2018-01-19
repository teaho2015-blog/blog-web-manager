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


export async function queryArticle(params) {
  return request(`/api/v1/blog/page/${params}`, {
    method: 'GET',
  });
}


export async function postImage(image) {
  return request(`/api/v1/blog/image`, {
    method: 'POST',
    body:image,
  });
}

export async function createBlog(params) {
  let urlSearchParams = new URLSearchParams();
  // let form = new FormData();
  urlSearchParams.append('title', params.title);
  urlSearchParams.append('title_secondary', params.title_secondary);
  urlSearchParams.append('image_url', params.image_url);
  urlSearchParams.append('content', params.content);
  console.debug(params);
  return request(`/api/v1/blog/article`, {
    method: 'POST',
    body: urlSearchParams,
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
