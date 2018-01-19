import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, message } from 'antd';
import styles  from './BlogModal.less';
import DOMAIN_URL from '../../constants';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw,ContentState } from 'draft-js';
// import * as Icons from 'images/icons';//custom editor icon image
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Dragger = Upload.Dragger;

const FormItem = Form.Item;

class BlogEditModal extends Component {

  constructor(props) {
    super(props);
    const {  title = '', title_secondary ='', image_url = '', content='' } = this.props.record;
    this.state = {
      visible: false,
      editorState: EditorState.createEmpty(),
      article: {
        title: title,
        title_secondary: title_secondary,
        content: content,
        image_url: image_url
      },
    };
  }

  // componentDidMount() {
  //   this.props.dispatch({
  //     type: 'blogList/fetchArticle',
  //     payload: this.props.record.id,
  //   });
  // }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    let  { article } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        article = { ...article, ...values};
      }
    });
    article.content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    onOk(article);
    this.hideModelHandler();
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };


  uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', DOMAIN_URL + '/api/v1/blog/image');
        // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  };

  render() {
    const { children } = this.props;
    const { getFieldDecorator } = this.props.form;
    // const { id } = this.props.record;
    const { editorState, article} = this.state;

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const contentBlock = htmlToDraft(article.content);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        ...this.state,
        'editorState': editorState,
      };
    }

    //dragger props
    const props = {
      name: 'image',
      multiple: false,
      action: '/api/v1/blog/image',
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          article.image_url = info.file.response.data.link;
          console.log(article.image_url, "upload successfully  year!!!");
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      defaultFileList: article.image_url !==''? [{
        uid: 1,
        name: 'header.jpg',
        status: 'done',
        url: article.image_url,
      }] : [],
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="Blog Form"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          // style={{width:720}}
          // className={styles.modalWidth}
          width={'100%'}
        >
          <Form layout={'vertical'} onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="标题"
            >
              {
                getFieldDecorator('title', {
                  initialValue: article.title,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="二级标题"
            >
              {
                getFieldDecorator('title_secondary', {
                  initialValue: article.title_secondary,
                })(<Input />)
              }
            </FormItem>

            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
            </Dragger>

            <Editor
            editorState={editorState}
            toolbarClassName="editor-toolbar"
            wrapperClassName="editor-wrapper"
            editorClassName={styles.blogEditor}
            onEditorStateChange={this.onEditorStateChange}
            toolbar={{
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              blockType:{inDropdown: true, },
              image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
            }}
          />
          </Form>

        </Modal>
      </span>
    );
  }
}

export default Form.create()(BlogEditModal);
