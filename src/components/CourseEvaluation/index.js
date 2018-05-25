import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast, Button } from 'antd-mobile';

import { context } from '@/api';
import { getImageTokenFromQiNiu } from '@/utils';
import Http from '@/utils/base';
import './index.less';

class CourseEvaluation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pics: [],
			teacherComment: '',
			token: '' // 七牛token
		};

		this.handleDeletePic = this.handleDeletePic.bind(this);
		this.handleUploadPics = this.handleUploadPics.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.changeComment = this.changeComment.bind(this);
	}

	componentWillMount() {
		const _this = this;

		getImageTokenFromQiNiu.call(this);
		_this.setState({
			pics: _this.props.pictures,
			teacherComment: _this.props.course.teacherComment || ''
		});
	}

	componentDidMount() {
	}

	putb64(result) {
		const _this = this;
        let pic = result.replace(/^.*?,/, '');

        let url = 'http://up.qiniu.com/putb64/-1';
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState==4) {
                let data = JSON.parse(xhr.responseText);

                // this.setState(prev => {
                //     prev.pics.push(`http://qiniu.shbaoyuantech.com/${data.key}`)
                //     return prev.pics;
                // });
                // 回调上传
                _this.uploadPicture(data.key);
            }
        }
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.setRequestHeader('Authorization', 'UpToken ' + this.state.token);
        xhr.send(pic);
    }

    uploadPicture(key) {
    	const _this = this;
    	const { lessonScheduleId } = this.props.course;
    	const params = {
    		data: {
    			lessonScheduleId,
    			pictures: [{ url: key }]	
    		},
			method: 'POST',
			formData: false
		}	

		Http.ajax(`${context}/lesson-schedules/upload-picture`, params).then(res => {
			if (res && res.code == '0') {
				const ps = res.data.lessonSchedulePictures;
				_this.setState({
					pics: ps
				});
				Toast.info('上传成功！', 1);
				_this.props.uploadPicBack(ps);
			}
		});
    }

	handleDeletePic(id) {
		const _this = this;
		const { pics } = this.state;

		const params = {
			method: 'delete'
		}

		Http.ajax(`${context}/lesson-schedules/pictures/${id}`, params).then(res => {
			if (res.code == '0') {
				const index = pics.findIndex(pic => pic.id == id);
				
				pics.splice(index, 1);
				_this.setState({
					pics: pics
				});
				Toast.info('删除成功！', 1);
				_this.props.uploadPicBack(pics);
			}
		});
	}

	handleUploadPics() {
		const files = this.refs.addSrcInput.files

		for (let file of files) {
            const fileRe = new FileReader();

            fileRe.readAsDataURL(file); 
            fileRe.addEventListener('load', () => {
                this.putb64(fileRe.result);
            });
        }
	}

	changeComment(e) {
		this.setState({
			teacherComment: e.target.value
		});
	}

	handleSave() {
		const _this = this;
		const { lessonScheduleId } = this.props.course;
		const { teacherComment } = this.state;
		const params = {
			data: {
				teacherComment: teacherComment
			},
			method: 'POST'
		}

		Http.ajax(`${context}/lesson-schedules/${lessonScheduleId}/comment`, params).then(res => {
			if (res.code == '0') {
				this.setState({
					teacherComment	
				});
				Toast.info('保存成功！', 1);
				_this.props.changeComment(teacherComment);
			}
		});
	}

	picsDom() {
		const { published } = this.props.course;
		var { pics } = this.state;

		return pics.map(pic => {
			return (
				<div key={pic.id} className="img-list">
					<img src={pic.url} alt=""/>
					{!published && <i onClick={() => this.handleDeletePic(pic.id)}></i>}
				</div>		
			)
		})
	}

	render() {
		const picdom = this.picsDom();
		const { teacherComment } = this.state;
		const { published } = this.props.course;

		return (
			<div className="cevaluation-container" id="token">
				<div className="abb picss">
					<div className="course-dt">
						<p><span/>课堂掠影</p>
						<div className="cpngs-content">
							{ picdom }
							{
								!published && 
									<div className="img-list upload-div">
										<span>添加照片</span>
										<div className="plu icon"></div>
										<input type="file"
			                               accept="image/*"
			                               ref={`addSrcInput`}
			                               onChange={this.handleUploadPics} />
									</div>
							}	
						</div>
					</div>
				</div>
				<div className="teacher-teax abb">
					<p><span/>老师寄语</p>
					{
						!!published ? <div className="textarea1">{teacherComment}</div> :
							<textarea 
								rows="6"
								className="textare"
								value={teacherComment} 
								onChange={(e) => this.changeComment(e)} >
							</textarea>			
					}	
				</div>
				{
					!published ? <div className="primary" onClick={this.handleSave}>保存</div> : ''
				}
			</div>
		)
	}
}

CourseEvaluation.PropTypes = {
	course: PropTypes.object,
	pictures: PropTypes.array,
	changeComment: PropTypes.func,
	uploadPicBack: PropTypes.func
}

export default CourseEvaluation;