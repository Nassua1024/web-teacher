import React, { Component } from 'react';
import { Flex, Button } from 'antd-mobile';

import { wechatShare } from '@/utils/wxConfig';
import { formatTime } from '@/utils';
import { context } from '@/api';
import Http from '@/utils/base';
import './index.less';

class SharePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				teacherName: '',
				courseName: '',
				sequence: '',
				lessonStartTime: null,
				lessonEndTime: null,
				lastSubmitDate: null,
				doHomeworkUrl: null,
				types: [],
				makeup: ''
			}
		};
	}
	componentDidMount() {
		const { id } = this.props.match.params;
		const params = {
			noToken: true
		}

		Http.ajax(`${context}/lesson-schedules/${id}/share-homework`, params).then(res => {
			if (res && res.code == '0') {
				this.setState({
					data: res.data
				});	
				this.handleForward(id);		
			}
		});
	}

	handleForward = (id) => {
		const { teacherName, courseName, sequence, makeup } = this.state.data;
		let option = {
	        link: `${window.location.origin}/teacher-static/#/sharepage/${id}`,
	        title: `${teacherName}老师的${courseName}课程第${sequence}次课的课后作业发布啦！`,
	        friendtitle: `${teacherName}老师的${courseName}课程第${sequence}次课的课后作业发布啦！`
	    };

	    if (makeup == true) {
	    	option.friendtitle = `${teacherName}老师的课后作业发布啦`;
	    	option.title = `${teacherName}老师的课后作业发布啦`;
	    }

	    wechatShare(option);
	}

	handleDoWork = () => {
		window.location.href = this.state.data.doHomeworkUrl;
	}

	render() {
		const { courseName, lessonStartTime, lessonEndTime, sequence, types, makeup } = this.state.data;
		const bTime = lessonStartTime != null ? formatTime(lessonStartTime) : '';
		const eTime = lessonEndTime != null ? formatTime(lessonEndTime) : '';

		return (
			<div className="share-container">
				<div className="title">
					{
						makeup == true ? <p>补课</p> : <p>第{sequence}次</p> 
					}
					<Flex justify="around">
						<Flex.Item className="tcenter">{courseName}</Flex.Item>
						<Flex.Item className="tcenter">{bTime} —— {eTime}</Flex.Item>
					</Flex>
				</div>
				<div className="task-li">
					{
						types.map((t, key) => {
							return (
								<div key={key} className="task-del">
									<h3>{t.typeName}</h3>
									{/** 每个作业有几条 循环 */}
									{
										t.homeworks.map((h, i) => {
											const ii = i + 1;

											return (
												<div key={i}>
													<p>{ii}. {h.content}</p>
												</div>
											)
										})
									}
								</div>
							)
						})
					}
				</div>
				<Button type="primary" onClick={this.handleDoWork}>去做作业</Button>
			</div>
		)
	}
}

export default SharePage;