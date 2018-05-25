import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Flex, Button } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

@withRouter
class TaskCourse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 0, // tab切换下标
			iNow: 0, // 当前他下标
			taskList: new Array() // 课堂列表
		};
	}

	componentWillMount() {
		document.title = '批改作业';
		this.taskList(0);	
	}

	/*tab切换*/
	handleChangeType(type) {
		
		if (type == this.state.iNow) return false;

		this.setState({ 
			type,
			iNow: type
		},() => this.taskList(type));	
	}

	/*课堂列表*/
	taskList(type) {
		Http.ajax(URL.homework_schedules, {}).then(res => {
			if(res && res.code == 0) {
				
				const taskItem = new Object();
				const taskList = new Array();
				const dataList = type == 0 ? res.data.notCorrectedList : res.data.correctedList;

				dataList.map(item => {
					taskItem.id = item.lessonScheduleId;
					taskItem.name = item.courseName;					
					taskItem.startTime = new Date(item.lessonStartTime).Format('MM-dd hh:mm');
					taskItem.endTime = new Date(item.lessonEndTime).Format('hh:mm');
					taskItem.storeName = item.storeName;
					taskList.push(Object.assign({}, taskItem));
				});

				this.setState({ taskList });
			}
		});
	}

	/*点击课堂列表*/
	handleEditSign(id, type, tit) {
		localStorage.setItem('studInfo',JSON.stringify({ title: tit }));
		this.props.history.push(`/mdtask/${id}/${type}`);
	}

	render() {
		
		const { type, taskList } = this.state;

		return (
			<div className="csignin-container tkcourse-container">
				<div className="course-operat">
					<Flex justify="around" className="operat-title">
						<div className={type == 0 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(0)}>待批改</div>
						<div className={type == 1 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(1)}>已批改</div>
					</Flex>	
				</div>
				<div className="csignin-list">
					<div className="course-wait">
						{	
							taskList.length > 0 &&
							taskList.map((item, index) => (
								<div key={index}>
									<div className="ccircle"><i></i></div>
									<div className="task-item">
										<Button className="course-des" onClick={() => this.handleEditSign(item.id, type, item.name)} href="javascript: ">
											<p>{item.name}</p>
											<span className="store">{item.storeName}</span>
											<span className="time">{item.startTime}-{item.endTime}</span>
										</Button>
									</div>
								</div>
							))
						}
						{ taskList.length == 0 && <p className="no-data">暂无数据</p> }
					</div>
				</div>			
			</div>
		)
	}
}

export default TaskCourse;