import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, Button, Toast } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

class CourseContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cContent: '',
			edit: false
		}
	}

	saveContent() {
		const _this = this;
		const { lessonScheduleId } = this.props.course;
		const cc = document.getElementById('texta').value;

		const params = {
			method: 'POST',
			formData: false,
			data: {
				content: cc,
				contentType: 'WORD',
				lessonScheduleId
			}
		}

		// if (!!published) {
		// 	Toast.info('已发布不能再操作课堂内容！', 1);
		// 	return;	
		// }

		Http.ajax(URL.save_content, params).then(res => {
			if (res.code == '0') {
				// 保存成功后重新拉取数据
				_this.props.searchTeacherDes();
				Toast.info('保存成功！', 1);	
			}
		});
	}

	showContent = () => {
		const _this = this;
		const { contents, items, courseContent, course } = this.props;
		const { edit } = this.state;
		let ct;
		let btn = '';
		let editBtn = '';
		const ded = course.published ? true : false;

		if (contents.length == 0) {
			if (items.length == 0) {
				ct = <textarea id="texta" disabled={ded} className="textare" rows="8"></textarea>;
				btn = <div className="primary" onClick={() => _this.saveContent()}>保存</div>
			} else {
				if (!!edit) {
					ct = <textarea id="texta" disabled={ded} className="textare" rows="8"  defaultValue={courseContent} ></textarea>;
					btn = <div className="primary" onClick={() => _this.saveContent()}>保存</div>;
				} else {
					ct = <div className="text">{courseContent}</div>
					editBtn = <div className="edit-btn" onClick={() => _this.setState({ edit: true })}>编辑</div>
				}	
			}
		} else {
			ct = <div className="text">{courseContent}</div>
		}

		return (
			<div>
				<div className="show-content">
					<p><span></span>课程内容</p>
					{ !!course.published ? '' : editBtn }
					<div className="auto-content">
						{ct}	
					</div>
				</div>
				{
					!!course.published ? '' : btn
				}
			</div>
		)
	}

	render() {
		const { searched } = this.props;

		return (
			<div className="ccontent-container">
				{ !!searched ? this.showContent() : '' }
			</div>
		)
	}
}

CourseContent.PropTypes = {
	course: PropTypes.object,
	contents: PropTypes.array,
	items: PropTypes.array,
	searched: PropTypes.bool,
	searchTeacherDes: PropTypes.func,
	courseContent: PropTypes.string
}

export default CourseContent;