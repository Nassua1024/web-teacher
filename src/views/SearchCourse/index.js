import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Flex, Icon, DatePicker, List, Modal, Button } from 'antd-mobile';

import WeekTime from '@/components/WeekTime';
import { URL } from '@/api';
import { formatDate, getItem, addItem, formatTime } from '@/utils';
import Http from '@/utils/base';
import './index.less';

const fd = (str) => {
	const arr = str.split('-');

	return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
}

const mkup = getItem('makeup');

@withRouter
class SearchCourse extends Component {
	static defaultProps = {
		weekMap : { 0: '星期日', 1: '星期一', 2: '星期二', 3: '星期三', 4: '星期四', 5: '星期五', 6: '星期六' },
		timeMap: { '9_00': '9_00', '10_30': '10_30', '13_00': '13_00', '14_30': '14_30', '16_00': '16_00', '16_30': '18_30' }
	}
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			visible: false,
			date: new Date(Date.now()),
			signin: {
				type: 'primary',
				disabled: false
			},
			coursemg: {
				type: 'default',
				disabled: true
			},
			adjustmsg: {
				type: 'primary',
				disabled: false
			},
			delaymsg: {
				type: 'default',
				disabled: true
			},
			searched: false,
			courses: [],
			course: {},
			weeks: [],
			week: new Date().getDay(),
			selectTime: Date.now(),
			nowTime: Date.now(),
			courseTitle: '',
			courseSequeence: '',
			startTime: '', // 课程开始时间
			endTime: '', // 课程结束时间
			lessonScheduleId: null,	// 课程Id
		};

		this.changeDate = this.changeDate.bind(this);
		this.handleSearchCourse = this.handleSearchCourse.bind(this);
		this.handleSignIn = this.handleSignIn.bind(this);
		this.handleCourseMg = this.handleCourseMg.bind(this);
		this.handleShowOperateModel = this.handleShowOperateModel.bind(this);
	}

	componentDidMount() {

		document.title = '秦汉胡同';
		const arr = window.location.href.split('?');
		const date = arr.length > 1 ? arr[1].split('=')[1] : '';

		this.handleSearchCourse(date);
	}

	componentWillUnmount() {}

	changeDate(date) {
		const _this = this;
		const cdate = formatDate(date.getTime()).split(' ')[0];

		this.setState({ 
			date: date, 
			visible: false,
			week: date.getDay(),
			selectTime: date.getTime()
		}, () => _this.handleSearchCourse(cdate));
	}

	handleSearchCourse(d) {
		const _this = this;
		const params = {
			data: {
				date: d
			}
		}

		Http.ajax(URL.lesson_schedules, params).then(res => {
			if (res.code == '0') {
				const data = res.data;

				this.setState({
					date: new Date(data.selectTime),
					courses: data.lessonScheduleList,
					weeks: data.weeks,
					week: new Date(data.selectTime).getDay(),
					nowTime: data.nowTime,
					selectTime: data.selectTime,
					searched: true
				});
			}
		});
	}

	handleSignIn() {
		const { course } = this.state;
		const { history } = this.props;
		const currentHours = new Date().getHours();

		// 已销课或者布置完作业进入查看页面，其余全部进签到页面 
		this.setState({ 
			modal: false 
		}, () => {
			if (course.marketLesson || course.published) {
				history.push(`/dscourse/${course.lessonScheduleId}`);	
			} else {
				addItem('makeup', { date: '', time: '', startTime: '', endTime: '', storeId: '', classroomId: '', courseId: '', students: [] });
				history.push(`/edcourse/${course.lessonScheduleId}`);	
			}
		});
	}

	handleCourseMg() {
		const { course } = this.state;

		this.setState({ 
			modal: false 
		}, () => {
			// 在此处设置一个localStorage
			addItem('CURRENT_COURSE', course);
			this.props.history.push(`/coursemanage/${course.lessonScheduleId}`);
		});
	}

	handleShowOperateModel(course) {
		const {  signed, correctHomework, published, lessonStartTime } = course;
		// const timenow = Date.now();
		// 任何时间都可以点击签到
		/**
		const flag = (timenow < lessonStartTime || published) ? true : false;
		const signin = {
			type: !!flag ? 'default' : 'primary',
			disabled: !!flag ? true : false	
		};
		**/
		// 未签到不能点
		// const flag1 = !signed ? true : false;
		const coursemg = {
			type: !signed ? 'default' : 'primary',
			disabled: !signed ? true : false
		};

		const delaymsg = {
			type: course.makeup ? 'default' : 'primary',
			disabled: course.makeup ? true: false
		}

		this.setState({
			modal: true,	
			course,
			coursemg,
			delaymsg,
			courseTitle: course.courseName,
			courseSequeence: course.lessonSequeence,
			srartTime: course.lessonStartTime,
			endTime: course.lessonEndTime,
			lessonScheduleId: course.lessonScheduleId
		});
	}

	timeLineDom() {
		const timeArr = [9, 10, 11, 12, 13 ,14, 15, 16, 17, 18, 19, 20];

		return timeArr.map(t => {
			return (
				<div key={t} className="time-line">
					<div className="time-text">
						<em>:00</em>
						<strong>{t}</strong>
					</div>
					<div className="line"></div>
				</div>	
			)
		});
	}

	handleAddClass = () => {
		addItem('makeup', { date: '', time: '', startTime: '', endTime: '', storeId: '', classroomId: '', courseId: '', students: [] });
		localStorage.setItem('makedate', new Date(Date.now()));
		
		this.props.history.push(`/addmk`);		
	}

	// 课程调整
	adjustClazz() {

		const { lessonScheduleId, courseTitle } = this.state;

		localStorage.setItem('lessonDate', courseTitle);
		this.props.history.push(`/adjustclass/${lessonScheduleId}`)
	}

	// 调整延期
	delayClazz() {

		const { date, srartTime, endTime, lessonScheduleId ,courseTitle } = this.state;
		
		const lessonDate = {
			courseTitle,
			oldTime: new Date(date).getTime(),
			startTime: new Date(srartTime).Format('hh:mm'),
			endTime: new Date(endTime).Format('hh:mm')
		}

		localStorage.setItem('lessonDate', JSON.stringify(lessonDate));
		this.props.history.push(`/delaycourse/${lessonScheduleId}`);
	}

	render() {
		const { weekMap } = this.props;
		const { visible, date, modal, signin, coursemg, adjustmsg, delaymsg, courses, course, weeks, week, nowTime, selectTime, searched } = this.state;
		const timeLine = this.timeLineDom();
		const fst = formatDate(selectTime).split(' ')[0];
		const fnt = formatDate(nowTime).split(' ')[0];

		return (
			<div className="course-container" >
				<Flex justify="around" className="time-title">
					<div 
						className="time"
						onClick={() => this.setState({ visible: true })} >
						<DatePicker 
							mode="date"
							visible={visible}
							value={date}
							onOk={date => this.changeDate(date)}
							onDismiss={() => this.setState({ visible: false })} />
					    <div>
							<em>{fd(fst)} {weekMap[week]}</em>
					    	<Icon type={'down'} size="sm" />
						</div>
					</div>
					{
						fst != fnt ? <div onClick={() => {this.handleSearchCourse(fnt)}}>回到今天</div> : <div />
					}
				</Flex>
				<div className="time-content">
					{/** timeLine **/}
					{
						(searched && courses.length == 0) ? <div className="no-lesson">当日暂无课程安排！</div> : ''
					}
					{
						courses.map((c, key) => {
							const ti = new Date(c.lessonStartTime);
							//const bt = 't' + ti.getHours() + '_' + ti.getMinutes();
							const bt = formatTime(c.lessonStartTime);
							const et = formatTime(c.lessonEndTime);

							return (
								<div 
									key={key} 
									className={`course-div`}
									onClick={() => this.handleShowOperateModel(c)} >
									<h2>{bt} — {et}</h2>
									<h4>{c.courseName}</h4>
									{ c.makeup == true ? 
										<p>补课  {c.storeName}馆</p> :
										<p>第{c.lessonSequeence}次课  {c.storeName}馆</p>
									}
								</div>
							)
						})	
					}		
				</div>
				<Button className="add-contract" type="primary" onClick={this.handleAddClass}>添加补课</Button>	
				<div className="wk-content">
					<WeekTime weeks={weeks} callbackFn={this.handleSearchCourse} />
				</div>
				<Modal
					className="sg-content"
			        visible={modal}
			        transparent
			        title={course.courseName}
			        onClose={() => this.setState({ modal: false })} >
		          	<div className="signin-content">
		          		<h4>{course.className}</h4>
		         		<div className="btns">
		         			<Button 
		         				type={signin.type} 
		         				disabled={signin.disabled} 
		         				inline
		         				onClick={() => this.handleSignIn()} >
		         				签到销课
		         			</Button>
		         			<Button 
		         				type={coursemg.type} 
		         				disabled={coursemg.disabled} 
		         				inline
		         				onClick={() => this.handleCourseMg()} >
		         				布置作业
		         			</Button>
							<Button 
								type={adjustmsg.type} 
		         				disabled={adjustmsg.disabled}
								onClick={ () => this.adjustClazz() }
							>
								课程调整
							</Button>
							<Button 
								type={delaymsg.type} 
		         				disabled={delaymsg.disabled}
								onClick={ () => this.delayClazz() }
							>
								课程延期
							</Button>
		         		</div>
		          	</div>
			    </Modal>
			</div>
		)
	}
}

export default SearchCourse;