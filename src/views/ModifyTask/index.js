import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Toast, Button } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

@withRouter
class ModifyTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: JSON.parse(localStorage.getItem('studInfo')).title, 
			lessonId: this.props.match.params.id,
			isCorrected: this.props.match.params.type, // 是否已经批改
			lastSubmitDate: '', // 截至时间
			studentList: new Array(),
			canSelectAll: false,
			selectAll: false,
			selectClass: '',
			selected: true,
			urgeSuccess: false 
		}; 
	}

	componentWillMount() {
		document.title = this.state.title;
		this.studentsList();
	}

	/*学员列表*/
	studentsList() {

		const { lessonId } = this.state;
		let { isCorrected } = this.state;

		isCorrected = isCorrected == 0 ? false : true;

		const params = { data: { isCorrected } };

		Http.ajax(`${URL.homework_schedules}/${lessonId}/students`, params).then(res => {
			if(res && res.code == 0) {

				let { lastSubmitDate, canSelectAll } = this.state;
				const dataItem = new Object();
				let studentList = [];

				lastSubmitDate = isCorrected == 0 ? new Date(res.data.lastSubmitDate).Format('yyyy-MM-dd hh:mm') : '';

				res.data.students.map(item => {
					dataItem.lessonId = item.studentLessonId;
					dataItem.avatar = item.avatar;
					dataItem.name = item.studentName;
					dataItem.finished = item.finished;
					dataItem.remarked = item.remarked;
					dataItem.urged = item.urged;
					dataItem.btnTxt = !item.finished ? (!isCorrected ? '催交作业' : '未完成') : item.remarked ? '已批改' : '未批改';
					dataItem.btnClass = !item.finished ? ((!isCorrected ? (item.urged ? 'urged' : 'urge') : item.remarked ? 'not-correct' : 'not-finish')) : item.remarked ? 'correct' : 'not-correct';
					studentList.push(Object.assign({}, dataItem));
					if(!item.remarked && item.finished) canSelectAll = true;
				});

				this.setState({ studentList, lastSubmitDate, canSelectAll });
			}
		});
	}

	/*单选*/
	handleSelect(index, btnClass) {

		const { studentList } = this.state;
		
		if(btnClass == 'correct') return false;

		studentList[index].remarked = !studentList[index].remarked;
		this.setState({ studentList });
	}

	/*点击学员列表*/
	handleModify(state, remarked, id, name, avatar) {
		
		if(state == true && remarked == false) this.props.history.push(`/taskmd/${id}`); 
		if(state == true && remarked == true) this.props.history.push(`/tashdetail/${id}`); 
		
		localStorage.setItem('studInfo', JSON.stringify({
			name,
			avatar,
			title: this.state.title
		}));
	}

	/*催交作业*/
	handleUrgeTask(state, id, urged) {
		
		if(Number(this.state.isCorrected) == 1 || state == true || urged) return false;
		
		const params = { method: 'put' };

		Http.ajax(`${URL.homework_schedules}/${id}/urged`, params).then(res => {
			if(res && res.code == 0) this.setState({ 'urgeSuccess' : true}, () => this.studentsList() );
		});
	}

	/*一键批改*/
	correctAll() {
		
		const { studentList, lessonId } = this.state;
		const batchList = [];

		studentList.map(item => {
			if(item.finished && !item.remarked) batchList.push(item.lessonId);
		});

		if(batchList.length == 0) {
			Toast.info('请选择学员', 1);
			return false;
		}

		localStorage.setItem('batchList', JSON.stringify(batchList));
		this.props.history.push(`/correctall/${lessonId}`);
	}

	render() {

		const { studentList, lastSubmitDate, isCorrected, canSelectAll, selectAll, selectClass, urgeSuccess } = this.state;

		return (
			<div className="mtask-container">
				{
					isCorrected == 0 &&
					<div className="time">
						<i></i>
						<span>截至时间: {lastSubmitDate}</span>
					</div>
				}
				<div className="homework">
					<i></i>
					<span>学员作业</span>
					{
						canSelectAll &&
						<a 
							className="select-all" 
							onClick={() => this.setState({ selectAll: true, selectClass: '' })} 
							href="javascript: "
						>
							一键批改
						</a>
					}
				</div>
				<div className="stud-wrap">
					{
						studentList.map((item, index) => (
							<div className="stud-list" key={index}>
								{ 
									selectAll && 
									<div className="select-item" onClick={() => this.handleSelect(index, item.btnClass)}>
										{ (item.btnClass == 'not-correct') && <i className={ !item.remarked ? 'active' : '' }></i> }
									</div> 
								}
								<div 
									className={selectClass}
									onClick={() => this.handleModify(item.finished, item.remarked, item.lessonId, item.name, item.avatar)}
								>
									<img src={require('@/assets/images/test.png')} alt="" />
									<span>{item.name}</span>
									<a 
										className={item.btnClass} 
										onClick={() => this.handleUrgeTask(item.finished, item.lessonId, item.urged)}
										href="javascript: void(0)" 
									>
										{item.btnTxt}
									</a>
								</div>
							</div>
						))
					}
				</div>
				{
					urgeSuccess &&
					<div className="urge-wrap" onClick={() => this.setState({ urgeSuccess: false })}>
						<div className="urge-content">
							<img src={require('@/assets/images/icon_chenggong.png')} alt="" />
							<p>提醒成功</p>
						</div>
					</div>
				}
				{
					selectAll && 
					<div className="select-btn">
						<Button onClick={() => this.setState({ selectAll: false, selectClass: '' })} href="javascript: "></Button>
						<Button onClick={() => this.correctAll()} href="javascript: "></Button>
					</div>
				}
			</div>
		)
	}
}

export default ModifyTask;