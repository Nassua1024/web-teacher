import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex, List, Toast, TextareaItem, Button } from 'antd-mobile';

import TaskList from '@/components/TaskList';
import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

class TaskModifing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lessonId: this.props.match.params.id,
			starList: [1, 2, 3, 4, 5],
			iNow: 4,
			starTxt: '非常满意，无可挑剔',
			remark: '',
			flowerAwarded: true
		};
	}

	componentWillMount() {
		
		const studInfo = JSON.parse(localStorage.getItem('studInfo'));
		document.title = '批改作业';
		
		this.setState({
			studName: studInfo.name,
			studAvatar: studInfo.avatar,
			title: studInfo.title,
		});
	}

	/* 星星评分 */
	evaluate(index) {

		let { starTxt, flowerAwarded } = this.state;

		switch(index) {
			case 0:
				starTxt = '非常不满意，各方面都很差';
				flowerAwarded = false;
				break;
			case 1:
				starTxt = '不满意，比较差';
				flowerAwarded = false;
				break;
			case 2:
				starTxt = '一般，有待提高';
				flowerAwarded = false;
				break;
			case 3:
				starTxt = '比较满意，仍可提高';
				flowerAwarded = false;
				break;
			default:
				starTxt = '非常满意，无可挑剔';
				flowerAwarded = true;
				break;
		}

		this.setState({
			iNow: index,
			starTxt,
			flowerAwarded
		});
	}

	/* 输入评语 */
	inputMark(remark) {
		this.setState({ remark });
	}

	/* 选中小红花 */
	selectFlower() {
		const { flowerAwarded } = this.state;
		this.setState({ flowerAwarded: !flowerAwarded })
	}

	/* 保存 */
	save() {
		
		const { iNow, lessonId, remark, flowerAwarded } = this.state;
		const params = {
			formData: false,
			method: 'PUT',
			data: {
				teacherStar: iNow + 1,
				flowerAwarded,
				remark
			}
		};

		if(remark == '') {
			Toast.info('请对本次作业进行评价~', 1);
			return false;
		}

		Http.ajax(`${URL.homework_schedules}/${lessonId}/remark`, params).then(res => {
			if(res && res.code == 0) 
				this.props.history.push(`/tashdetail/${lessonId}`);
		});
	}

	render() {

		const { studName, studAvatar, title, starList, iNow, starTxt, flowerAwarded, lessonId } = this.state;

		return (
			<div className="tm-container">
				{ /*头部学员信息*/ }
				<div className="st-msg">
					<div className="avator"><img src={require('@/assets/images/test.png')} alt=""/></div>
					<div>
						<p>{ studName }</p>
						<p>{ title }</p>
					</div>
				</div>
				
				{/*作业列表*/}
				<TaskList lessonId={lessonId} />
				
				{/*评价*/}
				<div className="evaluate">
					<div>
						<div className="tit"><i /><span>评价</span><i /></div>
						<ul>
							{
								starList.map((item, index) => {
									return (
										<li key={index} onClick={() => this.evaluate(index)}>
											{
												index > iNow &&
												<img src={require('@/assets/images/star.png')} />
											}
											{
												index <= iNow &&
												<img src={require('@/assets/images/star-active.png')} />
											}
										</li>
									)
								})
							}
						</ul>
						<p>{starTxt}</p>
						{
							(iNow >= 4 && flowerAwarded == true) && 
							<img className="flower" onClick={() => this.selectFlower()} src={require('@/assets/images/flower-active.png')} />
						}
						{
							(iNow >= 4 && flowerAwarded == false) && 
							<img className="flower" onClick={() => this.selectFlower()} src={require('@/assets/images/flower.png')} />
						}
						<TextareaItem placeholder="请输入您的评语" onChange={(e) => this.inputMark(e)} /> 
					</div>
				</div>
				
				{/*按钮*/}
				<Button href="javascript: " onClick={() => this.save() }>保存并提交</Button>
			</div>
		)
	}
}

export default TaskModifing;