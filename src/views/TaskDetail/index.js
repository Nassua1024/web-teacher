import React, { Component } from 'react';
import { Button } from 'antd-mobile';

import TaskList from '@/components/TaskList';
import { URL } from '@/api';
import Http from '@/utils/base';
import { wechatShare } from '@/utils/wxConfig';
import './index.less';

class TaskDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lessonId: this.props.match.params.id,
			overallRemark: new Object(),
			starList: new Array(),
			starTxt: '',
			shareMask: false
		}
	}

	componentWillMount() {
		this.taskList();
	}

	/*微信分享*/
	wxShare() {

		const { studName } = this.state;
		const option = {
			title: studName + '同学本次的佳作惊艳了全场!',
			friendtitle: studName + '同学本次的佳作惊艳了全场!',
			desc: `快点进来为${studName}的作业点赞打call!`,
			link: window.location.href
		};

		wechatShare(option);
	}

	/*评价*/
	taskList() {

		const { lessonId } = this.state;

		Http.ajax(`${URL.homework_schedules}/${lessonId}/student-share`, {}).then(res => {
			if(res && res.code == 0) {

				let { starList, starTxt } = this.state;
				let title = res.data.courseName + '第' + res.data.sequeence + '次课';
				let teacherName = res.data.teacherName;
				const overallRemark = res.data.overallRemark;

				for(let i=0; i< overallRemark.teacherStar; i++) starList.push(i);

				switch(overallRemark.teacherStar) {
					case 1:
						starTxt = '非常不满意，各方面都很差';
						break;
					case 2:
						starTxt = '不满意，比较差';
						break;
					case 3:
						starTxt = '一般，有待提高';
						break;
					case 4:
						starTxt = '比较满意，仍可提高';
						break;
					default:
						starTxt = '非常满意，无可挑剔';
						break;
				}

				this.setState({
					overallRemark: overallRemark,
					studName: res.data.studentName,
					starList,
					starTxt,
					title,
					teacherName
				},() => this.wxShare());
			}
		});
	}

	/*分享*/
	share() {
		this.setState({ shareMask: !this.state.shareMask });
	}

	render() {

		const { studName, studAvatar, title, overallRemark, starList, starTxt, lessonId, teacherName, shareMask } = this.state;

		return (
			<div className="tdetail-container">
				{ /*学员信息*/ }
				<div className="st-msg">
					<div className="avator"><img src={require('@/assets/images/test.png')} alt=""/></div>
					<div>
						<p>{ studName }</p>
						<p>{ title }</p>
					</div>
				</div>

				{/*评价*/}
				<div className="evaluate-wrap">
					<div className="evaluate-info">
						{
							overallRemark.flowerAwarded &&
							<div>
								<img className="flower" src={require('@/assets/images/flower-active.png')} alt="" />
								<p>恭喜您：本次作业获得了秦汉胡同的最高荣誉</p>
							</div>
						}
						<div className="pingjia"><i></i><h3>评价</h3><i></i></div>
						<ul>
							{
								starList.map(item => (
									<li key={item}><img src={require('@/assets/images/star-active.png')} alt="" /></li>
								))
							}
						</ul>
						<p>{starTxt}</p>
						<p className="tcomment"><label>{teacherName}:</label> {overallRemark.remark}</p>
					</div>
				</div>

				{/*作业列表*/}
				<TaskList lessonId={lessonId} />

				{/*按钮*/}
				<Button href="javascript: " onClick={() => this.share()}>作为榜样案例分享</Button>
				
				{/*分享弹框*/}
				{
					shareMask && 
					<div className="share-mask" onClick={() => this.share()}>
						<img src={require('@/assets/images/share-guide.png')} alt="" />
					</div>
				}
			</div>
		)
	}
}

export default TaskDetail;