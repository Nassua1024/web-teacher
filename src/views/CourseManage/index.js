import React, { Component } from 'react';
import { Flex } from 'antd-mobile';

import CourseContent from '@/components/CourseContent';
import CourseEvaluation from '@/components/CourseEvaluation';
import CourseTask from '@/components/CourseTask';
import TaskDContent from '@/components/TaskDContent';
import { context } from '@/api';
import { getItem, formatTime } from '@/utils';
import Http from '@/utils/base';
import './index.less';

class CourseManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searched: false,
			type: 1,
			courseContent: '',
			course: null,
			contents: [],
			items: [],
			lsp: [] //课堂掠影用
		}

		this.handleChangeType = this.handleChangeType.bind(this);
	}

	componentWillMount() {
		const course = getItem('CURRENT_COURSE');

		document.title = '课程管理';
		this.setState({ course });
	}

	componentDidMount() {
		this.searchTeacherDes();
	}

	searchTeacherDes = () => {
		const _this = this;
		const { courseid } = _this.props.match.params;

		Http.ajax(`${context}/lesson-schedules/${courseid}`).then(res => {
			if (res.code == '0') {
				const data = res.data;

				_this.setState({
					course: data.lessonScheduleDetail,
					lsp: data.lessonSchedulePictures,
					items: data.items,
					contents: data.contents,
					searched: true,
					courseContent: _this.setContent(data)
				});
			}
		});	
	}

	setContent = (data) => {
		const { contents, items } = data;
		let text = '';

		if (contents.length != 0) {
			text = contents[0].value;
		} else {
			if (items.length != 0) {
				items.map((item, key) => {
					if (item.itemType == 'WORD') {
						text += item.value
					}
				});	
			}
		}

		return text;
	}

	handleChangeType(type) {
		this.setState({ type })
	}

	uploadPicBack = (pics) => {
		this.setState({
			lsp: pics
		});
	}

	changeComment = (txt) => {
		const { course } = this.state;

		this.setState({
			course: { ...course, teacherComment: txt }
		});
	}

	changePublishedStatus = () => {
		const { course } = this.state;
		
		this.setState({
			type: 3,
			course: { ...course, published: true }	
		})
	}

	render() {
		const { type, course, lsp, contents, items, searched, courseContent } = this.state;
		const bTime = formatTime(course.lessonStartTime);
		const eTime = formatTime(course.lessonEndTime);
		const published = course.published;

		return (
			<div className="coursemg-container">
				<div className="title">
					{
						course.makeup ? <p>补课</p> :
							<p>第{course.lessonSequeence}次</p>
					}
					<Flex justify="around">
						<Flex.Item className="tcenter">{course.courseName}</Flex.Item>
						<Flex.Item className="tcenter">{bTime} —— {eTime}</Flex.Item>
					</Flex>
				</div>
				<div className="course-operat">
					<Flex justify="around" className="operat-title">
						<div className={type == 1 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(1)}>课堂内容</div>
						<div className={type == 2 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(2)}>课堂评价</div>
						<div className={type == 3 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(3)}>布置作业</div>
					</Flex>
					<div className="coursemg-content">
						{
							type == 1 ? <CourseContent course={course} contents={contents} items={items} searched={searched} courseContent={courseContent} searchTeacherDes={this.searchTeacherDes} /> : 
								type == 2 ? <CourseEvaluation course={course} pictures={lsp} uploadPicBack={this.uploadPicBack} changeComment={this.changeComment} /> : 
									published ? <TaskDContent course={course} /> : <CourseTask course={course} parentCall={this.changePublishedStatus} />
						}
					</div>			
				</div>	
			</div>
		)
	}
}

export default CourseManage;