import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';


import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState } from 'draft-js';
// import * as Icons from 'images/icons';//custom editor icon image

const FormItem = Form.Item;

class BlogEditModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editorState: EditorState.createEmpty(),
    };
  }

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
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    //     onOk(values);
    //     this.hideModelHandler();
    //   }
    // });
    onOk(this.state.editorState.getCurrentContent());
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
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
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
    const { name, email, website } = this.props.record;
    const { editorState } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
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
        >
          <Form horizontal onSubmit={this.okHandler}>
           {/* <FormItem
              {...formItemLayout}
              label="Name"
            >
              {
                getFieldDecorator('name', {
                  initialValue: name,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Email"
            >
              {
                getFieldDecorator('email', {
                  initialValue: email,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Website"
            >
              {
                getFieldDecorator('website', {
                  initialValue: website,
                })(<Input />)
              }
            </FormItem> */}
            <Editor
            editorState={editorState}
            toolbarClassName="editor-toolbar"
            wrapperClassName="editor-wrapper"
            editorClassName="blog-editor"
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
