import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, List, Checkbox, Button, Modal, Toast, Picker } from 'antd-mobile';

import { URL } from '@/api';
import { context } from '@/api';
import Http from '@/utils/base';
import './index.less';

const CheckboxItem = Checkbox.CheckboxItem;
const Item = List.Item;

class CourseTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modal1: false,
			modal2: false,
			type: 'READING', // READING: 朗读，COMPOSITION: 作文，VIDIO_TEXT: 行为
			typeComment: '',
			comment: '',
			edit: '',
			autoTasks: {},
			autoTask: {
				READING: '',	
				COMPOSITION: '',
				VIDIO_TEXT: ''
			},
			works: [],
			selectwork: [],
			timelist: [
				{label: '1天后', value: 1},
				{label: '2天后', value: 2},
				{label: '3天后', value: 3},
				{label: '4天后', value: 4},
				{label: '5天后', value: 5},
				{label: '6天后', value: 6},
				{label: '7天后', value: 7}
			],
			day: 2
		}
	}

	componentDidMount() {
		const _this = this;
		const { lessonId, makeup } = _this.props.course;

		if (!makeup) {
			Http.ajax(`${context}/lesson/${lessonId}/homeworks`).then(res => {
				if (res.code == '0') {
					const data = res.data;

					this.setState({
						works: data.types
					});
				}
			});
		}
	}

	onChange = (e, c) => {
		//console.log(c);
		const { lessonScheduleId, teacherId } = this.props.course;
		const { selectwork } = this.state;
		if (e.target.checked) {
			selectwork.push({
				homeworkId: c.homeworkId,
				lessonScheduleId,
				teacherId	
			});		
		} else {
			const index = selectwork.findIndex(s => s.homeworkId == c.homeworkId);
			
			selectwork.splice(index, 1);
		}
		this.setState({ selectwork });
	}

	autoNewTask = () => {
		alert('自定义作业');
	}

	handleSave = () => {
		const { courseId, lessonId, lessonScheduleId, teacherId } = this.props.course;
		const { selectwork, type, comment, autoTasks, day } = this.state;
		const sl = selectwork.length;
		let autot = [];
		let data = {};
		let params = {
			method: 'POST',
			formData: false
		}

		if (sl == 0 && Object.keys(autoTasks).length == 0) {
			// 弹窗提示这节课是否不布置作业
			this.setState({
				modal: true
			});
			return;
		}
		// 此处自定义作业
		for (var key in autoTasks) {
			const cm = autoTasks[key];

			if (cm.checked) 
				autot.push({
					content: cm.comment,
					courseId,
					lessonId,
					lessonScheduleId,
					teacherId,
					type: cm.type	
				});
		}
		data = {
			homeworkFlag: true,
			day,
			saveHomeworks: sl > 0 ? selectwork : [],
			addHomeworks: autot 	
		}
		params['data'] = data;
		this.saveAjax(params);
	}

	saveAjax = (params) => {
		const _this = this;
		const { lessonScheduleId } = this.props.course;

		Http.ajax(`${context}/lesson-schedules/${lessonScheduleId}/publish`, params).then(res => {
			if (res && res.code == '0') {
				Toast.info('发布成功 !', 1);	
				//页面跳转 到预览页
				_this.props.parentCall();
			}
		});
	}

	changeComment = (e) => {
		this.setState({
			comment: e.target.value
		});	
	}

	onClose = (type) => {
		this.setState({
			[type]: false
		});
	}
	saveNoHomeWork = () => {
		const params = {
			method: 'POST',
			formData: false,
			data: {
				homeworkFlag: false,
				day: 1,
				saveHomeworks: [],
				addHomeworks: []	
			}	
		}
		this.setState({
			modal: false
		}, () => this.saveAjax(params));
	}

	changeEndTime = (t) => {
		this.setState({
			day: t[0]
		});
	}

	handleShowModal = (modal, other) => {
		if (other) {
			this.setState({
				[modal]: true,
				edit: ''
			});
		} else {
			this.setState({
				[modal]: true
			});
		}
	}

	handleCancleModal2 = () => {
		const _this = this;

		this.setState({
			modal2: false
		}, () => {
			_this.setState({
				comment: '', 
				type: 'READING'
			})
		});
	}

	changeAutoType = (type) => {
		this.setState({
			type
		})
	}

	handleSaveAutoTask = () => {
		const { type, comment, autoTasks, edit } = this.state;
		const key = edit != '' ? edit : Date.now();
		let ak;

		if (comment == '') {
			Toast.info('作业内容不能为空 !', 1);
			return;
		}

		if (edit == '') {
			ak = { type, comment, checked: true }
		} else {
			ak = { ...autoTasks[edit], type, comment }
		}

		this.setState({
			modal2: false,
			type: 'READING',
			comment: '',
			edit: '',
			autoTasks: { ...autoTasks, [key]: ak }
		});
	}

	onChangeAuto = (e, at, atk) => {
		const { autoTasks } = this.state;

		this.setState({
			autoTasks: { ...autoTasks, [atk]: { ...at, checked: e.target.checked } }
		})
	}

	handleEditAuto = (e, at, atk) => {
		e.stopPropagation();
		
		this.setState({
			modal2: true,
			edit: atk,
			type: at.type,
			comment: at.comment
		});
	}

	render() {
		const { works, type, comment, modal, timelist, day, modal1, modal2, autoTasks } = this.state;
		const atkeys = Object.keys(autoTasks);

		return (
			<div className="ctask-container">
				<div className="task-list">
					<div className="task-content">
						{
							works.map((type, key) => {
								return (
									<List key={key} renderHeader={() => <div><span/>{type.typeName}</div>} >
										{type.homeworks.map((h, i) => (
								          	<CheckboxItem key={i} onChange={(e) => this.onChange(e, h)}>
								            	{i+1}. {h.content}
								          	</CheckboxItem>
								        ))}	
									</List>
								)
							})
						}
					</div>
					<div className="auto-task">
						<div className="auto-title1"><span/>自定义作业</div>
						<div className="ac-check am-list">
							{
								atkeys.map((atk, k) => {
									const at = autoTasks[atk];

									return (
										<CheckboxItem key={k} defaultChecked={true} onChange={(e) => this.onChangeAuto(e, at, atk)}>
							            	<span>{k+1}. {at.comment}</span> <div className="edit-td" onClick={(e) => this.handleEditAuto(e, at, atk)}>编辑</div>
							          	</CheckboxItem>	
									)
								})
							}
						</div>
						<div className="addatuo" onClick={() => this.handleShowModal('modal2', 'false')}>添加自定义作业</div>
			      	</div>
				</div>
				<div className="last-time-t">
					<Picker 
						cols={1}
						data={timelist}
						value={[day]} 
						onChange={this.changeEndTime} >
			          	<List.Item arrow="horizontal">截止时间</List.Item>
			        </Picker>
		        </div>
				<div className="primary" onClick={() => this.handleShowModal('modal1')}>保存并发布</div>

				<Modal
					className="published-tip"
					visible={modal1}
					transparent
					maskClosable={false}
					onClose={() => this.onClose('modal1')}
					footer={[
						{ text: '取消', onPress: () => this.onClose('modal1') }, 
						{ text: '确认', onPress: () => this.handleSave() }
					]} >
		          	<div>
		         		<p>是否确认发布？</p>
		         		<p>作业发布后将不能修改课堂评价。</p>	
		          	</div>
		        </Modal>

				<Modal
					className="save-tip"
					visible={modal}
					transparent
					maskClosable={false}
					onClose={() => this.onClose('modal')}
					footer={[
						{ text: '取消', onPress: () => this.onClose('modal') }, 
						{ text: '确认', onPress: () => this.saveNoHomeWork() }
					]} >
		          	<div>
		         		这节课是否确定不布置作业？
		          	</div>
		        </Modal>

		        <Modal
					className="auto-tip"
					visible={modal2}
					transparent
					maskClosable={false}
					onClose={() => this.onClose('modal2')} >
		          	<div>
		          		<div className="close-modal2" onClick={this.handleCancleModal2}><span>×</span></div>
		          		<p>自定义作业</p>
		         		<div className="check-radio">
		         			<div>
		         				<label>
		         					<input type="radio" name="autotype" onClick={() => this.changeAutoType('READING')} />
		         					<span className={type == 'READING' ? 'active' : ''}></span>
		         				</label>
		         				<span className="txtf">朗读作业</span>	
		         			</div>
		         			<div>
		         				<label>
		         					<input type="radio" name="autotype" onClick={() => this.changeAutoType('COMPOSITION')} />
		         					<span className={type == 'COMPOSITION' ? 'active' : ''}></span>
		         				</label>
		         				<span className="txtf">作文作业</span>	
		         			</div>
		         			<div>
		         				<label>
		         					<input type="radio" name="autotype" onClick={() => this.changeAutoType('VIDIO_TEXT')} />
		         					<span className={type == 'VIDIO_TEXT' ? 'active' : ''}></span>
		         				</label>
		         				<span className="txtf">行为作业</span>	
		         			</div>		
		         		</div>	
		         		<textarea 
		         			className="autotxt" 
		         			rows="6" 
		         			placeholder="请填写作业内容"
		         			value={comment} 
		         			onChange={(e) => this.changeComment(e)} >
		         		</textarea>
		          	</div>
		          	<Button type="primary" size="small" onClick={this.handleSaveAutoTask}>确认</Button>
		        </Modal>
			</div>
		)
	}
}

CourseTask.PropTypes = {
	course: PropTypes.object,
	parentCall: PropTypes.func
}

export default CourseTask;