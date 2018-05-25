import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, Button, Picker, Toast, DatePicker } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import { addItem, getItem, removeItem, formatTime, formatDate } from '@/utils';
import './index.less';

import headimg from'@/assets/images/moren.png';

const Item = List.Item;

class AddMakeUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stores:[],
			rules: [],
			classroomDatas: [],
			courses: [],
			makeup: getItem('makeup'),
			date: localStorage.getItem('makedate'),
			ctype: ''
		};
	}

	componentDidMount() {
		const _this = this;
		const { storeId } = this.state.makeup;

		_this.searchStores();
		_this.searchTeachTime();

		if (storeId != '') {
			this.searchClassRoom(storeId);
			this.searchCourse(storeId);	
		}
	}

	searchStores = () => {
		const _this = this;

		Http.ajax(URL.stores, {}).then(res => {
			if (res.code == '0') {
				let { stores } = res.data;

				stores = stores.map(({id: value, name: label}) => ({value, label}));
				_this.setState({ stores });
			}
		});			
	}

	searchTeachTime = () => {
		const _this = this;

		Http.ajax(URL.class_time, {}).then(res => {
			if (res.code == '0') {
				let { rules } = res.data;

				rules = rules.map(rule => {
					const { startTime, endTime } = rule;
					//const start = new Date(startTime).Format('hh:mm');
					//const end = new Date(endTime).Format('hh:mm');

					return { value: startTime + '_' + endTime, label: startTime + '-' + endTime }
				})

				_this.setState({ rules });
			}
		});
	}

	searchClassRoom = (id) => {
		const _this = this;
		const params = {
			data: { storeId: id }
		};

		Http.ajax(URL.store_cr, params).then(res => {
			if (res.code == '0') {
				let { classroomDatas } = res.data;

				classroomDatas = classroomDatas.map(({id: value, name: label}) => ({value, label}));
				_this.setState({ classroomDatas });	
			}
		});	
	}

	searchCourse = (id) => {
		const _this = this;
		const params = {
			data: { storeId: id }
		};

		Http.ajax(URL.store_courses, params).then(res => {
			if (res.code == '0') {
				let { courses } = res.data;

				courses = courses.map(({courseId: value, courseName: label, courseType}) => ({value, label, courseType}));
				_this.setState({ courses });	
			}
		});
	}

	changeValue = (v, type) => {
		let mk = getItem('makeup');
		const { makeup, courses } = this.state;

		mk = { ...makeup, [type]: v[0] };
		if (type == 'storeId') {
			this.searchClassRoom(v);
			this.searchCourse(v);
		}

		if (type == 'courseId') {
			const c = courses.find(c => c.value == v[0]);

			addItem('courseType', c.courseType); // 新增字段
			// this.setState({ ctype: c.courseType });
		}

		this.setState({ makeup: mk });
		addItem('makeup', mk);
	}

	changeDate = v => {
		this.setState({ date: v });

		localStorage.setItem('makedate', v);
	}

	addStu = () => {
		const { storeId, courseId } = this.state.makeup;
		// const { ctype } = this.state;
		
		if (storeId == '') {
			Toast.info('添加学生之前需要先选择分馆！', 1.5);
			return;
		}

		if (courseId == '') {
			Toast.info('添加学生之前需要先选择课程！', 1.5);
			return;	
		}

		this.props.history.push(`/searchstu/${storeId}/mkc`);
	}

	handleDeletePic = (e, id) => {
		e.stopPropagation();
		const { makeup }=this.state;
		const students = makeup.students;

		for (var i = students.length - 1; i >= 0; i--){
			if (students[i].studentId == id){
				students.splice(i, 1);
				break;
			}
		}
		const mk = { ...makeup, students };
		this.setState({
			makeup: mk
		}, addItem('makeup', mk));


	}

	handleSave = () => {
		const _this = this;
		const { makeup, date } = this.state;
		const ti = makeup.time.split('_');
		const curDate = formatDate(new Date(date).getTime()).split(' ')[0];
		//let startTime = curDate + ' ' + new Date(Number(ti[0])).Format('hh:mm'), endTime = curDate + ' ' + new Date(Number(ti[1])).Format('hh:mm');
		let startTime = curDate + ' ' + ti[0], endTime = curDate + ' ' + ti[1];

		const params = {
			method: 'POST',
			formData:false,
			data: { ...makeup, startTime, endTime }
		}

		if (makeup.time == '') {
			Toast.info('请选择时间！', 1.5);
			return;	
		}

		if (makeup.classroomId == '') {
			Toast.info('请选择教室！', 1.5);
			return;	
		}

		if (makeup.students.length == 0) {
			Toast.info('请添加补课学员！', 1.5);
			return;
		}

		Http.ajax(URL.add_makeup, params).then(res => {
			if (res.code == '0') {
				Toast.info('添加补课成功！', 1.5);
				this.props.history.push(`/searchcourse`);
			}
		});
	}

	render() {
		const { stores, rules, classroomDatas, courses, makeup, date } = this.state;
		const students = makeup.students;

		return (
			<div className="makeup-container">
				<List className="mk-content">
					<Picker 
						data={stores} 
						cols={1} 
						value={[makeup.storeId]} 
						className="forss"
						onChange={(v) => this.changeValue(v, 'storeId')} >
			          <List.Item arrow="horizontal">分馆名称</List.Item>
			        </Picker>
			        <DatePicker
			          	mode="date"
			          	value={new Date(date)}
			          	onChange={(v) => this.changeDate(v, 'date')} >
			          	<List.Item arrow="horizontal">日期</List.Item>
			        </DatePicker>
					<Picker 
						data={rules} 
						cols={1} 
						value={[makeup.time]}
						className="forss"
						onChange={(v) => this.changeValue(v, 'time')} >
			          	<List.Item arrow="horizontal">时间</List.Item>
			        </Picker>
					<Picker 
						data={classroomDatas} 
						cols={1} 
						value={[makeup.classroomId]}
						className="forss"
						onChange={(v) => this.changeValue(v, 'classroomId')} >
			          <List.Item arrow="horizontal">教室</List.Item>
			        </Picker>
					<Picker 
						data={courses} 
						cols={1} 
						value={[makeup.courseId]}
						className="forss"
						onChange={(v) => this.changeValue(v, 'courseId')} >
			          <List.Item arrow="horizontal">课程</List.Item>
			        </Picker>
		        </List>
		        <div className="st-list">
					{
						students.map((item, index)=> {
							return (
								<div  key={index} className="st-groupdiv">
									<div className="st-div" onClick={() => this.changeSignInType(item.studentId)}>
										<img src={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')} alt="" />
										<i onClick={(e) => this.handleDeletePic(e, item.studentId)}></i>
									</div>
									<p>{item.studentName}</p>
								</div>
							)
						})
					}
					<div  className="st-groupdiv">
						<div className="st-div add-st" onClick={this.addStu}>
							<span className="plus icon "></span>
						</div>
						<p>添加学员</p>
					</div>
				</div>	
				<div className="ButtonGroup">
					<p>仅限于单次补课，如开设常规新班，请联系馆长和顾问开课</p>
					<Button  onClick={this.handleSave}>保存</Button>
				</div>
			</div>
		)
	}
}

export default AddMakeUp;