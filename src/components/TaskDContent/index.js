import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Toast } from 'antd-mobile';

import { wechatShare } from '@/utils/wxConfig';
import { context } from '@/api';
import { shareOrigin } from '@/api/wxConfig';
import { formatDate } from '@/utils';
import Http from '@/utils/base';
import './index.less';

@withRouter
class TaskDContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shareMask:false,
			searched: false,
			types: [],
			doHomeworkUrl: '',
			lastSubmitDate: null
		}
	}

	componentDidMount() {
		const { lessonScheduleId } = this.props.course;

		Http.ajax(`${context}/lesson-schedules/${lessonScheduleId}/published`).then(res => {
			if (res && res.code == '0') {
				const { types, doHomeworkUrl, lastSubmitDate } = res.data;

				this.setState({
					searched: true,
					types,
					doHomeworkUrl,
					lastSubmitDate	
				}, this.handleForward);
			}
		});
	}

	handleSee = () => {
		const { corrected, lessonScheduleId, courseName } = this.props.course;
		const type = !!corrected ? 1 : 0;

		localStorage.setItem('studInfo',JSON.stringify({
			title: courseName
		}));
		this.props.history.push(`/mdtask/${lessonScheduleId}/${type}`);		
	}

	handleForward = () => {
		const { teacherName, courseName, lessonSequeence, lessonScheduleId, makeup } = this.props.course;
		const option = {
	        link: `${window.location.origin}/teacher-static/#/sharepage/${lessonScheduleId}`,
	        //href: `${shareOrigin}/student/static/index.html#/teacherShare/${lessonScheduleId}`,
	        //link: `${shareOrigin}/student/static/index.html#/teacherShare/${lessonScheduleId}`,
	        title: `${teacherName}老师的${courseName}课程第${lessonSequeence}次课的课后作业发布啦！`,
	        friendtitle: `${teacherName}老师的${courseName}课程第${lessonSequeence}次课的课后作业发布啦！`
	    };

	    if (makeup == true) {
	    	option.friendtitle = `${teacherName}老师的课后作业发布啦`;
	    	option.title = `${teacherName}老师的课后作业发布啦`;
	    }

	    wechatShare(option);
	}

	handleForwardTip = () => {
		// Toast.info('点击右上角开始转发 !!!', 2);
		this.share();
	}

	/*分享*/
	share = () => {
		this.setState({ shareMask: !this.state.shareMask });
	}

	render() {
		const { searched, types, lastSubmitDate, shareMask } = this.state;

		return (
			<div className="tdc-container">
				{/** 总作业条数 循环 */}
				{
					searched && types.length == 0 ? <div className="no-task">本节课没有作业！</div> : ''
				}
				{
					types.map((t, key) => {
						return (
							<div key={key} className="task-del">
								<h3><span/>{t.typeName}</h3>
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
				{
					!!searched && types.length > 0 ? <div className="lst-time">截止时间：{formatDate(lastSubmitDate)}</div> : ''
				}
				{
					!!searched && types.length > 0 ?
					<div className="btns">
						<div className="primary" onClick={this.handleForwardTip}>转发</div>
						<a className="look-task" onClick={this.handleSee}>查看作业完成情况</a>
					</div> : ''
				}
				{/*分享弹框*/}
				{
					shareMask && 
					<div className="share-mask" onClick={this.share}>
						<img src={require('@/assets/images/icon_zhuanfa.png')} alt="" />
					</div>
				}
			</div>
		)
	}
}

TaskDContent.PropTypes = {
	course: PropTypes.object
}

export default TaskDContent;